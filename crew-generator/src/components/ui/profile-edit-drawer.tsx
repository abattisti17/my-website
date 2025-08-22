import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Checkbox } from "./checkbox"
import { Save, X, Edit3 } from "lucide-react"
import {
  ResponsiveModal,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalClose,
  useResponsiveModal,
} from "./enhanced-responsive-modal"

interface ProfileData {
  display_name: string
  ig_url: string
  reveal_ig: boolean
}

interface ProfileEditDrawerProps {
  /** Current profile data */
  profile: ProfileData
  /** Called when profile is saved */
  onSave: (data: ProfileData) => Promise<void>
  /** Loading state for save operation */
  isLoading?: boolean
  /** Custom trigger element (optional) */
  trigger?: React.ReactNode
}

/**
 * Production-ready profile edit drawer/modal with form validation and accessibility
 * Demonstrates best practices for Vaul integration in a real-world scenario
 */
export function ProfileEditDrawer({
  profile,
  onSave,
  isLoading = false,
  trigger,
}: ProfileEditDrawerProps) {
  const { open, setOpen, closeModal } = useResponsiveModal()
  const [formData, setFormData] = React.useState<ProfileData>(profile)
  const [hasChanges, setHasChanges] = React.useState(false)
  
  // Update form data when profile prop changes
  React.useEffect(() => {
    setFormData(profile)
    setHasChanges(false)
  }, [profile])
  
  // Track if form has changes
  React.useEffect(() => {
    const changed = 
      formData.display_name !== profile.display_name ||
      formData.ig_url !== profile.ig_url ||
      formData.reveal_ig !== profile.reveal_ig
    setHasChanges(changed)
  }, [formData, profile])
  
  // Handle form field changes
  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) {
      closeModal()
      return
    }
    
    try {
      await onSave(formData)
      closeModal()
    } catch (error) {
      // Error handling is typically done in the parent component
      console.error('Failed to save profile:', error)
    }
  }
  
  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasChanges) {
      // Could add confirmation dialog here
      setFormData(profile)
      setHasChanges(false)
    }
    setOpen(newOpen)
  }
  
  const defaultTrigger = (
    <Button variant="outline" className="h-9 px-3">
      <Edit3 className="h-4 w-4 mr-2" />
      Edit Profile
    </Button>
  )
  
  return (
    <ResponsiveModal
      isOpen={open}
      setIsOpen={handleOpenChange}
      trigger={trigger || defaultTrigger}
    >
      <form onSubmit={handleSubmit}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Edit Profile</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Update your personal information visible to other crew members
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        
        <div className="space-y-6">
          {/* Display Name Field */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="Enter your display name"
              disabled={isLoading}
              // Accessibility: describe the field
              aria-describedby="display_name_description"
            />
            <p 
              id="display_name_description"
              className="text-sm text-muted-foreground"
            >
              This is how your name will appear to other users
            </p>
          </div>
          
          {/* Instagram URL Field */}
          <div className="space-y-2">
            <Label htmlFor="ig_url">Instagram Profile (Optional)</Label>
            <Input
              id="ig_url"
              type="url"
              value={formData.ig_url}
              onChange={(e) => handleInputChange('ig_url', e.target.value)}
              placeholder="https://instagram.com/yourusername"
              disabled={isLoading}
              aria-describedby="ig_url_description"
            />
            <p 
              id="ig_url_description"
              className="text-sm text-muted-foreground"
            >
              Link to your Instagram profile for crew members to connect
            </p>
          </div>
          
          {/* Reveal Instagram Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reveal_ig"
              checked={formData.reveal_ig}
              onCheckedChange={(checked) => 
                handleInputChange('reveal_ig', checked as boolean)
              }
              disabled={isLoading}
            />
            <Label 
              htmlFor="reveal_ig" 
              className="text-sm font-normal cursor-pointer"
            >
              Make my Instagram visible to other crew members
            </Label>
          </div>
        </div>
        
        <ResponsiveModalFooter sticky className="flex-row gap-3">
          <ResponsiveModalClose asChild>
            <Button 
              type="button"
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </ResponsiveModalClose>
          
          <Button 
            type="submit"
            className="flex-1"
            disabled={isLoading || !hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </ResponsiveModalFooter>
      </form>
    </ResponsiveModal>
  )
}

/**
 * Example usage component showing integration patterns
 */
export function ProfileEditDrawerExample() {
  const [profile, setProfile] = React.useState<ProfileData>({
    display_name: "John Doe",
    ig_url: "https://instagram.com/johndoe",
    reveal_ig: true,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  
  const handleSave = async (data: ProfileData) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setProfile(data)
    setIsLoading(false)
    
    // Show success message (you'd typically use a toast here)
    console.log('Profile saved successfully!', data)
  }
  
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Profile Management</h2>
      
      <div className="space-y-2">
        <p><strong>Current Name:</strong> {profile.display_name}</p>
        <p><strong>Instagram:</strong> {profile.ig_url || 'Not set'}</p>
        <p><strong>Instagram Visible:</strong> {profile.reveal_ig ? 'Yes' : 'No'}</p>
      </div>
      
      <ProfileEditDrawer
        profile={profile}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  )
}
