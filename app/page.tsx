"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Package, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { getOrders, getOrdersDueToday, getOrdersDueSoon } from "@/lib/orders"
import { getCustomers } from "@/lib/customers"
import type { Order } from "@/lib/types"
import Link from "next/link"

export default function HomePage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    dueToday: 0,
    inProgress: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [urgentOrders, setUrgentOrders] = useState<Order[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const allOrders = getOrders()
    const todaysOrders = getOrdersDueToday()
    const dueSoonOrders = getOrdersDueSoon()

    // Calculate stats
    const inProgressCount = allOrders.filter((order) => order.status === "in-progress").length
    const totalCustomersCount = getCustomers().length

    setStats({
      totalOrders: allOrders.length,
      dueToday: todaysOrders.length,
      inProgress: inProgressCount,
      totalCustomers: totalCustomersCount,
    })

    // Get recent orders (last 5)
    const sortedOrders = [...allOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setRecentOrders(sortedOrders.slice(0, 5))

    // Set urgent orders
    setUrgentOrders(dueSoonOrders)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome to PM Designer</h1>
          <p className="text-muted-foreground">Manage your dress design and stitching orders with elegance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dueToday}</div>
              <p className="text-xs text-muted-foreground">Orders due today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active orders</p>
            </CardContent>
          </Card>

          <Link href="/customers">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Registered profiles</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {urgentOrders.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Urgent: Orders Due Soon ({urgentOrders.length})
              </CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                These orders are due today or tomorrow and need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{order.customerName}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                          {order.status.replace("-", " ")}
                        </Badge>
                        {order.dueDate === new Date().toISOString().split("T")[0] && (
                          <Badge variant="destructive" className="text-xs">
                            Due Today
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{order.itemDetails}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Due: {formatDate(order.dueDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/daily">
                  <Button size="sm">View Daily Work</Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest dress orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders yet. Create your first order to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.customerName}</span>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                            {order.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{order.itemDetails}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">Due: {formatDate(order.dueDate)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Orders that need attention soon</CardDescription>
            </CardHeader>
            <CardContent>
              {urgentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No upcoming deadlines</div>
              ) : (
                <div className="space-y-3">
                  {urgentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {order.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">Due: {formatDate(order.dueDate)}</div>
                      </div>
                    </div>
                  ))}
                  {urgentOrders.length > 3 && (
                    <div className="text-center pt-2">
                      <Link href="/orders" className="text-sm text-primary hover:underline">
                        View {urgentOrders.length - 3} more urgent orders
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
