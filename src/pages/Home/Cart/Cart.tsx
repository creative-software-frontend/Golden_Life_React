"use client"

import * as React from "react"

import { ChevronDown, ChevronUp, Gift, Plus, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    pack: string
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }> = ({
    children,
    className = '',
    variant = 'default',
    ...props
}) => (
    <button
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'} ${className}`}
        {...props}
    >
        {children}
    </button>
)

export default function Cart() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [showCode, setShowCode] = React.useState(false)
    const [items, setItems] = React.useState<CartItem[]>([
        {
            id: 1,
            name: "Nestle Maggi 2 Minute Masala Instant Noodles",
            price: 340,
            quantity: 1,
            pack: "16 pack"
        },
        {
            id: 2,
            name: "Chopstick Instant Noodles Masala Delight 496 gm",
            price: 155,
            quantity: 1,
            pack: "8 pack"
        },
        {
            id: 3,
            name: "Dekko Egg Masala Noodles 250 gm Combo",
            price: 80,
            quantity: 1,
            pack: "2 pcs"
        }
    ])

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const updateQuantity = (id: number, delta: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ))
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-l-full px-4 py-2 shadow-lg z-50"
            >
                <div className="flex items-center ">
                    <ShoppingBag className="h-6 w-6" />
                    <div className="border-l border-gray-300 h-8 mx-2" />
                    <div>
                        <div className="font-semibold">{totalItems} ITEMS</div>
                        <div className="text-sm">৳ {total}</div>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
                    <div className="bg-white w-full max-w-md h-full overflow-auto">
                        <div className="sticky top-0 bg-white border-b z-10">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    <span className="font-medium">{items.length} ITEMS</span>
                                </div>
                                <Button variant="outline" className="text-sm" onClick={() => setIsOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-100 border-b">
                            <div className="flex items-center justify-between">
                                <span>Delivery charge not needed</span>
                                <div className="flex items-center gap-1">
                                    <span>৳ 0</span>
                                    <button className="h-4 w-4 text-xs border rounded-full">i</button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="font-medium">Express Delivery</span>
                                <span className="text-gray-600">Today, 12:00PM - 2:00PM</span>
                            </div>
                        </div>

                        <div className="divide-y">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    {/* Image and counter section */}
                                    <div className="flex flex-col items-center">
                                        <img
                                            alt={item.name}
                                            className="h-12 w-12 object-cover"
                                            src="../../../../public/image/maggi.webp"
                                        />
                                        <div className="flex items-center border rounded mt-2 text-xs">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="px-1 py-0.5">
                                                <ChevronDown className="h-3 w-3" />
                                            </button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="px-1 py-0.5">
                                                <ChevronUp className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item details and remove button */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            ৳{item.price}/ {item.pack}
                                        </p>
                                    </div>

                                    {/* Remove button */}
                                    <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-500 hover:text-gray-700">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>


                        <div className="sticky bottom-0 bg-white border-t p-4 space-y-4">
                            <div className="text-center">
                                <Button
                                    className="flex justify-center items-center w-full bg-primary-default hover:bg-gray-300 text-white gap-2"
                                    onClick={() => setShowCode(!showCode)}
                                >
                                    <Gift className="h-6 w-6" />
                                    Have a special code?
                                </Button>
                            </div>


                            {showCode && (
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 px-3 py-2 border rounded"
                                        placeholder="Referral/Discount Code"
                                    />
                                    <Button className="bg-primary-default text-white">Go</Button>
                                    <Button variant="outline" onClick={() => setShowCode(false)}>Close</Button>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <Link to="/checkout" className="block w-full bg-primary-default text-white text-center py-2 rounded hover:bg-primary-dark">
                                    Place Order
                                </Link>
                                <Button variant="outline" className="w-full">
                                    ৳ {total}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}