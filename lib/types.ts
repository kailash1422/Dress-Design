export type MeasurementUnit = "inch" | "cm"

export interface Measurements {
  unit: MeasurementUnit
  // Upper Body
  shoulder: string
  bust: string
  waist: string
  chest: string
  armHole: string
  sleeveLength: string
  bicep: string
  wrist: string
  neckDeepFront: string
  neckDeepBack: string
  // Lower Body
  hips: string
  inseam: string
  waistToKnee: string
  ankle: string
  fullLength: string
  // Indian Wear Specifics (optional)
  kameezLength?: string
  salwarLength?: string
  churidarLength?: string
  skirtLength?: string
  notes: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  measurements: Measurements
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerName: string
  customerId?: string // Link to customer
  contactNumber: string
  itemDetails: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  images?: string[] // For design sketches or reference images
  createdAt: string
  updatedAt: string
}

export type OrderStatus = Order["status"]
