'use client'

import useModalStore from "@/store/Store"
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
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
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
            className={`w-full p-2 border rounded appearance-none bg-background ${className}`}
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
            <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-3 text-foreground font-medium">
            {label}
        </div>
    </label>
)

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-2 border rounded bg-background text-foreground ${props.className || ''}`}
    />
)

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={`w-full p-2 border rounded bg-background text-foreground ${props.className || ''}`}
    />
)

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
    <label {...props} className={`block text-sm font-medium text-foreground mb-1 ${props.className || ''}`}>
        {children}
    </label>
)

export default function CheckoutModal() {
    const { isCheckoutModalOpen, closeCheckoutModal } = useModalStore();

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

    const CheckoutContent = () => (
        <div className="max-w-md mx-auto space-y-4 bg-white p-4 rounded-lg shadow-lg">
            {/* Delivery Address Section */}
            <div className="border rounded-lg">
                <div className="p-3 flex items-start gap-2">
                    <Icon name="mapPin" />
                    <div className="flex-1">
                        <h4 className="font-semibold">{currentAddress.street}</h4>
                        <p>{currentAddress.area}</p>
                    </div>
                    <button
                        onClick={() => setCurrentStep("address")}
                        className="text-primary hover:text-primary-dark"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Delivery Time Section */}
            <div className="border rounded-lg">
                <div className="p-3 flex items-start gap-2">
                    <Icon name="clock" />
                    <div className="flex-1">
                        <Label htmlFor="delivery-date">Delivery Date</Label>
                        <Select
                            id="delivery-date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        >
                            <option value="TODAY">Today</option>
                            <option value="TOMORROW">Tomorrow</option>
                            <option value="DAY_AFTER_TOMORROW">Day After Tomorrow</option>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="delivery-time">Delivery Time</Label>
                        <Select
                            id="delivery-time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option>12:00 PM - 2:00 PM</option>
                            <option>3:00 PM - 5:00 PM</option>
                            <option>6:00 PM - 8:00 PM</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Reusable Bag Option */}
            <div className="border rounded-lg p-3">
                <Switch
                    checked={useReusableBags}
                    onChange={setUseReusableBags}
                    label="Use Reusable Bags"
                />
            </div>
        </div>
    )

    const LabelOptions = () => (
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
                    onClick={() =>
                        setCurrentAddress((prev) => ({
                            ...prev,
                            label: label as Address["label"],
                        }))
                    }
                >
                    <Icon name={icon} />
                    <span className="capitalize text-xs">{label}</span>
                </Button>
            ))}
        </div>
    )

    const AddressForm = () => (
        <div className=" max-w-sm mx-auto bg-white p-4 rounded-md shadow-lg">
            <form onSubmit={handleSaveAddress} className="space-y-4">
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

                <Label>Add a label</Label>
                <LabelOptions />

                <div className="flex justify-end">
                    <Button type="submit" className="bg-primary text-white">
                        Save Address
                    </Button>
                </div>
            </form>
        </div>
    )
    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50 ${isCheckoutModalOpen ? '' : 'hidden'}`}>
            <div className="max-w-md  w-full h-[555px] mt-16 mb-2 bg-white p-6 rounded-md shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Checkout</h2>
                    <button onClick={closeCheckoutModal}>
                        <Icon name="x" />
                    </button>
                </div>
                {currentStep === "address" ? <AddressForm /> : <CheckoutContent />}
            </div>
        </div>
    );

}
