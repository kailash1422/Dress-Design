"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { getOrders, updateOrder, deleteOrder } from "@/lib/orders"
import type { Order, OrderStatus } from "@/lib/types"
import { Calendar, Filter, Plus, Search, Trash2, Phone } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dueDateFilter, setDueDateFilter] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, dueDateFilter])

  const loadOrders = () => {
    const loadedOrders = getOrders()
    setOrders(loadedOrders)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.itemDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Due date filter
    if (dueDateFilter) {
      filtered = filtered.filter((order) => order.dueDate === dueDateFilter)
    }

    // Sort by due date (earliest first)
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    setFilteredOrders(filtered)
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updatedOrder = updateOrder(orderId, { status: newStatus })
    if (updatedOrder) {
      loadOrders()
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      })
    }
  }

  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete the order for ${customerName}?`)) {
      const success = deleteOrder(orderId)
      if (success) {
        loadOrders()
        toast({
          title: "Order Deleted",
          description: `Order for ${customerName} has been deleted`,
        })
      }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate: string, status: OrderStatus) => {
    if (status === "completed") return false
    return new Date(dueDate) < new Date()
  }

  const isDueSoon = (dueDate: string, status: OrderStatus) => {
    if (status === "completed") return false
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 2 && diffDays >= 0
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">All Orders</h1>
            <p className="text-muted-foreground">Manage and track all your dress orders</p>
          </div>
          <Link href="/orders/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </CardTitle>
            <CardDescription>Filter orders by search, status, or due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by customer, phone, or item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value)}
                />
              </div>
            </div>

            {(searchTerm || statusFilter !== "all" || dueDateFilter) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDueDateFilter("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {orders.length === 0
                    ? "Create your first order to get started with managing your dress business"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {orders.length === 0 && (
                  <Link href="/orders/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Order
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Item Details</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className={
                          isOverdue(order.dueDate, order.status)
                            ? "bg-destructive/5"
                            : isDueSoon(order.dueDate, order.status)
                              ? "bg-yellow-50 dark:bg-yellow-950/20"
                              : ""
                        }
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            {isOverdue(order.dueDate, order.status) && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Overdue
                              </Badge>
                            )}
                            {isDueSoon(order.dueDate, order.status) && (
                              <Badge variant="outline" className="text-xs mt-1 border-yellow-500 text-yellow-700">
                                Due Soon
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                            <a href={`tel:${order.contactNumber}`} className="hover:text-primary hover:underline">
                              {order.contactNumber}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm truncate" title={order.itemDetails}>
                              {order.itemDetails}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(order.dueDate)}
                            {isOverdue(order.dueDate, order.status) && (
                              <div className="text-xs text-destructive">Overdue</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id, order.customerName)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
