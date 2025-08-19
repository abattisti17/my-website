import { supabase } from './supabase'

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Storage limits to conserve space
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB per file
const MAX_USER_FILES = 10 // Max 10 files per user across all events
const MAX_EVENT_FILES = 20 // Max 20 files per event

/**
 * Check if user has reached their storage limits
 */
async function checkStorageLimits(userId: string, eventId: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    // Check user's total file count across all events
    const { count: userFileCount, error: userCountError } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)

    if (userCountError) {
      console.error('Error checking user file count:', userCountError)
      return { allowed: true } // Allow on error to avoid blocking
    }

    if ((userFileCount || 0) >= MAX_USER_FILES) {
      return { 
        allowed: false, 
        error: `You've reached your limit of ${MAX_USER_FILES} photos. Please delete some photos first.` 
      }
    }

    // Check event's total file count
    const { count: eventFileCount, error: eventCountError } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (eventCountError) {
      console.error('Error checking event file count:', eventCountError)
      return { allowed: true } // Allow on error to avoid blocking
    }

    if ((eventFileCount || 0) >= MAX_EVENT_FILES) {
      return { 
        allowed: false, 
        error: `This event has reached its limit of ${MAX_EVENT_FILES} photos.` 
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Storage limit check failed:', error)
    return { allowed: true } // Allow on error to avoid blocking
  }
}

/**
 * Resizes an image file client-side using canvas and converts to WebP
 * @param file - The image file to resize
 * @param maxWidth - Maximum width (default: 800px - smaller to save space)
 * @param quality - WebP quality (default: 0.7 - lower for smaller files)
 * @returns Promise<Blob> - The resized image as WebP blob
 */
export async function resizeImageToWebP(
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and resize image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image to WebP'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Uploads an event image to Supabase Storage
 * @param file - The image file to upload
 * @param eventId - The event ID for organizing files
 * @returns Promise<UploadResult> - Upload result with URL or error
 */
export async function uploadEventImage(file: File, eventId: string): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (strict limit for storage conservation)
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size must be less than 2MB. Please compress your image first.'
      }
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    // Check storage limits before upload
    const limitCheck = await checkStorageLimits(user.id, eventId)
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: limitCheck.error || 'Storage limit reached'
      }
    }

    // Resize image to WebP
    console.log('🖼️ Resizing image...')
    const resizedBlob = await resizeImageToWebP(file)
    
    // Check if compressed image is still too large
    if (resizedBlob.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'Image is too large even after compression. Please use a smaller image.'
      }
    }

    console.log(`📊 Original: ${(file.size / 1024).toFixed(1)}KB → Compressed: ${(resizedBlob.size / 1024).toFixed(1)}KB`)
    
    // Generate file path: media/{userId}/{eventId}/{timestamp}.webp
    const timestamp = Date.now()
    const fileName = `${timestamp}.webp`
    const filePath = `${user.id}/${eventId}/${fileName}`

    console.log('📤 Uploading to:', filePath)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, resizedBlob, {
        contentType: 'image/webp',
        upsert: false // Don't overwrite existing files
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Failed to get public URL'
      }
    }

    console.log('✅ Upload successful:', urlData.publicUrl)

    return {
      success: true,
      url: urlData.publicUrl
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Uploads media and saves metadata to database
 * @param file - The image file
 * @param eventId - Event ID
 * @param podId - Optional pod ID for pod-specific media
 */
export async function uploadAndSaveMedia(
  file: File, 
  eventId: string, 
  podId?: string
): Promise<UploadResult> {
  try {
    // Upload the file
    const uploadResult = await uploadEventImage(file, eventId)
    
    if (!uploadResult.success || !uploadResult.url) {
      return uploadResult
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    // Save metadata to media table
    const { error: dbError } = await supabase
      .from('media')
      .insert({
        url: uploadResult.url,
        kind: 'image', // All uploads are images for now
        event_id: eventId,
        owner_id: user.id,
        pod_id: podId || null // null for event photos, podId for pod-specific media
      })

    if (dbError) {
      console.error('Database error:', dbError)
      
      // Try to clean up uploaded file if database insert fails
      try {
        const filePath = uploadResult.url.split('/media/')[1]
        await supabase.storage.from('media').remove([filePath])
        console.log('🗑️ Cleaned up orphaned file')
      } catch (cleanupError) {
        console.warn('Failed to cleanup file:', cleanupError)
      }

      return {
        success: false,
        error: `Failed to save media info: ${dbError.message}`
      }
    }

    return {
      success: true,
      url: uploadResult.url
    }

  } catch (error) {
    console.error('Upload and save error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
