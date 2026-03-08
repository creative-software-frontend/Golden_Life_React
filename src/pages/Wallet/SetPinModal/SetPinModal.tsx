import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { KeyRound, X, Loader2, ShieldCheck } from 'lucide-react';

interface SetPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    baseURL: string;
    token: string | null;
}

export default function SetPinModal({ isOpen, onClose, onSuccess, onError, baseURL, token }: SetPinModalProps) {
    const [newPin, setNewPin] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSetPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('pin_code', newPin);

            const response = await axios.post(`${baseURL}/api/set-pin`, formData, {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) }
            });

            if (response.data?.status === 'success' || response.data?.status === true) {
                onSuccess(response.data?.message || "PIN set successfully!");
                setNewPin('');
                onClose();
            } else {
                onError(String(response.data?.message || "Failed to set PIN."));
                setNewPin(''); 
                onClose();     
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            onError(String(axiosError.response?.data?.message || "Error setting PIN."));
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/10 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Container with subtle glow and premium shadow */}
            <div className="relative bg-background rounded-[28px] p-8 w-full max-w-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border/50 transform transition-all">
                
                {/* Close Button (Floating top right) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-5 right-5 text-muted-foreground hover:bg-muted hover:text-foreground p-2 rounded-full transition-colors"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {/* Centered Header Section */}
                <div className="flex flex-col items-center text-center mb-8 mt-2">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 border border-secondary/20 shadow-inner">
                        <KeyRound className="text-secondary w-8 h-8" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">
                        Secure Your Wallet
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mt-2 px-4">
                        Create a 4 to 6 digit PIN to protect your future transactions.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSetPin} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input 
                                type="password" 
                                value={newPin} 
                                onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers visually
                                maxLength={6} 
                                placeholder="••••" 
                                className="w-full px-4 py-4 bg-muted/50 border-2 border-transparent focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 rounded-2xl outline-none text-center text-3xl tracking-[0.75em] font-black text-foreground transition-all placeholder:text-muted-foreground/30 placeholder:tracking-normal placeholder:font-medium placeholder:text-lg" 
                                required 
                            />
                        </div>
                        <div className="flex justify-center items-center gap-1.5 pt-2">
                            <ShieldCheck size={14} className="text-secondary" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">End-to-end encrypted</span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || newPin.length < 4} 
                        className="w-full group relative flex justify-center items-center gap-2 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-black text-base tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                Save PIN Code
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}