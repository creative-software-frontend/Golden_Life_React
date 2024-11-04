"use client"

import * as React from "react"

interface Address {
    flatNo: string
    floorNo: string
    street: string
    area: string
    label: "home" | "work" | "partner" | "other"
    name: string
    phone: string
    notes?: string
}

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: JSX.Element } = {
        mapPin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
        clock: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        x: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        home: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
        heart: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
        plus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
        chevronDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
    }
    return icons[name] || null
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }> = ({
    children,
    className = '',
    variant = 'default',
    ...props
}) => {
    const baseStyle = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    const variantStyles = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        ghost: "text-gray-600 hover:bg-gray-100",
    }
    return (
        <button
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
    <div className="relative">
        <select
            className={`w-full p-2 border rounded appearance-none bg-white ${className}`}
            {...props}
        >
            {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="chevronDown" />
        </div>
    </div>
)

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">
            {label}
        </div>
    </label>
)

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-2 border rounded ${props.className || ''}`}
    />
)

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={`w-full p-2 border rounded ${props.className || ''}`}
    />
)

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
    <label {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${props.className || ''}`}>
        {children}
    </label>
)

export default function CheckoutModal() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [currentStep, setCurrentStep] = React.useState<"address" | "delivery">("address")
    const [selectedDate, setSelectedDate] = React.useState("TODAY")
    const [selectedTime, setSelectedTime] = React.useState("12:00 PM - 2:00 PM")
    const [useReusableBags, setUseReusableBags] = React.useState(false)
    const [currentAddress, setCurrentAddress] = React.useState<Address>({
        flatNo: "12",
        floorNo: "12",
        street: "House Cha 71/2, Matabbar",
        area: "Uttar Badda, Badda",
        label: "home",
        name: "01747335232",
        phone: "+88 01747335232"
    })

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentStep("delivery")
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Main Checkout Form */}
            <div className="space-y-6">
                {/* Delivery Address Section */}
                <div className="border rounded-lg">
                    <div className="p-4 flex items-start gap-3">
                        <Icon name="mapPin" />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold">Delivery Address</h2>
                            <p className="mt-2 text-gray-600">
                                {currentAddress.flatNo && `Flat ${currentAddress.flatNo}, `}
                                {currentAddress.floorNo && `Floor ${currentAddress.floorNo}, `}
                                {currentAddress.street}, {currentAddress.area}
                            </p>
                            <div className="mt-1 text-sm text-gray-500 capitalize">{currentAddress.label}</div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsModalOpen(true)
                                setCurrentStep("address")
                            }}
                        >
                            Change
                        </Button>
                    </div>
                </div>

                {/* Delivery Time Section */}
                <div className="border rounded-lg">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <Icon name="clock" />
                            <h2 className="text-lg font-semibold">Preferred Delivery Time</h2>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <img src="/placeholder.svg?height=24&width=24" alt="" className="h-6 w-6" />
                                <span>When would you like your Express Delivery?</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                    <option value="TODAY">TODAY 4 Nov</option>
                                    <option value="TOMORROW">TOMORROW 5 Nov</option>
                                </Select>
                                <Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                    <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                                    <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reusable Bags Option */}
                <div className="border rounded-lg">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/placeholder.svg?height=24&width=24" alt="" className="h-6 w-6" />
                            <span>Add reusable bags?</span>
                        </div>
                        <Switch
                            checked={useReusableBags}
                            onChange={setUseReusableBags}
                            label="Use reusable bags"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                        Payment options available on the next page
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            ৳0 Delivery charge included
                        </div>
                        <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3">
                            Proceed ৳575
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-auto z-50">
                    <div className="bg-white w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-lg md:my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">
                                {currentStep === "address" ? "Add new address" : "Select delivery time"}
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close modal"
                            >
                                <Icon name="x" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        {currentStep === "address" ? (
                            <div className="p-4">
                                <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6">
                                    {/* Map placeholder - Replace with actual map component */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        Map View
                                    </div>
                                </div>

                                <form onSubmit={handleSaveAddress} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="floorNo">Floor No</Label>
                                            <Input
                                                id="floorNo"
                                                defaultValue={currentAddress.floorNo}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="flatNo">Flat No</Label>
                                            <Input
                                                id="flatNo"
                                                defaultValue={currentAddress.flatNo}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            defaultValue={currentAddress.name}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            defaultValue={currentAddress.phone}
                                            required
                                        />

                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Delivery Notes</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any specific delivery instructions"
                                            defaultValue={currentAddress.notes}
                                        />
                                    </div>

                                    <div>
                                        <Label>Add a label</Label>
                                        <div className="grid grid-cols-4 gap-4 mt-2">
                                            {[
                                                { icon: "home", label: "home" },
                                                { icon: "briefcase", label: "work" },
                                                { icon: "heart", label: "partner" },
                                                { icon: "plus", label: "other" },
                                            ].map(({ icon, label }) => (
                                                <Button
                                                    key={label}
                                                    type="button"
                                                    variant={currentAddress.label === label ? "default" : "outline"}
                                                    className="flex flex-col items-center gap-2 py-4"
                                                    onClick={() => setCurrentAddress(prev => ({ ...prev, label: label as Address["label"] }))}
                                                >
                                                    <Icon name={icon} />
                                                    <span className="capitalize">{label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Save Address
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {/* Delivery time selection content */}
                                <div className="space-y-4">
                                    <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                        <option value="TODAY">TODAY 4 Nov</option>
                                        <option value="TOMORROW">TOMORROW 5 Nov</option>
                                    </Select>
                                    <Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                        <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                                        <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                                    </Select>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                    }}
                                >
                                    Confirm Time
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}