import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IonicButton } from '@/components/ui/ionic-button'
import { send, close } from 'ionicons/icons'
// import { Button } from '@/components/ui/button' // Commented out - using IonicButton instead
import { Textarea } from '@/components/ui/textarea'
import { submitReport, type ReportTargetType } from '../lib/reports'

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  targetType: ReportTargetType
  targetId: string
  onReportSubmitted?: () => void
}

export default function ReportDialog({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  onReportSubmitted 
}: ReportDialogProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (submitting) return

    setSubmitting(true)
    
    const success = await submitReport({
      targetType,
      targetId,
      reason: reason.trim() || undefined
    })

    if (success) {
      setReason('')
      onClose()
      onReportSubmitted?.()
    }

    setSubmitting(false)
  }

  const handleClose = () => {
    if (!submitting) {
      setReason('')
      onClose()
    }
  }

  const getTargetLabel = () => {
    switch (targetType) {
      case 'message': return 'message'
      case 'post': return 'post'
      case 'media': return 'photo'
      case 'profile': return 'user'
      default: return 'content'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {getTargetLabel()}</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. What's wrong with this {getTargetLabel()}?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={`Why are you reporting this ${getTargetLabel()}? (optional)`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={500}
            disabled={submitting}
          />
          
          <div className="flex gap-3 justify-end">
            <IonicButton 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={submitting}
              icon={close}
            >
              Cancel
            </IonicButton>
            <IonicButton 
              type="submit" 
              disabled={submitting}
              variant="destructive"
              icon={send}
            >
              {submitting ? 'Reporting...' : 'Report'}
            </IonicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
