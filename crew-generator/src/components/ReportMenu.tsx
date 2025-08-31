import { useState } from 'react'
// import { MoreVertical } from 'lucide-react' // Commented out - using Ionic ellipsisVertical icon instead
import { IonicButton } from '@/components/ui/ionic-button'
import { ellipsisVertical } from 'ionicons/icons'
// import { Button } from '@/components/ui/button' // Commented out - using IonicButton instead
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
          <IonicButton 
            variant="ghost" 
            icon={ellipsisVertical}
            className={`h-8 w-8 p-0 text-gray-500 hover:text-gray-700 ${className}`}
          >
            <span className="sr-only">More options</span>
          </IonicButton>
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
