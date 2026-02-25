import React, { useState } from 'react';
import { X, MapPin, ArrowLeft } from 'lucide-react';
import { Address, PaymentMethod } from './CheckoutModal';
import useModalStore from '@/store/Store'; // Import your store

interface Props {
    data: { subTotal: number; totalItems: number };
    selectedAddress?: Address;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (m: PaymentMethod) => void;
    onClose: () => void;
    onChangeAddress: () => void;
    onConfirm: () => void;
}

const CheckoutSummaryView = ({ 
    data, 
    selectedAddress, 
    paymentMethod, 
    setPaymentMethod, 
    onClose, 
    onChangeAddress, 
    onConfirm 
}: Props) => {
    const { changeCheckoutModal, toggleClicked } = useModalStore();
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(false);
    const deliveryFee = 50;
    const total = data.subTotal + deliveryFee;

    const handleConfirm = () => {
        if (!termsAccepted) return setError(true);
        onConfirm();
    };

    const handleBackToCart = () => {
        changeCheckoutModal(); 
        toggleClicked();        
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Header Area - Increased size and padding */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={22} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50 scrollbar-hide">
                {/* 1. Address Section - Standardized Font Sizes */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                        <button 
                            onClick={onChangeAddress} 
                            className="text-sm font-bold text-[#F97316] hover:underline"
                        >
                            Change
                        </button>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-800 shrink-0" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 uppercase">
                                {selectedAddress?.name || "SELECT ADDRESS"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed font-medium">
                                {selectedAddress?.address || "No address selected"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Calculations - Larger text, Italics removed */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between text-sm font-bold text-gray-500 uppercase">
                        <span>Items ({data.totalItems}):</span>
                        <span className="text-gray-900">৳{data.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-500 uppercase">
                        <span>Delivery Fee:</span>
                        <span className="text-gray-900">৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Total Price</span>
                        <span className="text-xl font-black text-gray-900 tracking-tight">
                            ৳{(total).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* 3. Payment Option - Larger buttons */}
                <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Payment Option</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {(['Wallet', 'Bkash', 'Nogod'] as PaymentMethod[]).map((method) => (
                            <button 
                                key={method} 
                                onClick={() => setPaymentMethod(method)} 
                                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                                    paymentMethod === method 
                                    ? "bg-[#5C9C72] text-white border-[#5C9C72] shadow-md" 
                                    : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Terms - Readable font */}
                <div className="flex flex-col gap-2 px-1">
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            checked={termsAccepted} 
                            onChange={(e) => setTermsAccepted(e.target.checked)} 
                            className="w-5 h-5 text-[#5C9C72] border-gray-300 rounded focus:ring-0 accent-[#5C9C72] cursor-pointer" 
                        />
                        <label htmlFor="terms" className="text-xs text-gray-500 leading-tight cursor-pointer select-none font-medium">
                            I accept the <span className="text-[#F97316] font-bold">Privacy Policy</span> and <span className="text-[#F97316] font-bold">Terms</span>.
                        </label>
                    </div>
                    {error && !termsAccepted && (
                        <p className="text-red-500 text-xs font-bold animate-pulse">
                            * Please accept terms to proceed.
                        </p>
                    )}
                </div>
            </div>

            {/* 5. Footer Buttons - Increased height and text size */}
            <div className="p-5 border-t border-gray-100 bg-white space-y-3 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
                <button 
                    onClick={handleConfirm} 
                    className="w-full bg-[#5C9C72] hover:bg-[#4a855d] h-14 rounded-xl text-sm font-black uppercase shadow-lg text-white transition-all active:scale-[0.98]"
                >
                    Confirm Order (৳{total.toFixed(2)})
                </button>

                <button 
                    onClick={handleBackToCart}
                    className="w-full h-12 border-2 border-gray-100 text-gray-500 rounded-xl text-sm font-bold uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Cart
                </button>
            </div>
        </div>
    );
};

export default CheckoutSummaryView;