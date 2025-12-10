"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Eraser, Pen, RotateCcw, Save } from "lucide-react"

export function DesignCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(2)
    const [tool, setTool] = useState<"pen" | "eraser">("pen")

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Set canvas size
        canvas.width = 600
        canvas.height = 800

        // Draw mannequin outline
        const ctx = canvas.getContext("2d")
        if (ctx) {
            drawMannequin(ctx)
        }
    }, [])

    const drawMannequin = (ctx: CanvasRenderingContext2D) => {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = "#e5e7eb" // neutral/light gray
        ctx.lineWidth = 2

        // Simple Mannequin Head
        ctx.beginPath()
        ctx.ellipse(300, 100, 40, 50, 0, 0, Math.PI * 2)
        ctx.stroke()

        // Neck
        ctx.beginPath()
        ctx.moveTo(300, 150)
        ctx.lineTo(300, 180)
        ctx.stroke()

        // Shoulders
        ctx.beginPath()
        ctx.moveTo(300, 180)
        ctx.lineTo(220, 200)
        ctx.moveTo(300, 180)
        ctx.lineTo(380, 200)
        ctx.stroke()

        // Body
        ctx.beginPath()
        ctx.moveTo(220, 200)
        ctx.bezierCurveTo(200, 300, 200, 400, 220, 500) // Left side
        ctx.lineTo(380, 500) // Hips
        ctx.bezierCurveTo(400, 400, 400, 300, 380, 200) // Right side
        ctx.stroke()

        // Legs (Long dress form style)
        ctx.beginPath()
        ctx.moveTo(220, 500)
        ctx.lineTo(200, 750)
        ctx.lineTo(400, 750)
        ctx.lineTo(380, 500)
        ctx.stroke()

        // Arms (Simple lines)
        ctx.beginPath()
        ctx.moveTo(220, 200)
        ctx.lineTo(180, 400)
        ctx.moveTo(380, 200)
        ctx.lineTo(420, 400)
        ctx.stroke()
    }

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        ctx.lineWidth = lineWidth
        ctx.lineCap = "round"
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawMannequin(ctx) // Redraw template
    }

    const saveDesign = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.download = `design-${Date.now()}.png`
        link.href = dataUrl
        link.click()
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-card border rounded-lg p-4 flex justify-center overflow-auto shadow-inner bg-slate-50 dark:bg-slate-900">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="bg-white rounded cursor-crosshair border shadow-sm"
                    style={{ width: "600px", height: "800px" }}
                />
            </div>

            <div className="w-full md:w-64 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Tools</h3>
                    <div className="flex gap-2">
                        <Button
                            variant={tool === "pen" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setTool("pen")}
                        >
                            <Pen className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={tool === "eraser" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setTool("eraser")}
                        >
                            <Eraser className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Stroke Width</h3>
                    <Slider
                        value={[lineWidth]}
                        max={20}
                        step={1}
                        onValueChange={(val) => setLineWidth(val[0])}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Color</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {["#000000", "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#A52A2A"].map((c) => (
                            <button
                                key={c}
                                className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-primary" : "border-transparent"}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-8"
                    />
                </div>

                <div className="pt-6 border-t space-y-2">
                    <Button variant="outline" className="w-full" onClick={clearCanvas}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Canvas
                    </Button>
                    <Button className="w-full" onClick={saveDesign}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Design
                    </Button>
                </div>
            </div>
        </div>
    )
}
