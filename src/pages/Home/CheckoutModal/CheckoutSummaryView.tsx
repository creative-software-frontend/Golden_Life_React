import React, { useState, useEffect } from 'react';
import { X, MapPin, ArrowLeft } from 'lucide-react';
import { Address, PaymentMethod } from './CheckoutModal';
import useModalStore from '@/store/Store'; 

interface Props {
    data: { subTotal: number; totalItems: number };
    selectedAddress?: Address;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (m: PaymentMethod) => void;
    onClose: () => void;
    onChangeAddress: () => void;
    onConfirm: () => void;
    deliveryFee: number; // Added deliveryFee prop
}

const CheckoutSummaryView = ({ 
    data, 
    selectedAddress, 
    paymentMethod, 
    setPaymentMethod, 
    onClose, 
    onChangeAddress, 
    onConfirm,
    deliveryFee // Destructure the prop
}: Props) => {
    const { changeCheckoutModal, toggleClicked } = useModalStore();
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(false);
    
    // Calculate total dynamically using the prop
    const total = data.subTotal + deliveryFee;

    // --- 1. PREVENT BACKGROUND SCROLLING ---
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleConfirm = () => {
        if (!termsAccepted) return setError(true);
        onConfirm();
    };

    const handleBackToCart = () => {
        changeCheckoutModal(); 
        toggleClicked();        
    };

    return (
        // --- MAIN CONTAINER ---
        <div className="flex flex-col h-[100dvh] w-full bg-white font-sans max-h-screen overflow-hidden">
            
            {/* --- HEADER --- */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10 h-14">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight truncate">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors shrink-0">
                    <X size={20} />
                </button>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                
                {/* 1. Address Section */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                        <button 
                            onClick={onChangeAddress} 
                            className="text-xs font-bold text-[#F97316] hover:underline"
                        >
                            Change
                        </button>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="p-1.5 bg-gray-50 rounded-lg shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-gray-800" />
                        </div>
                        <div className="min-w-0 flex-1"> 
                            <p className="text-sm font-bold text-gray-900 uppercase truncate">
                                {selectedAddress?.name || "SELECT ADDRESS"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-medium break-words line-clamp-2">
                                {selectedAddress?.address || "No address selected"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Calculations */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                        <span>Items ({data.totalItems}):</span>
                        <span className="text-gray-900">৳{data.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                        <span>Delivery Fee:</span>
                        <span className="text-gray-900">৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center mt-1">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Total</span>
                        <span className="text-lg font-black text-gray-900 tracking-tight">
                            ৳{(total).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* 3. Payment Option */}
                <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Payment Option</h4>
                    <div className="flex flex-wrap gap-2">
                        {(['Wallet', 'Bkash', 'Nogod'] as PaymentMethod[]).map((method) => (
                            <button 
                                key={method} 
                                onClick={() => setPaymentMethod(method)} 
                                className={`flex-1 min-w-[80px] py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2 flex items-center justify-center whitespace-nowrap ${
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

                {/* 4. Terms */}
                <div className="flex flex-col gap-1 px-1 pb-2">
                    <div className="flex items-start gap-2">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            checked={termsAccepted} 
                            onChange={(e) => setTermsAccepted(e.target.checked)} 
                            className="w-4 h-4 mt-0.5 text-[#5C9C72] border-gray-300 rounded focus:ring-0 accent-[#5C9C72] cursor-pointer shrink-0" 
                        />
                        <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight cursor-pointer select-none font-medium">
                            I accept the <span className="text-[#F97316] font-bold">Privacy Policy</span> and <span className="text-[#F97316] font-bold">Terms</span>.
                        </label>
                    </div>
                    {error && !termsAccepted && (
                        <p className="text-red-500 text-[10px] font-bold animate-pulse pl-6">
                            * Please accept terms to proceed.
                        </p>
                    )}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-4 border-t border-gray-100 bg-white space-y-2 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-10">
                <button 
                    onClick={handleConfirm} 
                    className="w-full bg-[#5C9C72] hover:bg-[#4a855d] h-11 rounded-xl text-sm font-black uppercase shadow-lg text-white transition-all active:scale-[0.98] truncate px-1"
                >
                    Confirm Order (৳{total.toFixed(2)})
                </button>

                <button 
                    onClick={handleBackToCart}
                    className="w-full h-10 border-2 border-gray-100 text-gray-500 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={14} />
                    Back to Cart
                </button>
            </div>
        </div>
    );
};

export default CheckoutSummaryView;