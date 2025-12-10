"use client"

import { Navigation } from "@/components/navigation"
import { DesignCanvas } from "@/components/design-canvas"

export default function StudioPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-foreground">Design Studio</h1>
                    <p className="text-muted-foreground">Sketch your ideas on our digital mannequin</p>
                </div>

                <DesignCanvas />
            </main>
        </div>
    )
}
