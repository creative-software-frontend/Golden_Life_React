"use client"

import * as React from "react"
import { ShoppingBag, X, ChevronUp, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface CartItem {
    id: number
    name: string
    price: number
    weight: string
    weightUnit: string
    baseWeight: string
    image: string
    quantity: number
}

export default function Component() {
    const [items, setItems] = React.useState<CartItem[]>([
        {
            id: 1,
            name: "Ispahani Mirzapore Best Leaf Tea",
            price: 210,
            weight: "400",
            weightUnit: "gm",
            baseWeight: "400 gm",
            image: "/placeholder.svg?height=80&width=80",
            quantity: 1
        },
        {
            id: 2,
            name: "Deshi Peyaj (Local Onion)",
            price: 149,
            weight: "50",
            weightUnit: "gm",
            baseWeight: "1 kg",
            image: "/placeholder.svg?height=80&width=80",
            quantity: 1
        }
    ])

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const updateQuantity = (id: number, delta: number) => {
        setItems(items.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                : item
        ).filter(item => item.quantity > 0))
    }

    return (
        <div className="relative">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        className="fixed top-1/2 -translate-y-1/2 right-0 z-50 h-16 gap-4 rounded-l-full bg-white px-6 shadow-lg hover:bg-gray-100"
                    >
                        <ShoppingBag className="h-6 w-6" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">{totalItems} ITEMS</span>
                            <span className="text-muted-foreground">৳ {totalAmount}</span>
                        </div>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full border-l sm:max-w-lg">
                    <SheetHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems} ITEMS
                            </SheetTitle>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Close
                                </Button>
                            </SheetTrigger>
                        </div>
                    </SheetHeader>

                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-auto py-4">
                            <div className="bg-muted/50 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Delivery charge not needed</div>
                                    <div className="flex items-center gap-1">
                                        <span>৳ 0</span>
                                        <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full">
                                            <span className="sr-only">Info</span>
                                            <i className="text-xs">i</i>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 border-b">
                                <div className="flex items-center gap-2 text-sm">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span className="font-medium">Express Delivery</span>
                                    <span className="text-muted-foreground">Today, 3:00PM - 5:00PM</span>
                                </div>
                            </div>

                            <div className="divide-y">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                ৳{item.price}/ {item.baseWeight}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-sm">
                                                    {item.weight} {item.weightUnit}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div>৳ {item.price * item.quantity}</div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateQuantity(item.id, -item.quantity)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t bg-background pt-4">
                            <div className="px-4">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <span className="text-xs">🎁</span>
                                    Have a special code?
                                </Button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 p-4">
                                <Button className="bg-red-500 hover:bg-red-600">
                                    Place Order
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    ৳ {totalAmount}
                                </Button>
                            </div>

                            <Button className="w-full gap-2 rounded-none bg-orange-500 hover:bg-orange-600">
                                <MessageCircle className="h-4 w-4" />
                                Live Chat
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}