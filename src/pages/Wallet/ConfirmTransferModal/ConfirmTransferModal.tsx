import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Lock, X, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ConfirmWithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    amount: string;
    accountNumber: string;
    paymentMethod: string;
    attachment: File | null;
    baseURL: string;
    token: string | null;
}

export default function ConfirmWithdrawModal({ 
    isOpen, onClose, onSuccess, onError, amount, accountNumber, paymentMethod, attachment, baseURL, token 
}: ConfirmWithdrawModalProps) {
    
    const [pinCode, setPinCode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pinCode.length !== 4) return;   // ← Enforce exactly 4 digits

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('type', 'withdraw');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('payment_method', paymentMethod);
            
            formData.append('password', pinCode); 
            formData.append('pin_code', pinCode); 

            if (attachment) {
                formData.append('attachment', attachment);
            }

            const response = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) }
            });

            if (response.data?.status === 'success' || response.data?.status === true) {
                onSuccess(response.data?.message || "Withdrawal completed successfully!");
                setPinCode('');
                onClose();
            } else {
                onError(String(response.data?.message || "Withdrawal failed. Please check your details."));
                setIsSubmitting(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            const responseData = axiosError.response?.data;
            
            let finalErrorMessage = "Failed to process withdrawal. Please try again.";

            if (responseData) {
                if (typeof responseData.message === 'string') {
                    finalErrorMessage = responseData.message;
                }
                
                if (responseData.errors && typeof responseData.errors === 'object') {
                    const firstErrorKey = Object.keys(responseData.errors)[0];
                    const firstErrorVal = responseData.errors[firstErrorKey];
                    
                    if (Array.isArray(firstErrorVal) && typeof firstErrorVal[0] === 'string') {
                        finalErrorMessage = firstErrorVal[0];
                    } else if (typeof firstErrorVal === 'string') {
                        finalErrorMessage = firstErrorVal;
                    }
                }
            }

            onError(String(finalErrorMessage));
            setIsSubmitting(false); 
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPinCode('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                        <Lock className="text-secondary" /> Verify Withdrawal
                    </h3>
                    <button onClick={handleClose} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={20}/>
                    </button>
                </div>
                
                {/* Summary Card */}
                <div className="bg-muted rounded-xl p-4 mb-4 border border-border text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                        Withdrawing to <ArrowRight size={12} strokeWidth={3} /> <span className="text-foreground">{paymentMethod}</span>
                    </p>
                    <p className="text-lg font-black text-foreground break-all">{accountNumber}</p>
                    <div className="mt-2 text-3xl font-black text-secondary">৳{amount}</div>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase">
                            Enter Your 4-Digit PIN
                        </label>
                        <input 
                            type="password" 
                            value={pinCode} 
                            onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))} 
                            maxLength={4} 
                            placeholder="••••" 
                            autoFocus
                            className="w-full mt-1 px-4 py-3 bg-muted border-2 border-border rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 outline-none text-center text-2xl tracking-[0.5em] font-black text-foreground transition-all" 
                            required 
                        />

                        {/* Live Length Indicator */}
                        <div className="flex justify-center items-center gap-2 mt-2 text-[11px] font-bold text-muted-foreground">
                            <span>{pinCode.length} / 4 digits</span>
                            {pinCode.length > 0 && pinCode.length !== 4 && (
                                <span className="text-amber-500">• Must be exactly 4</span>
                            )}
                            {pinCode.length === 4 && (
                                <span className="text-emerald-500">✓ Perfect</span>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || pinCode.length !== 4} 
                        className="w-full flex justify-center items-center gap-2 py-3 bg-secondary hover:opacity-90 text-secondary-foreground rounded-xl font-black tracking-wide transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin mx-auto" />
                        ) : (
                            <>
                                <ShieldCheck size={20}/> Confirm & Withdraw
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}