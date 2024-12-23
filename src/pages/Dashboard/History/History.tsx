'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { ChevronLeft } from 'lucide-react'
// import Image from "next/image"

interface Transaction {
    id: string
    name: string
    status: string
    transactionId: string
    amount: number
    timestamp: string
    type: 'wallet' | 'voucher' | 'recharge'
}

const transactions: Transaction[] = [
    ...Array(9).fill(null).map((_, i) => ({
        id: `wallet-${i}`,
        name: "Bkash",
        status: "Received",
        transactionId: "3434635234345",
        amount: 500,
        timestamp: "02:12pm 03/12/24",
        type: 'wallet'
    })),
    ...Array(9).fill(null).map((_, i) => ({
        id: `voucher-${i}`,
        name: "Gift Voucher",
        status: "Redeemed",
        transactionId: "7834635234345",
        amount: 250,
        timestamp: "03:15pm 03/12/24",
        type: 'voucher'
    })),
    ...Array(9).fill(null).map((_, i) => ({
        id: `recharge-${i}`,
        name: "Mobile Recharge",
        status: "Completed",
        transactionId: "9934635234345",
        amount: 100,
        timestamp: "04:20pm 03/12/24",
        type: 'recharge'
    }))
]

export default function History() {
    return (
        <div className="w-[40%] mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                {/* <button className="text-blue-500">
                    <ChevronLeft size={24} />
                </button> */}
                <h1 className="text-xl font-semibold">History</h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent">
                    <TabsTrigger
                        value="wallet"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Wallet
                    </TabsTrigger>
                    <TabsTrigger
                        value="voucher"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Voucher
                    </TabsTrigger>
                    <TabsTrigger
                        value="recharge"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Recharge
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="mt-0">
                    <div className="divide-y">
                        {transactions.filter(t => t.type === 'wallet').map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <img
                                            src="../../../../public/image/courses/instructor.jpeg"
                                            alt="Profile"
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{transaction.name}</h3>
                                        <p className="text-gray-600">{transaction.status}</p>
                                        <p className="text-gray-600 text-sm">TranxID: {transaction.transactionId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-500 font-semibold">${transaction.amount}</p>
                                    <p className="text-gray-600 text-sm">{transaction.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="voucher" className="mt-0">
                    <div className="divide-y">
                        {transactions.filter(t => t.type === 'voucher').map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <img
                                            src="../../../../public/image/courses/instructor.jpeg"
                                            alt="Profile"
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{transaction.name}</h3>
                                        <p className="text-gray-600">{transaction.status}</p>
                                        <p className="text-gray-600 text-sm">TranxID: {transaction.transactionId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-500 font-semibold">${transaction.amount}</p>
                                    <p className="text-gray-600 text-sm">{transaction.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="recharge" className="mt-0">
                    <div className="divide-y">
                        {transactions.filter(t => t.type === 'recharge').map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <img
                                            src="../../../../public/image/courses/instructor.jpeg"
                                            alt="Profile"
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{transaction.name}</h3>
                                        <p className="text-gray-600">{transaction.status}</p>
                                        <p className="text-gray-600 text-sm">TranxID: {transaction.transactionId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-500 font-semibold">${transaction.amount}</p>
                                    <p className="text-gray-600 text-sm">{transaction.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

