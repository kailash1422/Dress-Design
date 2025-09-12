export interface Order {
  id: string
  customerName: string
  contactNumber: string
  itemDetails: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
  updatedAt: string
}

export type OrderStatus = Order["status"]
