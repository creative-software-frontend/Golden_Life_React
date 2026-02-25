import React from 'react';
import { ArrowLeft, X, Plus, Check } from 'lucide-react';
import { Address } from './CheckoutModal';

interface Props {
    addresses?: Address[]; // Made optional with ? to be safe
    selectedId?: number;
    onBack: () => void;
    onClose: () => void;
    onSelect: (addr: Address) => void;
    onAddNew: () => void;
}

// Added = [] as a default value to addresses
const AddressListView = ({ 
    addresses = [], 
    selectedId, 
    onBack, 
    onClose, 
    onSelect, 
    onAddNew 
}: Props) => (
    <div className="flex flex-col h-full bg-white font-sans">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Select Address</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50">
            <button 
                onClick={onAddNew} 
                className="w-full py-4 border-2 border-dashed border-[#5C9C72] bg-[#F0FDF4] text-[#5C9C72] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-all"
            >
                <Plus className="w-5 h-5" /> Add New Address
            </button>

            <div className="space-y-4">
                {/* Fixed the crash here using optional chaining and default check */}
                {(!addresses || addresses.length === 0) ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100 border-dashed">
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">No addresses saved yet</p>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div 
                            key={addr.id} 
                            onClick={() => onSelect(addr)} 
                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all text-left group ${
                                selectedId === addr.id 
                                ? "border-[#5C9C72] bg-white shadow-md ring-1 ring-[#5C9C72]" 
                                : "border-gray-100 bg-white hover:border-gray-200"
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-black text-gray-900 text-base uppercase tracking-tight">
                                    {addr.name}
                                </h3>
                                {selectedId === addr.id && (
                                    <div className="w-6 h-6 bg-[#5C9C72] rounded-full flex items-center justify-center text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <div className="text-sm text-gray-500 space-y-1 font-medium">
                                <p className="text-gray-700 font-bold">{addr.phone}</p>
                                <p className="leading-relaxed">{addr.address}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

export default AddressListView;