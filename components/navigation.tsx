"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, ClipboardList, Home, Plus } from "lucide-react"
import { NotificationBadge } from "./notification-badge"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "New Order", href: "/orders/new", icon: Plus },
  { name: "All Orders", href: "/orders", icon: ClipboardList },
  { name: "Daily Work", href: "/daily", icon: Calendar },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="font-serif text-2xl font-bold text-primary">Bella Boutique</h1>
          </div>
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const showNotification = item.href === "/daily" || item.href === "/orders"

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors relative",
                    pathname === item.href
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {showNotification && (
                    <NotificationBadge className="absolute -top-1 -right-2 min-w-[1.25rem] h-5 text-xs flex items-center justify-center" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
