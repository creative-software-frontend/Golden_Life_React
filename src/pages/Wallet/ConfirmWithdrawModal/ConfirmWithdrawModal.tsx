import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmWithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void; 
    onError: (message: string) => void;   
    amount: string;
    accountNumber: string;
    paymentMethod: string;
}

export default function ConfirmWithdrawModal({ 
    isOpen, onClose, onSuccess, onError, amount, accountNumber, paymentMethod
}: ConfirmWithdrawModalProps) {
    const { withdrawFunds } = useAppStore();
    
    const [pinCode, setPinCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pinCode.length !== 4) return;   // ← Strictly 4 digits only

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('type', 'withdraw');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('payment_method', paymentMethod);
            
            // Sending as both to fix "Invalid password" issues
            formData.append('password', pinCode); 
            formData.append('pin_code', pinCode); 
            

            const result = await withdrawFunds(formData);

            if (result.success) {
                toast.success(result.message);
                onSuccess(result.message);
                handleClose(); 
            } else {
                toast.error(result.message);
                onError(result.message);
                setIsSubmitting(false);
            }
        } catch (error) {
            const errorMsg = "Error processing withdrawal.";
            toast.error(errorMsg);
            onError(errorMsg);
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPinCode('');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/10 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-background rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-border/50 transform transition-all">
                
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-foreground">
                        <Lock size={20} className="text-secondary" strokeWidth={2.5} />
                        <h3 className="text-lg font-black tracking-tight">Verify Withdrawal</h3>
                    </div>
                    <button onClick={handleClose} disabled={isSubmitting} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Summary Card */}
                <div className="bg-muted/40 rounded-xl p-4 text-center mb-6 border border-border/50">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                        Withdrawing to <ArrowRight size={10} strokeWidth={3} /> <span className="text-foreground">{paymentMethod}</span>
                    </p>
                    <p className="text-lg font-black text-foreground mb-1 tracking-wide">{accountNumber}</p>
                    <p className="text-3xl font-black text-secondary tracking-tight">৳{amount}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Enter Your 4-Digit PIN
                        </label>
                        <input 
                            type="password" 
                            value={pinCode} 
                            onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))} 
                            maxLength={4} 
                            placeholder="••••" 
                            autoFocus
                            className="w-full mt-1 px-4 py-3 bg-muted border-2 border-border rounded-xl focus:border-secondary outline-none text-center text-2xl tracking-[0.5em] font-black text-foreground transition-all" 
                            required 
                        />

                        {/* Live length indicator */}
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
                        className="w-full flex justify-center items-center gap-2 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-black tracking-wide shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                <ShieldCheck size={18} strokeWidth={2.5}/> Confirm & Withdraw
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}