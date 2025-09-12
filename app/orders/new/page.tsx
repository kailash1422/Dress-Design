"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveOrder } from "@/lib/orders"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    itemDetails: "",
    dueDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.customerName.trim() ||
      !formData.contactNumber.trim() ||
      !formData.itemDetails.trim() ||
      !formData.dueDate
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const order = saveOrder({
        customerName: formData.customerName.trim(),
        contactNumber: formData.contactNumber.trim(),
        itemDetails: formData.itemDetails.trim(),
        dueDate: formData.dueDate,
        status: "pending",
      })

      toast({
        title: "Order Created",
        description: `Order for ${order.customerName} has been successfully created.`,
      })

      router.push("/orders")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Create New Order</h1>
          <p className="text-muted-foreground">Add a new dress order to your business</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Fill in the information for the new dress order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer's full name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="Enter customer's phone number"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">Phone number for order updates and fitting appointments</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemDetails">Item Details *</Label>
                <Textarea
                  id="itemDetails"
                  placeholder="Describe the dress design, measurements, fabric, colors, special requirements, etc."
                  value={formData.itemDetails}
                  onChange={(e) => handleInputChange("itemDetails", e.target.value)}
                  className="w-full min-h-[120px] resize-y"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Include design details, measurements, fabric preferences, and any special instructions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="w-full"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <p className="text-xs text-muted-foreground">Select the date when the dress should be completed</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating Order..." : "Create Order"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/orders")} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-accent/50 rounded-lg">
          <h3 className="font-medium text-accent-foreground mb-2">Tips for Order Details</h3>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• Include specific measurements (bust, waist, hips, length)</li>
            <li>• Mention fabric type and color preferences</li>
            <li>• Note any special design elements or embellishments</li>
            <li>• Add fitting appointment dates if applicable</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
