"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Customer, Measurements } from "@/lib/types"

const measurementsSchema = z.object({
    unit: z.enum(["inch", "cm"]),
    shoulder: z.string().optional(),
    bust: z.string().optional(),
    waist: z.string().optional(),
    chest: z.string().optional(),
    armHole: z.string().optional(),
    sleeveLength: z.string().optional(),
    bicep: z.string().optional(),
    wrist: z.string().optional(),
    neckDeepFront: z.string().optional(),
    neckDeepBack: z.string().optional(),
    hips: z.string().optional(),
    inseam: z.string().optional(),
    waistToKnee: z.string().optional(),
    ankle: z.string().optional(),
    fullLength: z.string().optional(),
    kameezLength: z.string().optional(),
    salwarLength: z.string().optional(),
    churidarLength: z.string().optional(),
    skirtLength: z.string().optional(),
    notes: z.string().optional(),
})

const customerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    measurements: measurementsSchema,
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
    defaultValues?: Partial<CustomerFormValues>
    onSubmit: (data: CustomerFormValues) => void
    isSubmitting?: boolean
}

export function CustomerForm({ defaultValues, onSubmit, isSubmitting }: CustomerFormProps) {
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: defaultValues || {
            name: "",
            phone: "",
            email: "",
            address: "",
            measurements: {
                unit: "inch",
                shoulder: "",
                bust: "",
                waist: "",
                chest: "",
                armHole: "",
                sleeveLength: "",
                bicep: "",
                wrist: "",
                neckDeepFront: "",
                neckDeepBack: "",
                hips: "",
                inseam: "",
                waistToKnee: "",
                ankle: "",
                fullLength: "",
                kameezLength: "",
                salwarLength: "",
                churidarLength: "",
                skirtLength: "",
                notes: "",
            },
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 8900" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="jane@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Fashion St" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Measurements</h3>
                    <Tabs defaultValue="upper" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="upper">Upper Body</TabsTrigger>
                            <TabsTrigger value="lower">Lower Body</TabsTrigger>
                            <TabsTrigger value="other">Other / Indian</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upper" className="space-y-4 mt-4">
                            <Card>
                                <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {["shoulder", "bust", "waist", "chest", "armHole", "sleeveLength", "bicep", "wrist", "neckDeepFront", "neckDeepBack"].map((name) => (
                                        <FormField
                                            key={name}
                                            control={form.control}
                                            name={`measurements.${name}` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="lower" className="space-y-4 mt-4">
                            <Card>
                                <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {["hips", "inseam", "waistToKnee", "ankle", "fullLength"].map((name) => (
                                        <FormField
                                            key={name}
                                            control={form.control}
                                            name={`measurements.${name}` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="other" className="space-y-4 mt-4">
                            <Card>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {["kameezLength", "salwarLength", "churidarLength", "skirtLength"].map((name) => (
                                        <FormField
                                            key={name}
                                            control={form.control}
                                            name={`measurements.${name}` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <FormField
                                        control={form.control}
                                        name="measurements.notes"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Additional Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Specific fitting preferences, etc." className="min-h-[100px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Customer"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
