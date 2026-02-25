'use client';

import React, { useState, useEffect } from 'react';
import useModalStore from '@/store/Store';
import { useNavigate } from "react-router-dom";

// Sub-components
import CheckoutSummaryView from './CheckoutSummaryView';
import AddressListView from './AddressListView';
import AddAddressFormView from './AddAddressFormView';

// --- Types ---
export type ViewState = 'CHECKOUT' | 'ADDRESS_LIST' | 'ADD_ADDRESS';
export type PaymentMethod = 'Wallet' | 'Bkash' | 'Nogod';

export interface Address {
    id: number;
    name: string;
    address: string;
    phone: string;
    label?: string;
    isDefault?: boolean;
}

const CheckoutModal = () => {
    const navigate = useNavigate();
    const { isCheckoutModalOpen, changeCheckoutModal } = useModalStore();
    
    const [view, setView] = useState<ViewState>('CHECKOUT');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');
    const [cartData, setCartData] = useState({ subTotal: 0, totalItems: 0 });

    // --- Dynamic Address State ---
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);

    // 1. Load Data (Cart & Addresses) on mount/open
    useEffect(() => {
        if (isCheckoutModalOpen) {
            // Load Cart
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const parsed = JSON.parse(storedCart);
                const subTotal = parsed.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                const totalItems = parsed.reduce((acc: number, item: any) => acc + item.quantity, 0);
                setCartData({ subTotal, totalItems });
            }

            // Load Saved Addresses
            const storedAddresses = localStorage.getItem('user_addresses');
            if (storedAddresses) {
                const parsedAddresses = JSON.parse(storedAddresses);
                setAddresses(parsedAddresses);
                
                // Automatically select the first address if none selected
                if (parsedAddresses.length > 0 && !selectedAddress) {
                    setSelectedAddress(parsedAddresses[0]);
                }
            }
        }
    }, [isCheckoutModalOpen]);

    // 2. Save New Address Function
    const handleSaveNewAddress = (newAddr: Address) => {
        const updatedAddresses = [...addresses, newAddr];
        setAddresses(updatedAddresses);
        setSelectedAddress(newAddr); // Auto-select the newly created one
        
        // Persist to LocalStorage
        localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
        
        // Go back to the summary view
        setView('CHECKOUT');
    };

    if (!isCheckoutModalOpen) return null;

    const handleClose = () => {
        setView('CHECKOUT');
        changeCheckoutModal();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {view === 'CHECKOUT' && (
                    <CheckoutSummaryView 
                        data={cartData}
                        selectedAddress={selectedAddress}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        onClose={handleClose}
                        onChangeAddress={() => setView('ADDRESS_LIST')}
                        onConfirm={() => {
                            handleClose();
                            navigate("/orderdetails");
                        }}
                    />
                )}

                {view === 'ADDRESS_LIST' && (
                    <AddressListView 
                        addresses={addresses} // Passing the actual state array
                        selectedId={selectedAddress?.id}
                        onBack={() => setView('CHECKOUT')}
                        onClose={handleClose}
                        onSelect={(addr) => {
                            setSelectedAddress(addr);
                            setView('CHECKOUT');
                        }}
                        onAddNew={() => setView('ADD_ADDRESS')}
                    />
                )}

                {view === 'ADD_ADDRESS' && (
                    <AddAddressFormView 
                        onBack={() => setView('ADDRESS_LIST')}
                        onClose={handleClose}
                        onSave={handleSaveNewAddress} // Passing the real save function
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;