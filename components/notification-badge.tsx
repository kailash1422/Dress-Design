"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getOrdersDueSoon } from "@/lib/orders"

interface NotificationBadgeProps {
  className?: string
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const [urgentCount, setUrgentCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const urgentOrders = getOrdersDueSoon()
      setUrgentCount(urgentOrders.length)
    }

    updateCount()

    // Update every minute to keep notifications current
    const interval = setInterval(updateCount, 60000)

    return () => clearInterval(interval)
  }, [])

  if (urgentCount === 0) return null

  return (
    <Badge variant="destructive" className={className}>
      {urgentCount}
    </Badge>
  )
}
