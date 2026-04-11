import React, { useState } from 'react';
import { Lock, X, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    amount: number;
    receiver_type: string;
    affiliate_id: string;
    type: string;
}

export default function ConfirmTransferModal({
    isOpen,
    onClose,
    onSuccess,
    onError,
    amount,
    receiver_type,
    affiliate_id,
    type
}: ConfirmTransferModalProps) {
    const { sendFunds } = useAppStore();
    const [pinCode, setPinCode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pinCode.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. We only use the JSON payload now (Standard for Laravel APIs)
            const payload = {
                type: type || 'send',
                amount: Number(amount),
                receiver_type: receiver_type,
                affiliate_id: affiliate_id,
                pin_code: pinCode // Fixed: used 'pinCode' from state
            };

            console.log("Submitting Transfer:", payload);
            const result = await sendFunds(payload);
            console.log("Full API Response:", result);

            // Prioritize message content over success flag (because backend is inconsistent)
            const message = result?.message || "";

            if (message.toLowerCase().includes("successfully") ||
                message.toLowerCase().includes("sent") ||
                result?.success === true) {

                toast.success(message || "Money sent successfully.");

                onSuccess?.(message || "Money sent successfully.");
                setPinCode('');
                onClose();
            } else {
                toast.error(message || "Transfer failed.");
                onError?.(message || "Transfer failed.");
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Transfer failed. Please try again.";
            toast.error(msg);
            onError?.(msg);
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
            <div className="bg-background rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary" />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                        <Lock className="text-secondary w-5 h-5" /> Verify Transfer
                    </h3>
                    <button onClick={handleClose} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-muted/50 rounded-2xl p-5 mb-6 border border-border/50 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                        Sending to <ArrowRight size={10} strokeWidth={4} /> <span className="text-secondary">{receiver_type}</span>
                    </p>
                    <p className="text-md font-black text-foreground break-all mb-2">{affiliate_id}</p>
                    <div className="text-3xl font-black text-foreground">৳{amount}</div>
                </div>

                <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 block text-center">
                            Enter Your 4-Digit Security PIN
                        </label>
                        <input
                            type="password"
                            inputMode="numeric"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={4}
                            placeholder="••••"
                            autoFocus
                            className="w-full px-4 py-4 bg-muted border-2 border-transparent focus:border-secondary focus:bg-background rounded-2xl outline-none text-center text-3xl tracking-[0.5em] font-black text-foreground transition-all"
                            required
                        />

                        <div className="flex justify-center items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-tighter">
                            {pinCode.length === 4 ? (
                                <span className="text-emerald-500 flex items-center gap-1">
                                    <ShieldCheck size={12} /> PIN Complete
                                </span>
                            ) : (
                                <span className="text-muted-foreground">{pinCode.length} / 4 Digits</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || pinCode.length !== 4}
                        className="w-full flex justify-center items-center gap-2 py-4 bg-secondary text-white rounded-2xl font-black shadow-lg shadow-secondary/20 hover:opacity-95 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck size={20} /> Authorize Payment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}