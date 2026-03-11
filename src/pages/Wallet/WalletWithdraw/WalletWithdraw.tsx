import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Wallet, Landmark, Smartphone, Minus,
    UploadCloud, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldCheck, Building2, User, Clock, ArrowUpRight, X, HelpCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import SetPinModal from '../SetPinModal/SetPinModal';
import ConfirmWithdrawModal from '../ConfirmWithdrawModal/ConfirmWithdrawModal';

interface Transaction {
    id: number | string;
    amount: string | number;
    type: string;
    gateway: string;
    status: 'pending' | 'completed' | 'failed' | 'rejected' | 'success';
    created_at: string;
    trx_id?: string;
    account_number?: string;
}

// Add your dynamic merchant number here
const MERCHANT_NUMBER = "01677468675";

const GATEWAY_CONFIGS: Record<string, any> = {
    bkash: {
        name: 'bKash',
        bg: 'bg-[#e2136e]', // Official bKash Pink
        text: 'text-[#e2136e]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*247#' },
            { id: 2, text: 'Select Option', highlight: '3 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 6, text: 'Enter Counter No', highlight: '1' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your bKash PIN' },
        ]
    },
    nagad: {
        name: 'Nagad',
        bg: 'bg-[#ed1c24]', // Official Nagad Red/Orange
        text: 'text-[#ed1c24]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*167#' },
            { id: 2, text: 'Select Option', highlight: '4 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Counter No', highlight: '1' },
            { id: 6, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your Nagad PIN' },
        ]
    },
    rocket: {
        name: 'Rocket',
        bg: 'bg-[#8c1515]',
        text: 'text-[#8c1515]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*322#' },
            { id: 2, text: 'Select Option', highlight: '1 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 6, text: 'Enter Counter No', highlight: '1' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your Rocket PIN' },
        ]
    },
    bank: {
        name: 'Bank Transfer',
        bg: 'bg-blue-600',
        text: 'text-blue-600'
    }
};

const BANK_DETAILS = {
    bankName: "City Bank Limited",
    accountNumber: "123456789012",
    accountName: "Golden Life"
};

export default function WalletWithdraw() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Tab & History States ---
    const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // --- Modal States ---
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);

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

    // --- API Calls ---
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

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const token = getAuthToken();
            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data?.status === "success" || data?.transactions) {
                const history = data.transactions || data.data || [];
                setTransactions(history.filter((t: Transaction) => t.type === 'withdraw'));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => { fetchBalance(); }, [baseURL]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    // --- Helpers ---
    const getGatewayConfig = (method: string) => {
        switch (method?.toLowerCase()) {
            case 'nagad': return { name: 'Nagad', bg: 'bg-[#ed1c24]', text: 'text-[#ed1c24]', border: 'border-[#ed1c24]/20' };
            case 'bkash': return { name: 'bKash', bg: 'bg-[#e2136e]', text: 'text-[#e2136e]', border: 'border-[#e2136e]/20' };
            case 'rocket': return { name: 'Rocket', bg: 'bg-[#8c1515]', text: 'text-[#8c1515]', border: 'border-[#8c1515]/20' };
            case 'bank': return { name: 'Bank', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200' };
            default: return { name: method, bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200' };
        }
    };

    // --- Validation & Open Modal ---
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
            const isRocket = paymentMethod === 'rocket';
            const mfsRegex = isRocket ? /^01\d{9,10}$/ : /^01\d{9}$/;

            if (!mfsRegex.test(mfsNumber)) {
                setErrorMessage(`Please enter a valid ${isRocket ? '11 or 12' : '11'}-digit ${paymentMethod.toUpperCase()} number.`);
                return;
            }
        } else if (paymentMethod === 'bank') {
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
        if (activeTab === 'history') fetchHistory();
    };

    const getFinalAccountDetails = () => {
        if (paymentMethod === 'bank') {
            return `${bankDetails.accountNumber} (${bankDetails.bankName} - ${bankDetails.branchName})`;
        }
        return mfsNumber;
    };

    // Instruction Modal Data
    const instructionConfig = GATEWAY_CONFIGS[paymentMethod] || GATEWAY_CONFIGS.bkash;
    const ussdSteps = instructionConfig.steps || [];

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
{/* --- Instruction Modal --- */}
            {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    
                    {/* UPDATED: Added max-h-[95vh] and flex-col for 125% zoom responsiveness */}
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">

                        <button
                            onClick={() => setShowGuideModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* UPDATED: Added flex-1, overflow-y-auto, and scrollbar hiding classes */}
                        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {paymentMethod === 'bank' ? (
                                <div className="p-6">
                                    <div className={cn("flex flex-col mb-6 -mx-6 -mt-6 p-6 text-white text-center shadow-sm rounded-t-3xl", instructionConfig.bg)}>
                                        <h3 className="font-bold text-xl mb-1">How to make the Payment</h3>
                                        <p className="text-xs text-blue-100 uppercase font-bold tracking-widest">Bank Transfer Guide</p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-2xl space-y-4 text-sm mt-4 border border-blue-100">
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">Bank Name</p>
                                            <p className="font-bold text-blue-900 text-lg">{BANK_DETAILS.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">Account Number</p>
                                            <p className="font-bold text-blue-900 text-lg">{BANK_DETAILS.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">Account Name</p>
                                            <p className="font-bold text-blue-900">{BANK_DETAILS.accountName}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 italic mt-6 text-center">Please include your student ID in the transfer reference for faster approval.</p>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className={cn("flex flex-col mb-6 -mx-6 -mt-6 p-6 text-white text-center shadow-sm rounded-t-3xl", instructionConfig.bg)}>
                                        <h3 className="font-bold text-xl mb-1">How to make the Payment</h3>
                                        <p className="text-xs uppercase font-bold tracking-widest opacity-90">{instructionConfig.name} USSD Guide</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {ussdSteps.map((step: any) => (
                                            <div key={step.id} className={cn(
                                                "relative border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50 border-slate-100",
                                                step.id === 7 ? "col-span-2" : "col-span-1"
                                            )}>
                                                <div className="absolute -top-3 -right-2 w-6 h-6 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded flex items-center justify-center text-[10px] shadow-sm">
                                                    {step.id}
                                                </div>

                                                <p className="text-[10px] font-medium text-slate-600 leading-tight mb-2 min-h-[24px] flex items-center justify-center">
                                                    {step.text}
                                                </p>

                                                <div className="w-full bg-white border border-slate-200 rounded p-1.5 text-center shadow-inner">
                                                    <span className={cn("font-bold text-xs tracking-tight", instructionConfig.text)}>
                                                        {step.highlight}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium text-center">
                                        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                                        You will receive a confirmation SMS after successful payment.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* UPDATED: Added shrink-0 to prevent the bottom button from squishing on zoomed screens */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                            <button
                                onClick={() => setShowGuideModal(false)}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* --- Tabs --- */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner">
                <button
                    onClick={() => setActiveTab('withdraw')}
                    className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                        activeTab === 'withdraw' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Withdraw
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                        activeTab === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    History
                </button>
            </div>

            {/* --- Main Content Area --- */}
            <div className="bg-background rounded-[32px] border border-border/50 shadow-xl overflow-hidden transition-all min-h-[400px]">

                {/* Balance Header (Shared across both tabs) */}
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

                {/* --- Withdraw Tab Content --- */}
                {activeTab === 'withdraw' && (
                    <form onSubmit={handleOpenConfirmation} className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                                <button
                                    type="button"
                                    onClick={() => setShowGuideModal(true)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    How to Pay?
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['bkash', 'nagad', 'rocket', 'bank'].map((method) => {
                                    const config = getGatewayConfig(method);
                                    const isComingSoon = method === 'rocket' || method === 'bank'; // Added Coming Soon Condition

                                    return (
                                        <label
                                            key={method}
                                            className={cn(
                                                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                                isComingSoon
                                                    ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                                                    : paymentMethod === method
                                                        ? `border-secondary bg-secondary/5 cursor-pointer`
                                                        : "border-slate-100 bg-white hover:border-slate-200 cursor-pointer"
                                            )}
                                        >
                                            {/* Coming Soon Badge */}
                                            {isComingSoon && (
                                                <span className="absolute top-2 right-2 bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                    Soon
                                                </span>
                                            )}

                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method}
                                                className="hidden"
                                                disabled={isComingSoon} // Disable selection for upcoming gateways
                                                onChange={(e) => {
                                                    if (!isComingSoon) {
                                                        setPaymentMethod(e.target.value);
                                                        setErrorMessage('');
                                                        setMfsNumber('');
                                                    }
                                                }}
                                                checked={paymentMethod === method}
                                            />
                                            {method === 'bank'
                                                ? <Landmark className={cn("w-6 h-6", isComingSoon ? "text-slate-400" : config.text)} />
                                                : <Smartphone className={cn("w-6 h-6", isComingSoon ? "text-slate-400" : config.text)} />
                                            }
                                            <span className={cn("text-xs font-bold uppercase", isComingSoon ? "text-slate-400" : config.text)}>
                                                {method}
                                            </span>
                                        </label>
                                    );
                                })}
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
                                            maxLength={paymentMethod === 'rocket' ? 12 : 11}
                                            value={mfsNumber}
                                            onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="e.g. 017XXXXXXXX"
                                            className="w-full pl-14 pr-6 py-4 text-base font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        {paymentMethod === 'rocket' ? "Must be a valid 11 or 12-digit mobile number." : "Must be a valid 11-digit mobile number."}
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
                                                <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} placeholder="e.g. City Bank" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Branch Name</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Landmark size={16} /></span>
                                                <input type="text" value={bankDetails.branchName} onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })} placeholder="e.g. Gulshan Branch" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Account Name</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
                                                <input type="text" value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Account Number</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={16} /></span>
                                                <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="e.g. 112233445566" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
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

                        <button type="submit" disabled={!amount} className="w-full py-5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-xl shadow-lg shadow-secondary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit Withdrawal Request
                        </button>
                    </form>
                )}

                {/* --- History Tab Content --- */}
    {activeTab === 'history' && (
    <div className="animate-in fade-in slide-in-from-left-4 duration-300 w-full">
        {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm font-medium">Loading history...</p>
            </div>
        ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 m-4 md:m-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-sm font-medium">No transactions found.</p>
            </div>
        ) : (
            <div className="bg-white rounded-[24px] md:rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                
                {/* Header Section */}
                <div className="flex flex-row items-center justify-between md:justify-start gap-4 px-5 py-5 md:px-8 md:py-6 border-b border-slate-100">
                    <h2 className="text-sm font-black text-slate-600 tracking-wider uppercase">Withdrawal History</h2>
                    <span className="px-3 py-1 bg-[#eef7f2] text-[#6cb28d] text-[10px] font-bold rounded-full tracking-wider uppercase shrink-0">
                        {transactions.length} Records
                    </span>
                </div>

                {/* Table Column Headers - Hidden on Mobile */}
                <div className="hidden md:grid grid-cols-4 gap-4 px-8 py-4 border-b border-slate-100 bg-white text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    <div>Details</div>
                    <div className="text-center">Method</div>
                    <div className="text-center">Status</div>
                    <div className="text-right">Timestamp</div>
                </div>

                {/* Transactions List */}
                <div className="p-4 md:p-6 space-y-3 md:space-y-4 bg-[#f8fafc]">
                    {transactions.map((trx, idx) => (
                        <div key={trx.id || idx} className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-4 gap-x-2 md:gap-4 p-4 border border-slate-100 rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow">
                            
                            {/* 1. Details Column (Top Left on Mobile) */}
                            <div className="order-1 flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-[14px] md:rounded-2xl bg-[#fff4eb] flex items-center justify-center text-[#f48120]">
                                    <Minus className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" /> 
                                </div>
                                <div>
                                    <p className="text-base md:text-lg font-black text-[#0f172a] leading-none mb-1 md:mb-1.5">
                                        ৳{Number(trx.amount).toFixed(2)}
                                    </p>
                                    <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase line-clamp-1">
                                        ID: {trx.invoice_number || `WTD${idx.toString().padStart(3, '0')}`}
                                    </p>
                                </div>
                            </div>

                            {/* 3. Status Column (Moved to Top Right on Mobile via order-2) */}
                            <div className="order-2 md:order-3 flex items-center justify-end md:justify-center">
                                <span className={cn(
                                    "px-3 py-1 md:px-4 md:py-1.5 text-[10px] font-bold text-white rounded-full uppercase tracking-wider",
                                    trx.status === 'completed' || trx.status === 'success' ? "bg-[#10b981]" :
                                    trx.status === 'pending' ? "bg-[#f48120]" : "bg-[#ef4444]"
                                )}>
                                    {trx.status}
                                </span>
                            </div>

                            {/* 2. Method Column (Moved to Bottom Left on Mobile via order-3) */}
                            <div className="order-3 md:order-2 flex flex-col items-start md:items-center justify-center">
                                <span className="px-2.5 py-1 bg-[#f1f5f9] text-[#334155] text-[10px] font-bold rounded-md uppercase mb-1 md:mb-1.5">
                                    {trx.payment_method}
                                </span>
                                <span className="text-[11px] md:text-[12px] font-medium text-[#64748b] truncate max-w-full">
                                    {trx.number || 'N/A'}
                                </span>
                            </div>

                            {/* 4. Timestamp Column (Bottom Right on Mobile) */}
                            <div className="order-4 flex flex-col items-end text-right">
                                <p className="text-[13px] md:text-sm font-bold text-[#0f172a] mb-1 md:mb-1.5">
                                    {new Date(trx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </p>
                                <div className="flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[12px] font-medium text-slate-400">
                                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    {new Date(trx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                
            </div>
        )}
    </div>
)}
            </div>
        </div>
    );
}