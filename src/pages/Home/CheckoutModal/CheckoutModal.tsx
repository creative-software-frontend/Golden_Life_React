'use client';

import React, { useState, useEffect } from 'react';
import useModalStore from '@/store/Store';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Sub-components
import CheckoutSummaryView from './CheckoutSummaryView';
import AddressListView from './AddressListView';
import AddAddressForm from './AddAddressFormView';

// --- Types ---
export type ViewState = 'CHECKOUT' | 'ADDRESS_LIST' | 'ADD_ADDRESS';
export type PaymentMethod = 'Wallet' | 'Bkash' | 'Nogod';

export interface Address {
    id: number;
    name: string;
    address: string;
    phone: string;
    division_id?: number | string;
    district_id?: number | string;
    thana_id?: number | string;
    is_default?: boolean | number | string;
}

const CheckoutModal = () => {
    const navigate = useNavigate();
    const { isCheckoutModalOpen, changeCheckoutModal } = useModalStore();

    // Config
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    const [view, setView] = useState<ViewState>('CHECKOUT');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');
    const [cartData, setCartData] = useState({ subTotal: 0, totalItems: 0 });

    // --- State ---
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // 1. Load Data on Open
    useEffect(() => {
        if (isCheckoutModalOpen) {
            loadCart();
            fetchAddresses();
        }
    }, [isCheckoutModalOpen]);

    // 2. Helper: Load Cart 
    const loadCart = () => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsed = JSON.parse(storedCart);
            const subTotal = parsed.reduce((acc: number, item: any) => acc + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
            const totalItems = parsed.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
            setCartData({ subTotal, totalItems });
        }
    };

    // 3. API: Fetch Addresses List (GET)
    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${baseURL}/api/student/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Adjust based on API structure
            const apiAddresses = response.data?.addresses || [];
            setAddresses(apiAddresses);

            // Auto-select default logic
            if (apiAddresses.length > 0 && !selectedAddress) {
                const defaultAddr = apiAddresses.find((a: any) => Number(a.is_default) === 1 || String(a.is_default).toLowerCase() === 'true');
                const initialAddr = defaultAddr || apiAddresses[0];

                handleSelectAddress(initialAddr, false); // Select without switching view
            }
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    // 4. API: Select Address & Fetch Fee
    const handleSelectAddress = async (addr: Address, switchView: boolean = true) => {
        setSelectedAddress(addr);
        if (switchView) setView('CHECKOUT');

        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // ==========================================
        // CALL 1: Select Address API 
        // ==========================================
        try {
            await axios.post(`${baseURL}/api/student/address/select`, {
                address_id: addr.id,
                id: addr.id
            }, config);
        } catch (error: any) {
            console.error("Select Address API Failed (422):", error.response?.data || error.message);
        }

        // ==========================================
        // CALL 2: Fetch Delivery Fee API 
        // ==========================================
        try {
            const feeResponse = await axios.post(
                `${baseURL}/api/getDeliveryCharge?address_id=${addr.id}`,
                {},
                config
            );

            // *** FIX: Extracted correctly from the JSON structure you provided ***
            // JSON: { status: "success", data: { delivery_charge: 150 } }
            const charge = feeResponse.data?.data?.delivery_charge;

            if (charge !== undefined && charge !== null) {
                setDeliveryFee(Number(charge));
            } else {
                setDeliveryFee(60); // Fallback if missing
            }

        } catch (error: any) {
            console.error("Fetch Fee API Failed:", error.response?.data || error.message);
            setDeliveryFee(60); // Fallback on hard failure
        }
    };

    // 5. Handle New Address Saved
    const handleSaveNewAddress = (newAddr: Address) => {
        fetchAddresses();
        setView('CHECKOUT');
    };

    if (!isCheckoutModalOpen) return null;

    const handleClose = () => {
        setView('CHECKOUT');
        changeCheckoutModal();
    };

return (
        // The overlay background with padding so the modal never touches the exact edges of the screen
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
            
            {/* The Modal Box: max-h-[90vh] ensures it leaves a 10% gap and doesn't get cut off at the top/bottom */}
            <div className="bg-white w-full max-w-[420px] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
                
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
                        // @ts-ignore
                        deliveryFee={deliveryFee}
                    />
                )}

                {view === 'ADDRESS_LIST' && (
                    <AddressListView 
                        addresses={addresses} 
                        selectedId={selectedAddress?.id}
                        onBack={() => setView('CHECKOUT')}
                        onClose={handleClose}
                        onSelect={(addr) => handleSelectAddress(addr, true)}
                        onAddNew={() => setView('ADD_ADDRESS')}
                        loading={loadingAddresses}
                    />
                )}

                {view === 'ADD_ADDRESS' && (
                    <AddAddressForm 
                        onClose={() => setView('ADDRESS_LIST')} 
                        onBack={() => setView('ADDRESS_LIST')} 
                        onSave={handleSaveNewAddress} 
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;