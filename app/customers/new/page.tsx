"use client"

import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CustomerForm } from "@/components/customer-form"
import { saveCustomer } from "@/lib/customers"
import { useToast } from "@/components/ui/use-toast"

export default function NewCustomerPage() {
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = (data: any) => {
        try {
            saveCustomer(data)
            toast({
                title: "Customer created",
                description: "Customer profile has been successfully saved.",
            })
            router.push("/customers")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create customer.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-foreground">New Customer</h1>
                    <p className="text-muted-foreground">Add a new customer profile and their measurements</p>
                </div>

                <CustomerForm onSubmit={handleSubmit} />
            </main>
        </div>
    )
}
