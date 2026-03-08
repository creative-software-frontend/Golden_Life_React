import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Lock, X, Loader2, ShieldCheck } from 'lucide-react';

interface ConfirmTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string, amount: string) => void;
    onError: (message: string) => void;
    amount: string;
    receiverType: string;
    affiliateId: string;
    baseURL: string;
    token: string | null;
}

export default function ConfirmTransferModal({ 
    isOpen, onClose, onSuccess, onError, amount, receiverType, affiliateId, baseURL, token 
}: ConfirmTransferModalProps) {
    const [pinCode, setPinCode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSendMoney = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('type', 'send');
            formData.append('amount', amount);
            formData.append('receiver_type', receiverType);
            formData.append('affiliate_id', affiliateId);
            formData.append('pin_code', pinCode);

            const response = await axios.post(`${baseURL}/api/send-money`, formData, {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) }
            });

            // FIXED: Explicitly check for 'success' or boolean true
            if (response.data?.status === 'success' || response.data?.status === true) {
                onSuccess(response.data?.message || "Transfer completed successfully!", amount);
                setPinCode('');
                onClose();
            } else {
                // Backend returned 200 OK, but it's a logical error (status: false)
                onError(String(response.data?.message || "Transfer failed. Please check your details."));
                onClose();
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            const responseData = axiosError.response?.data;
            
            let finalErrorMessage = "Failed to process transfer. Please try again.";

            if (responseData) {
                if (typeof responseData.message === 'string') {
                    finalErrorMessage = responseData.message;
                }
                
                // Safe extraction of deep Laravel Validation Errors
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

            // CRITICAL FIX: Force conversion to String to prevent React "Oops" crash screen
            onError(String(finalErrorMessage));
            onClose(); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                        <Lock className="text-secondary" /> Verify Transfer
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={20}/>
                    </button>
                </div>
                
                <div className="bg-muted rounded-xl p-4 mb-4 border border-border text-center">
                    <p className="text-sm font-medium text-muted-foreground">Sending to {receiverType}</p>
                    <p className="text-xl font-black text-foreground break-all">{affiliateId}</p>
                    <div className="mt-2 text-3xl font-black text-secondary">৳{amount}</div>
                </div>

                <form onSubmit={handleSendMoney} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase">Enter Your PIN</label>
                        <input 
                            type="password" 
                            value={pinCode} 
                            onChange={(e) => setPinCode(e.target.value)} 
                            maxLength={6} 
                            placeholder="••••" 
                            className="w-full mt-1 px-4 py-3 bg-muted border-2 border-border rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 outline-none text-center text-2xl tracking-[0.5em] font-black text-foreground" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || pinCode.length < 4} 
                        className="w-full flex justify-center items-center gap-2 py-3 bg-secondary hover:opacity-90 text-secondary-foreground rounded-xl font-black tracking-wide transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : <><ShieldCheck size={20}/> Confirm & Send</>}
                    </button>
                </form>
            </div>
        </div>
    );
}