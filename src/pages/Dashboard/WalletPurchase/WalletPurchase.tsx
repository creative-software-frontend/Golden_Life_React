'use client'

import { ChevronLeft } from 'lucide-react'
import { Card } from "@/components/ui/card"

export default function WalletPurchase() {
    return (
        <div className="w-[40%] mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <button className="text-blue-500">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Wallet Purchase</h1>
            </div>

            {/* Wallet Purchase Options */}
            <div className="p-4 space-y-4">
                {[100, 200, 500, 1000].map((amount) => (
                    <Card
                        key={amount}
                        className="relative overflow-hidden cursor-pointer transition-transform hover:scale-[0.99] active:scale-[0.97]"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('/placeholder.svg?height=200&width=400')`,
                                opacity: 0.7
                            }}
                        />
                        <div className="relative p-6 flex justify-between items-center">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-semibold text-white">Wallet Amount</h3>
                                <p className="text-white/90">Regular</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-2 rounded-xl">
                                <span className="text-xl font-bold text-white">{amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

