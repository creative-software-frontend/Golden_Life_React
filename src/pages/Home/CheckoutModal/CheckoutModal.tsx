// "use client"

// import * as React from "react"
// import { MapPin, Clock, X, Home, Briefcase, Heart, Plus, ChevronDown } from "lucide-react"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// interface Address {
//     flatNo: string
//     floorNo: string
//     street: string
//     area: string
//     label: "home" | "work" | "partner" | "other"
//     name: string
//     phone: string
//     notes?: string
// }

// export default function CheckoutModal() {
//     const [isModalOpen, setIsModalOpen] = React.useState(false)
//     const [currentStep, setCurrentStep] = React.useState<"address" | "delivery">("address")
//     const [selectedDate, setSelectedDate] = React.useState("TODAY")
//     const [selectedTime, setSelectedTime] = React.useState("12:00 PM - 2:00 PM")
//     const [useReusableBags, setUseReusableBags] = React.useState(false)
//     const [currentAddress, setCurrentAddress] = React.useState<Address>({
//         flatNo: "12",
//         floorNo: "12",
//         street: "House Cha 71/2, Matabbar",
//         area: "Uttar Badda, Badda",
//         label: "home",
//         name: "01747335232",
//         phone: "+88 01747335232"
//     })

//     const handleSaveAddress = (e: React.FormEvent) => {
//         e.preventDefault()
//         setCurrentStep("delivery")
//     }

//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             {/* Main Checkout Form */}
//             <div className="space-y-6">
//                 {/* Delivery Address Section */}
//                 <div className="border rounded-lg">
//                     <div className="p-4 flex items-start gap-3">
//                         <MapPin className="h-6 w-6 text-gray-500" />
//                         <div className="flex-1">
//                             <h2 className="text-lg font-semibold">Delivery Address</h2>
//                             <p className="mt-2 text-gray-600">
//                                 {currentAddress.flatNo && `Flat ${currentAddress.flatNo}, `}
//                                 {currentAddress.floorNo && `Floor ${currentAddress.floorNo}, `}
//                                 {currentAddress.street}, {currentAddress.area}
//                             </p>
//                             <div className="mt-1 text-sm text-gray-500 capitalize">{currentAddress.label}</div>
//                         </div>
//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 setIsModalOpen(true)
//                                 setCurrentStep("address")
//                             }}
//                         >
//                             Change
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Delivery Time Section */}
//                 <div className="border rounded-lg">
//                     <div className="p-4">
//                         <div className="flex items-center gap-3">
//                             <Clock className="h-6 w-6 text-gray-500" />
//                             <h2 className="text-lg font-semibold">Preferred Delivery Time</h2>
//                         </div>
//                         <div className="mt-4 space-y-4">
//                             <div className="flex items-center gap-2">
//                                 <img src="/placeholder.svg?height=24&width=24" alt="" className="h-6 w-6" />
//                                 <span>When would you like your Express Delivery?</span>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <Select value={selectedDate} onValueChange={setSelectedDate}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="TODAY">TODAY 4 Nov</SelectItem>
//                                         <SelectItem value="TOMORROW">TOMORROW 5 Nov</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                                 <Select value={selectedTime} onValueChange={setSelectedTime}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</SelectItem>
//                                         <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Reusable Bags Option */}
//                 <div className="border rounded-lg">
//                     <div className="p-4 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <img src="/placeholder.svg?height=24&width=24" alt="" className="h-6 w-6" />
//                             <span>Add reusable bags?</span>
//                         </div>
//                         <Switch
//                             checked={useReusableBags}
//                             onCheckedChange={setUseReusableBags}
//                             aria-label="Use reusable bags"
//                         />
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex items-center justify-between pt-4 border-t">
//                     <div className="text-sm text-gray-600">
//                         Payment options available on the next page
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <div className="text-sm">
//                             ৳0 Delivery charge included
//                         </div>
//                         <Button size="lg" className="bg-red-500 hover:bg-red-600">
//                             Proceed ৳575
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-auto z-50">
//                     <div className="bg-white w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-lg md:my-8">
//                         {/* Modal Header */}
//                         <div className="flex items-center justify-between p-4 border-b">
//                             <h2 className="text-lg font-semibold">
//                                 {currentStep === "address" ? "Add new address" : "Select delivery time"}
//                             </h2>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => setIsModalOpen(false)}
//                                 aria-label="Close modal"
//                             >
//                                 <X className="h-4 w-4" />
//                             </Button>
//                         </div>

//                         {/* Modal Content */}
//                         {currentStep === "address" ? (
//                             <div className="p-4">
//                                 <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6">
//                                     {/* Map placeholder - Replace with actual map component */}
//                                     <div className="w-full h-full flex items-center justify-center text-gray-500">
//                                         Map View
//                                     </div>
//                                 </div>

//                                 <form onSubmit={handleSaveAddress} className="space-y-4">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="floorNo">Floor No</Label>
//                                             <Input
//                                                 id="floorNo"
//                                                 defaultValue={currentAddress.floorNo}
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="flatNo">Flat No</Label>
//                                             <Input
//                                                 id="flatNo"
//                                                 defaultValue={currentAddress.flatNo}
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="name">Name</Label>
//                                         <Input
//                                             id="name"
//                                             defaultValue={currentAddress.name}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="phone">Phone</Label>
//                                         <Input
//                                             id="phone"
//                                             type="tel"
//                                             defaultValue={currentAddress.phone}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="notes">Delivery Notes</Label>
//                                         <Textarea
//                                             id="notes"
//                                             placeholder="Add any specific delivery instructions"
//                                             defaultValue={currentAddress.notes}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label>Add a label</Label>
//                                         <div className="grid grid-cols-4 gap-4 mt-2">
//                                             {[
//                                                 { icon: Home, label: "home" },
//                                                 { icon: Briefcase, label: "work" },
//                                                 { icon: Heart, label: "partner" },
//                                                 { icon: Plus, label: "other" },
//                                             ].map(({ icon: Icon, label }) => (
//                                                 <Button
//                                                     key={label}
//                                                     type="button"
//                                                     variant={currentAddress.label === label ? "default" : "outline"}
//                                                     className="flex flex-col items-center gap-2 py-4"
//                                                     onClick={() => setCurrentAddress(prev => ({ ...prev, label: label as Address["label"] }))}
//                                                 >
//                                                     <Icon className="h-5 w-5" />
//                                                     <span className="capitalize">{label}</span>
//                                                 </Button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <Button type="submit" className="w-full">
//                                         Save Address
//                                     </Button>
//                                 </form>
//                             </div>
//                         ) : (
//                             <div className="p-4 space-y-4">
//                                 {/* Delivery time selection content */}
//                                 <div className="space-y-4">
//                                     <Select value={selectedDate} onValueChange={setSelectedDate}>
//                                         <SelectTrigger>
//                                             <SelectValue />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="TODAY">TODAY 4 Nov</SelectItem>
//                                             <SelectItem value="TOMORROW">TOMORROW 5 Nov</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <Select value={selectedTime} onValueChange={setSelectedTime}>
//                                         <SelectTrigger>
//                                             <SelectValue />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</SelectItem>
//                                             <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 <Button
//                                     className="w-full"
//                                     onClick={() => {
//                                         setIsModalOpen(false)
//                                     }}
//                                 >
//                                     Confirm Time
//                                 </Button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }