import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Address } from './CheckoutModal';

interface Props {
    onBack: () => void;
    onClose: () => void;
    onSave: (newAddress: Address) => void;
}

const AddAddressFormView = ({ onBack, onClose, onSave }: Props) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleSave = () => {
        if (!formData.name || !formData.phone || !formData.address) {
            alert("Please fill in all fields");
            return;
        }

        const newAddress: Address = {
            id: Date.now(), // Unique ID generation
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            isDefault: false
        };

        onSave(newAddress);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold uppercase tracking-tight text-gray-800">New Address</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-gray-50/30">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 text-base font-medium focus:border-[#5C9C72] focus:bg-white outline-none transition-all shadow-sm" 
                        placeholder="e.g. John Doe" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 text-base font-medium focus:border-[#5C9C72] focus:bg-white outline-none transition-all shadow-sm" 
                        placeholder="017XXXXXXXX" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Address</label>
                    <textarea 
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 text-base font-medium focus:border-[#5C9C72] focus:bg-white outline-none transition-all shadow-sm resize-none" 
                        placeholder="House No, Road No, Area, City" 
                    />
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSave} 
                        className="w-full bg-[#5C9C72] hover:bg-[#4a855d] text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.98] text-sm tracking-widest"
                    >
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAddressFormView;