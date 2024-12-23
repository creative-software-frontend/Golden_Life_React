'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star, Wallet, Gift, Phone } from 'lucide-react'

export default function AddMoney() {
    return (
        <div className="w-[40%] mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                {/* <button className="text-blue-500">
                    <ChevronLeft size={24} />
                </button> */}
                <h1 className="text-xl font-semibold">Add Money</h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent">
                    <TabsTrigger
                        value="wallet"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Wallet
                    </TabsTrigger>
                    <TabsTrigger
                        value="voucher"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Voucher
                    </TabsTrigger>
                    <TabsTrigger
                        value="recharge"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Recharge
                    </TabsTrigger>
                </TabsList>

                {/* Wallet Tab */}
                <TabsContent value="wallet" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">ওয়ালেট অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট অ্যামাউন্ট ক্রয় করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট অ্যামাউন্ট উত্তোলন করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট ট্রানজেকশন হিস্ট্রি করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>

                {/* Voucher Tab */}
                <TabsContent value="voucher" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">ভাউচার অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার ক্রয় করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার রিডিম করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার হিস্ট্রি দেখুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>

                {/* Recharge Tab */}
                <TabsContent value="recharge" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">রিচার্জ অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>মোবাইল রিচার্জ করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>অটো রিচার্জ সেট করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>রিচার্জ হিস্ট্রি দেখুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

