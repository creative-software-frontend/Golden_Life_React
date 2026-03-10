import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { 
    ArrowLeft, Wallet, Landmark, Smartphone, 
    UploadCloud, CheckCircle2, AlertCircle, Loader2, ArrowRight, KeyRound, X, ShieldCheck, Lock
} from 'lucide-react';
import { cn } from "@/lib/utils"; 
import SetPinModal from '../SetPinModal/SetPinModal';
import ConfirmWithdrawModal from '../ConfirmWithdrawModal/ConfirmWithdrawModal'; // Ensure this exists

export default function WalletWithdraw() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Modal States ---
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // --- Form State ---
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [accountNumber, setAccountNumber] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    
    // --- UI & Data State ---
    const [currentBalance, setCurrentBalance] = useState(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const presetAmounts: number[] = [500, 1000, 2000, 5000];

    const getAuthToken = (): string | null => {
        const session = sessionStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    const fetchBalance = async () => {
        setIsLoadingBalance(true);
        try {
            const token = getAuthToken();
            if (!token) return;
            const response = await axios.get(`${baseURL}/api/wallet-balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedBalance = response.data?.data?.balance || response.data?.balance || 0;
            setCurrentBalance(Number(fetchedBalance));
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    useEffect(() => { fetchBalance(); }, [baseURL]);

    // Opens the PIN verification modal
    const handleOpenConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (Number(amount) > currentBalance) {
            setErrorMessage("Insufficient funds.");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleWithdrawSuccess = async (msg: string) => {
        setSuccessMessage(msg);
        setAmount('');
        setAccountNumber('');
        setAttachment(null);
        await fetchBalance();
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- Modals --- */}
            <SetPinModal 
                isOpen={isPinModalOpen} 
                onClose={() => setIsPinModalOpen(false)} 
                onSuccess={(msg) => setSuccessMessage(msg)}
                onError={(msg) => setErrorMessage(msg)}
                baseURL={baseURL}
                token={getAuthToken()}
            />

            <ConfirmWithdrawModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onSuccess={handleWithdrawSuccess}
                onError={(msg) => setErrorMessage(msg)}
                amount={amount}
                accountNumber={accountNumber}
                paymentMethod={paymentMethod}
                attachment={attachment}
                baseURL={baseURL}
                token={getAuthToken()}
            />

            {/* --- Page Header --- */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-background border border-border shadow-sm hover:bg-muted text-muted-foreground transition-all">
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-foreground tracking-tight">Withdraw Funds</h1>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">Wallet to Mobile / Bank</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsPinModalOpen(true)} 
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl text-xs font-bold transition-all"
                >
                    <KeyRound size={16} /> Set PIN
                </button>
            </div>

            {/* --- Main Card --- */}
            <div className="bg-background rounded-[32px] border border-border/50 shadow-xl overflow-hidden transition-all">
                
                {/* Balance Header */}
                <div className="bg-slate-50 p-6 md:p-10 border-b border-border/50">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                            {isLoadingBalance ? (
                                <div className="h-9 w-32 bg-slate-200 animate-pulse rounded-lg"></div>
                            ) : (
                                <p className="text-3xl md:text-4xl font-bold text-slate-900">৳ {currentBalance.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleOpenConfirmation} className="p-6 md:p-10 space-y-8">
                    {successMessage && <div className="flex items-center gap-3 p-4 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20 font-bold text-sm"><CheckCircle2 className="w-5 h-5" />{successMessage}</div>}
                    {errorMessage && <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 font-bold text-sm"><AlertCircle className="w-5 h-5" />{errorMessage}</div>}

                    {/* Amount Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Withdraw Amount</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">৳</span>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-14 pr-6 py-6 text-5xl font-bold bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white outline-none focus:border-secondary transition-all" required />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {presetAmounts.map((preset) => (
                                <button key={preset} type="button" onClick={() => setAmount(preset.toString())} disabled={isLoadingBalance || preset > currentBalance} className={cn("px-5 py-2 rounded-xl font-bold text-xs transition-all border", Number(amount) === preset ? 'bg-secondary text-white border-secondary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>৳{preset}</button>
                            ))}
                        </div>
                    </div>

                    {/* Gateway */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['bkash', 'nagad', 'rocket', 'bank'].map((method) => (
                                <label key={method} className={cn("flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all", paymentMethod === method ? "border-secondary bg-secondary/5" : "border-slate-100 bg-white hover:border-slate-200")}>
                                    <input type="radio" name="payment" value={method} className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} checked={paymentMethod === method} />
                                    {method === 'bank' ? <Landmark className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                    <span className="text-xs font-bold uppercase">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Account Number */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Account Number</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Smartphone size={20} /></span>
                            <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. 017XXXXXXXX" className="w-full pl-14 pr-6 py-4 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all" required />
                        </div>
                    </div>

                    {/* Attachment */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Proof Image (Optional)</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-xs font-semibold text-slate-500">{attachment ? attachment.name : "Click to upload"}</p>
                            <input type="file" className="hidden" onChange={(e) => e.target.files && setAttachment(e.target.files[0])} />
                        </label>
                    </div>

                    <button type="submit" disabled={!amount || !accountNumber} className="w-full py-5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-xl shadow-lg shadow-secondary/20 transition-all active:scale-[0.98]">
                        Submit Withdrawal Request
                    </button>
                </form>
            </div>
        </div>
    );
}