import type { Customer } from "./types"

const CUSTOMERS_KEY = "dress-business-customers"

export function getCustomers(): Customer[] {
    if (typeof window === "undefined") return []

    try {
        const stored = localStorage.getItem(CUSTOMERS_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export function getCustomer(id: string): Customer | undefined {
    const customers = getCustomers()
    return customers.find(c => c.id === id)
}

export function saveCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
    const customers = getCustomers()
    const newCustomer: Customer = {
        ...customer,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    customers.push(newCustomer)
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
    return newCustomer
}

export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = getCustomers()
    const index = customers.findIndex((c) => c.id === id)

    if (index === -1) return null

    customers[index] = {
        ...customers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
    return customers[index]
}

export function deleteCustomer(id: string): boolean {
    const customers = getCustomers()
    const filtered = customers.filter((c) => c.id !== id)

    if (filtered.length === customers.length) return false

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filtered))
    return true
}
