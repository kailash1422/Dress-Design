"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { CustomerForm } from "@/components/customer-form"
import { getCustomer, updateCustomer } from "@/lib/customers"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { Customer } from "@/lib/types"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { toast } = useToast()
    const [customer, setCustomer] = useState<Customer | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const found = getCustomer(params.id)
            if (found) {
                setCustomer(found)
            } else {
                router.push("/customers")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [params.id, router])

    const handleSubmit = (data: any) => {
        try {
            updateCustomer(params.id, data)
            toast({
                title: "Customer updated",
                description: "Customer profile has been successfully updated.",
            })
            router.push("/customers")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update customer.",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!customer) return null

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-foreground">Edit Customer</h1>
                    <p className="text-muted-foreground">Update customer profile and measurements</p>
                </div>

                <CustomerForm defaultValues={customer} onSubmit={handleSubmit} />
            </main>
        </div>
    )
}
