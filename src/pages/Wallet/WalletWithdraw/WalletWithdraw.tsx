import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { 
    ArrowLeft, Wallet, Landmark, Smartphone, 
    UploadCloud, CheckCircle2, AlertCircle, Loader2, ArrowRight, KeyRound, X, ShieldCheck, Lock, Building2, User
} from 'lucide-react';
import { cn } from "@/lib/utils"; 
import SetPinModal from '../SetPinModal/SetPinModal';
import ConfirmWithdrawModal from '../ConfirmWithdrawModal/ConfirmWithdrawModal';

export default function WalletWithdraw() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Modal States ---
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // --- Form State ---
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [attachment, setAttachment] = useState<File | null>(null);
    
    // Gateway-Specific States
    const [mfsNumber, setMfsNumber] = useState('');
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        branchName: '',
        accountName: '',
        accountNumber: ''
    });
    
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

    // Validation & Open Modal
    const handleOpenConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        
        // 1. Amount Validation
        if (!amount || Number(amount) <= 0) {
            setErrorMessage("Please enter a valid amount.");
            return;
        }
        if (Number(amount) > currentBalance) {
            setErrorMessage("Insufficient funds.");
            return;
        }

        // 2. Gateway Specific Validation
        if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
            // bKash & Nagad: strictly 11 digits. Rocket: 11 or 12 digits.
            const isRocket = paymentMethod === 'rocket';
            const mfsRegex = isRocket ? /^01\d{9,10}$/ : /^01\d{9}$/;
            
            if (!mfsRegex.test(mfsNumber)) {
                setErrorMessage(`Please enter a valid ${isRocket ? '11 or 12' : '11'}-digit ${paymentMethod.toUpperCase()} number.`);
                return;
            }
        } else if (paymentMethod === 'bank') {
            // Bank Details Validation
            if (!bankDetails.bankName || !bankDetails.branchName || !bankDetails.accountName || !bankDetails.accountNumber) {
                setErrorMessage("Please fill in all required bank details.");
                return;
            }
        }

        setIsConfirmModalOpen(true);
    };

    const handleWithdrawSuccess = async (msg: string) => {
        setSuccessMessage(msg);
        setAmount('');
        setMfsNumber('');
        setBankDetails({ bankName: '', branchName: '', accountName: '', accountNumber: '' });
        setAttachment(null);
        await fetchBalance();
    };

    const getFinalAccountDetails = () => {
        if (paymentMethod === 'bank') {
            return `${bankDetails.accountNumber} (${bankDetails.bankName} - ${bankDetails.branchName})`;
        }
        return mfsNumber;
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
                accountNumber={getFinalAccountDetails()} 
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
                    {successMessage && <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 font-bold text-sm"><CheckCircle2 className="w-5 h-5" />{successMessage}</div>}
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

                    {/* Gateway Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['bkash', 'nagad', 'rocket', 'bank'].map((method) => (
                                <label key={method} className={cn("flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all", paymentMethod === method ? "border-secondary bg-secondary/5" : "border-slate-100 bg-white hover:border-slate-200")}>
                                    <input type="radio" name="payment" value={method} className="hidden" onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                        setErrorMessage(''); // Clear errors when switching gateways
                                        setMfsNumber(''); // Optional: clear number on switch to avoid carrying over a 12 digit num to bKash
                                    }} checked={paymentMethod === method} />
                                    {method === 'bank' ? <Landmark className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                    <span className="text-xs font-bold uppercase">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Gateway Fields */}
                    <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                        {['bkash', 'nagad', 'rocket'].includes(paymentMethod) ? (
                            <>
                                <label className="text-sm font-bold text-slate-700 uppercase">{paymentMethod} Account Number</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Smartphone size={20} /></span>
                                    <input 
                                        type="tel" 
                                        // ⬇️ DYNAMIC MAXLENGTH ADDED HERE ⬇️
                                        maxLength={paymentMethod === 'rocket' ? 12 : 11}
                                        value={mfsNumber} 
                                        onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                        placeholder="e.g. 017XXXXXXXX" 
                                        className="w-full pl-14 pr-6 py-4 text-base font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all" 
                                        required 
                                    />
                                </div>
                                {/* ⬇️ DYNAMIC HELPER TEXT ADDED HERE ⬇️ */}
                                <p className="text-[11px] font-medium text-slate-500">
                                    {paymentMethod === 'rocket' 
                                        ? "Must be a valid 11 or 12-digit mobile number." 
                                        : "Must be a valid 11-digit mobile number."}
                                </p>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 uppercase">Bank Account Details</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500">Bank Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Building2 size={16} /></span>
                                            <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} placeholder="e.g. City Bank" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500">Branch Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Landmark size={16} /></span>
                                            <input type="text" value={bankDetails.branchName} onChange={(e) => setBankDetails({...bankDetails, branchName: e.target.value})} placeholder="e.g. Gulshan Branch" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500">Account Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
                                            <input type="text" value={bankDetails.accountName} onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})} placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500">Account Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={16} /></span>
                                            <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} placeholder="e.g. 112233445566" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

                    <button type="submit" disabled={!amount} className="w-full py-5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-xl shadow-lg shadow-secondary/20 transition-all active:scale-[0.98]">
                        Submit Withdrawal Request
                    </button>
                </form>
            </div>
        </div>
    );
}