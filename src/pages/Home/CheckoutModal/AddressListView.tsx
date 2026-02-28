import React from 'react';
import { ArrowLeft, X, Plus, Check, Loader2 } from 'lucide-react';
import { Address } from './CheckoutModal';

interface Props {
    addresses?: Address[];
    selectedId?: number | string;
    onBack: () => void;
    onClose: () => void;
    onSelect: (addr: Address) => void;
    onAddNew: () => void;
    loading?: boolean;
}

const AddressListView = ({ 
    addresses = [], 
    selectedId, 
    onBack, 
    onClose, 
    onSelect, 
    onAddNew,
    loading = false 
}: Props) => (
    // 'min-h-0' and 'flex-col' ensure the container respects the parent's boundaries at high zooms
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
        
        {/* --- Header (Fixed) --- */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 bg-white shrink-0 z-10">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base md:text-lg font-black text-gray-800 uppercase tracking-tight">Select Address</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 md:space-y-5 bg-gray-50/50 min-h-0 
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
            <button 
                onClick={onAddNew} 
                className="w-full py-3.5 md:py-4 border-2 border-dashed border-[#5C9C72] bg-[#F0FDF4] text-[#5C9C72] rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-all"
            >
                <Plus className="w-5 h-5" /> Add New Address
            </button>

            <div className="space-y-3 md:space-y-4 pb-2">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-[#5C9C72] animate-spin" />
                    </div>
                ) : (!addresses || addresses.length === 0) ? (
                    <div className="text-center py-10 md:py-12 bg-white rounded-2xl border-2 border-gray-100 border-dashed">
                        <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider">No addresses found</p>
                    </div>
                ) : (
                    // --- FIXED: Added 'index' here ---
                    addresses.map((addr, index) => {
                        const isDefault = Number(addr.is_default) === 1 || String(addr.is_default).toLowerCase() === 'true';
                        const isSelected = selectedId != null && addr.id != null && String(selectedId) === String(addr.id);

                        return (
                            <div 
                                // --- FIXED: Applied the fallback index to the key ---
                                key={addr.id || `fallback-${index}`} 
                                onClick={() => onSelect(addr)} 
                                className={`relative p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all text-left group ${
                                    isSelected 
                                    ? "border-[#5C9C72] bg-white shadow-md ring-1 ring-[#5C9C72]" 
                                    : "border-gray-100 bg-white hover:border-gray-200"
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                                    <div className="flex items-center gap-2 pr-2">
                                        <h3 className="font-black text-gray-900 text-sm md:text-base uppercase tracking-tight truncate">
                                            {addr.name}
                                        </h3>
                                        {/* DEFAULT BADGE */}
                                        {isDefault && (
                                            <span className="bg-gray-100 text-gray-500 text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded border border-gray-200 uppercase shrink-0">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* CHECKMARK */}
                                    {isSelected && (
                                        <div className="w-5 h-5 md:w-6 md:h-6 bg-[#5C9C72] rounded-full flex items-center justify-center text-white shrink-0">
                                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500 space-y-0.5 md:space-y-1 font-medium">
                                    <p className="text-gray-700 font-bold">{addr.phone}</p>
                                    <p className="leading-relaxed line-clamp-2 md:line-clamp-none">{addr.address}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    </div>
);

export default AddressListView;