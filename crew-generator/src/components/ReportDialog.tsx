import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {submitting ? 'Reporting...' : 'Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
