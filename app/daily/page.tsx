"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getOrdersDueToday, updateOrder } from "@/lib/orders"
import type { Order, OrderStatus } from "@/lib/types"
import { Calendar, CheckCircle, Clock, AlertTriangle, Phone } from "lucide-react"

export default function DailyWorkPage() {
  const { toast } = useToast()
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([])
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    loadTodaysOrders()
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  const loadTodaysOrders = () => {
    const orders = getOrdersDueToday()
    setTodaysOrders(orders)
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updatedOrder = updateOrder(orderId, { status: newStatus })
    if (updatedOrder) {
      loadTodaysOrders()
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      })
    }
  }

  const getStatusBadgeVariant = (status: OrderStatus) => {
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertTriangle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const pendingOrders = todaysOrders.filter((order) => order.status === "pending")
  const inProgressOrders = todaysOrders.filter((order) => order.status === "in-progress")
  const completedOrders = todaysOrders.filter((order) => order.status === "completed")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Today's Work</h1>
              <p className="text-muted-foreground">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.length}</div>
              <p className="text-xs text-muted-foreground">Orders to start</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressOrders.length}</div>
              <p className="text-xs text-muted-foreground">Active work</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
              <p className="text-xs text-muted-foreground">Finished today</p>
            </CardContent>
          </Card>
        </div>

        {todaysOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No orders due today</h3>
              <p className="text-muted-foreground mb-6">
                Enjoy your day! No dress orders are scheduled for completion today.
              </p>
              <div className="text-sm text-muted-foreground">
                Check the{" "}
                <a href="/orders" className="text-primary hover:underline">
                  All Orders
                </a>{" "}
                page to see your upcoming work.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pending Orders */}
            {pendingOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                    Pending Orders ({pendingOrders.length})
                  </CardTitle>
                  <CardDescription>Orders that need to be started today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{order.customerName}</h4>
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            >
                              Due Today
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Phone className="w-3 h-3 mr-1" />
                            <a href={`tel:${order.contactNumber}`} className="hover:text-primary hover:underline">
                              {order.contactNumber}
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{order.itemDetails}</p>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                {order.status.replace("-", " ")}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* In Progress Orders */}
            {inProgressOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
                    In Progress ({inProgressOrders.length})
                  </CardTitle>
                  <CardDescription>Orders currently being worked on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inProgressOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{order.customerName}</h4>
                            <Badge
                              variant="default"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              In Progress
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Phone className="w-3 h-3 mr-1" />
                            <a href={`tel:${order.contactNumber}`} className="hover:text-primary hover:underline">
                              {order.contactNumber}
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{order.itemDetails}</p>
                          <div className="text-xs text-muted-foreground">
                            Started: {new Date(order.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                {order.status.replace("-", " ")}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Orders */}
            {completedOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Completed Today ({completedOrders.length})
                  </CardTitle>
                  <CardDescription>Orders finished today - great work!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{order.customerName}</h4>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200"
                            >
                              Completed
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Phone className="w-3 h-3 mr-1" />
                            <a href={`tel:${order.contactNumber}`} className="hover:text-primary hover:underline">
                              {order.contactNumber}
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{order.itemDetails}</p>
                          <div className="text-xs text-muted-foreground">
                            Completed: {new Date(order.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Daily Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Daily Workflow Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Morning Routine</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Review all orders due today</li>
                  <li>• Prepare materials and workspace</li>
                  <li>• Start with the most complex items first</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Progress Tracking</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Update status as you work</li>
                  <li>• Mark completed orders immediately</li>
                  <li>• Note any delays or issues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
