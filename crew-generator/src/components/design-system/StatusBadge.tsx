import { Badge } from '../ui/badge'

import { type ReactNode } from 'react'

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'full' | 'available'
  children: ReactNode
  className?: string
}

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    full: 'bg-red-100 text-red-800 border-red-200',
    available: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <Badge 
      variant="outline" 
      className={`${variants[status]} border font-medium ${className}`}
    >
      {children}
    </Badge>
  )
}
