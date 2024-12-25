// 'use client'

// import { ChevronLeft } from 'lucide-react'
// // import img from "next/img"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// interface PaymentMethodProps {
//     amount: number
//     onClose: () => void
//     onSelectMethod: (method: string) => void
// }

// export default function PaymentMethod({ amount, onClose, onSelectMethod }: PaymentMethodProps) {
//     return (
//         <div className="w-full max-w-md mx-auto bg-white min-h-screen">
//             {/* Header */}
//             <div className="flex items-center gap-4 p-4 border-b">
//                 <button className="text-blue-500" onClick={onClose}>
//                     <ChevronLeft size={24} />
//                 </button>
//                 <h1 className="text-xl font-medium">Payment Method</h1>
//             </div>

//             {/* Logo */}
//             <div className="flex flex-col items-center justify-center py-8">
//                 <div className="relative w-32 h-32">
//                     <img
//                         src="/placeholder.svg"
//                         alt="Golden Life Group"
                        
//                         className="object-contain"
//                     />
//                 </div>
//                 <h2 className="mt-4 text-2xl font-medium text-gray-700">Golden Life Group</h2>
//             </div>

//             {/* Quick Actions */}
//             <div className="flex justify-center gap-6 mb-8">
//                 <Card className="p-4 cursor-pointer hover:bg-gray-50">
//                     <img
//                         src="/placeholder.svg"
//                         alt="Support"
//                         width={24}
//                         height={24}
//                         className="mx-auto"
//                     />
//                 </Card>
//                 <Card className="p-4 cursor-pointer hover:bg-gray-50">
//                     <img
//                         src="/placeholder.svg"
//                         alt="Help"
//                         width={24}
//                         height={24}
//                         className="mx-auto"
//                     />
//                 </Card>
//                 <Card className="p-4 cursor-pointer hover:bg-gray-50">
//                     <img
//                         src="/placeholder.svg"
//                         alt="Info"
//                         width={24}
//                         height={24}
//                         className="mx-auto"
//                     />
//                 </Card>
//             </div>

//             {/* Payment Options */}
//             <Tabs defaultValue="mobile" className="px-4">
//                 <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="mobile">মোবাইল ব্যাংকিং</TabsTrigger>
//                     <TabsTrigger value="bank">ব্যাংক</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="mobile" className="space-y-4 mt-4">
//                     <button
//                         onClick={() => onSelectMethod('bkash')}
//                         className="w-full p-4 border rounded-lg hover:bg-gray-50"
//                     >
//                         <img
//                             src="/placeholder.svg"
//                             alt="bKash"
//                             width={120}
//                             height={40}
//                             className="mx-auto"
//                         />
//                     </button>
//                     <button
//                         onClick={() => onSelectMethod('nagad')}
//                         className="w-full p-4 border rounded-lg hover:bg-gray-50"
//                     >
//                         <img
//                             src="/placeholder.svg"
//                             alt="Nagad"
//                             width={120}
//                             height={40}
//                             className="mx-auto"
//                         />
//                     </button>
//                     <button
//                         onClick={() => onSelectMethod('rocket')}
//                         className="w-full p-4 border rounded-lg hover:bg-gray-50"
//                     >
//                         <img
//                             src="/placeholder.svg"
//                             alt="Rocket"
//                             width={120}
//                             height={40}
//                             className="mx-auto"
//                         />
//                     </button>
//                 </TabsContent>
//                 <TabsContent value="bank" className="mt-4">
//                     {/* Bank options can be added here */}
//                 </TabsContent>
//             </Tabs>

//             {/* Pay Button */}
//             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
//                 <Button
//                     className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200"
//                     size="lg"
//                 >
//                     Pay {amount} BDT
//                 </Button>
//             </div>
//         </div>
//     )
// }

