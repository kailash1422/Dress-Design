import type { Order } from "./types"

const ORDERS_KEY = "dress-business-orders"

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.push(newOrder)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return newOrder
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders()
  const index = orders.findIndex((order) => order.id === id)

  if (index === -1) return null

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders[index]
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders()
  const filtered = orders.filter((order) => order.id !== id)

  if (filtered.length === orders.length) return false

  localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered))
  return true
}

export function getOrdersDueToday(): Order[] {
  const orders = getOrders()
  const today = new Date().toISOString().split("T")[0]

  return orders.filter((order) => order.dueDate === today && order.status !== "completed")
}

export function getOrdersDueSoon(): Order[] {
  const orders = getOrders()
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayStr = today.toISOString().split("T")[0]
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  return orders.filter(
    (order) => (order.dueDate === todayStr || order.dueDate === tomorrowStr) && order.status !== "completed",
  )
}
