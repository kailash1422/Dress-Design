"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, User } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomers } from "@/lib/customers"
import type { Customer } from "@/lib/types"

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        setCustomers(getCustomers())
    }, [])

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    )

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Customers</h1>
                        <p className="text-muted-foreground">Manage your customer profiles and measurements</p>
                    </div>
                    <Link href="/customers/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search customers by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 max-w-md"
                    />
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No customers found</p>
                        <p className="text-sm">Get started by creating a new customer profile</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCustomers.map((customer) => (
                            <Link key={customer.id} href={`/customers/${customer.id}`}>
                                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-semibold">
                                            {customer.name}
                                        </CardTitle>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground">Phone:</span> {customer.phone}
                                            </div>
                                            {customer.email && (
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="font-medium text-foreground">Email:</span> {customer.email}
                                                </div>
                                            )}
                                            <div className="pt-2 flex flex-wrap gap-2 text-xs">
                                                <span className="bg-secondary px-2 py-1 rounded-md">
                                                    Bust: {customer.measurements.bust}
                                                </span>
                                                <span className="bg-secondary px-2 py-1 rounded-md">
                                                    Waist: {customer.measurements.waist}
                                                </span>
                                                <span className="bg-secondary px-2 py-1 rounded-md">
                                                    Hips: {customer.measurements.hips}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
