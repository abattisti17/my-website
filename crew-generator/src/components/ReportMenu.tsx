import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ReportDialog from './ReportDialog'
import { type ReportTargetType } from '../lib/reports'

interface ReportMenuProps {
  targetType: ReportTargetType
  targetId: string
  onItemHidden?: () => void
  className?: string
}

export default function ReportMenu({ 
  targetType, 
  targetId, 
  onItemHidden,
  className = ""
}: ReportMenuProps) {
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleReportSubmitted = () => {
    // Optimistically hide the item locally
    onItemHidden?.()
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 text-gray-500 hover:text-gray-700 ${className}`}
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => {
              setMenuOpen(false)
              setShowReportDialog(true)
            }}
            className="text-red-600 focus:text-red-700"
          >
            🚨 Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        targetType={targetType}
        targetId={targetId}
        onReportSubmitted={handleReportSubmitted}
      />
    </>
  )
}
