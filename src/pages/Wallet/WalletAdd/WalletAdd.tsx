import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import {
    ArrowLeft, Wallet, Smartphone, ShieldCheck,
    Loader2, UploadCloud, AlertCircle,
    ArrowRight, History, Plus, Clock, Activity, Building2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Configuration ---
const BANK_DETAILS = {
    accountName: "Golden Life Academy",
    accountNumber: "123-456-789-012",
    bankName: "Dutch Bangla Bank PLC",
    branch: "Dhanmondi Branch",
};

// --- Interfaces ---
interface Transaction {
    id: number;
    type: string;
    amount: string;
    payment_method: string;
    number: string;
    Transaction_ID: string | null;
    status: string;
    created_at: string;
}

export default function WalletAdd() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- State Management ---
    const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [trxId, setTrxId] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [currentBalance, setCurrentBalance] = useState<string>('0.00');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Status States
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const presetAmounts = [500, 1000, 2000, 5000];

    // --- Helpers ---
    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    const fetchBalance = async () => {
        try {
            const token = getAuthToken();
            const { data } = await axios.get(`${baseURL}/api/wallet-balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentBalance(Number(data?.data?.balance || 0).toFixed(2));
        } catch (err) { console.error(err); }
        finally { setIsLoadingBalance(false); }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const token = getAuthToken();
            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data?.status === "success") {
                setTransactions(data.transactions.filter((t: Transaction) => t.type === 'add'));
            }
        } catch (err) { console.error(err); }
        finally { setIsLoadingHistory(false); }
    };

    useEffect(() => {
        fetchBalance();
        fetchHistory();
    }, []);

    // --- Validation Logic ---
    const validateForm = (): boolean => {
        setError(null);
        const numAmount = Number(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount.");
            return false;
        }

        if (paymentMethod === 'bank') {
            if (!attachment) {
                setError("Bank transfers require a deposit slip/screenshot upload.");
                return false;
            }
            if (accountNumber.length < 8) {
                setError("Please enter a valid Bank Account or Reference number.");
                return false;
            }
        } else {
            // Bangladeshi Mobile Number Regex
            const bdMobileRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
            if (!bdMobileRegex.test(accountNumber)) {
                setError("Invalid sender mobile number format.");
                return false;
            }
        }

        if (trxId.length < 6) {
            setError("Transaction ID seems too short.");
            return false;
        }

        return true;
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('type', 'add');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('Transaction_ID', trxId);
            formData.append('payment_method', paymentMethod);
            if (attachment) formData.append('attachment', attachment);

            const { data } = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.status === 'success' || data?.status === "true") {
                setSuccess(data.message || "Request submitted successfully!");
                setAmount(''); setAccountNumber(''); setTrxId(''); setAttachment(null);
                fetchBalance(); fetchHistory();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Internal server error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Wallet Portal</h1>
                    <p className="text-slate-500">Securely top up your account balance</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-8 border border-slate-200">
                {(['add', 'history'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all",
                            activeTab === tab ? "bg-white shadow-md text-slate-900" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab === 'add' ? <Plus className="w-4 h-4" /> : <History className="w-4 h-4" />}
                        {tab === 'add' ? 'Add Money' : 'Add History'}
                    </button>
                ))}
            </div>

            {activeTab === 'add' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Side: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 p-8 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Balance</p>
                                        <p className="text-2xl font-bold text-slate-900">৳ {currentBalance}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleAddFunds} className="p-8 space-y-8">
                                {/* Amount Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700">Enter Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">৳</span>
                                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-12 pr-6 py-5 text-4xl font-bold bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {presetAmounts.map((p) => (
                                            <button key={p} type="button" onClick={() => setAmount(p.toString())} className={cn("px-4 py-2 rounded-xl border text-sm font-bold transition-all", Number(amount) === p ? "bg-secondary text-white border-secondary" : "bg-white text-slate-600 hover:border-slate-300")}>+ ৳{p}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Gateway Selection */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['bkash', 'nagad', 'rocket', 'bank'].map((method) => (
                                            <label key={method} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all uppercase text-[10px] font-black", paymentMethod === method ? "border-secondary bg-secondary/5 text-secondary" : "border-slate-100 text-slate-400 hover:border-slate-200")}>
                                                <input type="radio" className="hidden" onChange={() => setPaymentMethod(method)} checked={paymentMethod === method} />
                                                {method === 'bank' ? <Building2 className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                                {method}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Input Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">{paymentMethod === 'bank' ? 'Reference/Account' : 'Sender Number'}</label>
                                        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={paymentMethod === 'bank' ? "Account No" : "01XXXXXXXXX"} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Transaction ID</label>
                                        <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="TRX-XXXXXX" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none uppercase" />
                                    </div>
                                </div>

                                {/* Upload Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Payment Receipt {paymentMethod === 'bank' && <span className="text-red-500">*</span>}</label>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                                        <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                                        <p className="text-xs font-bold text-slate-500">{attachment ? attachment.name : "Click to upload screenshot"}</p>
                                        <input type="file" className="hidden" onChange={(e) => e.target.files && setAttachment(e.target.files[0])} />
                                    </label>
                                </div>

                                {/* Feedback */}
                                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-bounce"><ShieldCheck className="w-4 h-4" /> {success}</div>}

                                <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center gap-3 py-5 bg-secondary text-white rounded-2xl font-bold text-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Top Up Request"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Instructions (Dynamic) */}
                    <div className="lg:col-span-1 space-y-6">
                        {paymentMethod === 'bank' ? (
                            <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm space-y-4 animate-in slide-in-from-right-4">
                                <h3 className="text-blue-900 font-bold flex items-center gap-2"><Building2 className="w-5 h-5" /> Bank Transfer Guide</h3>
                                <div className="p-4 bg-blue-50 rounded-2xl space-y-3 text-sm">
                                    <div>
                                        <p className="text-blue-600 font-black text-[10px] uppercase">Bank Name</p>
                                        <p className="font-bold text-blue-900">{BANK_DETAILS.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-600 font-black text-[10px] uppercase">Account Number</p>
                                        <p className="font-bold text-blue-900">{BANK_DETAILS.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-600 font-black text-[10px] uppercase">Account Name</p>
                                        <p className="font-bold text-blue-900">{BANK_DETAILS.accountName}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 italic">Please include your student ID in the transfer reference for faster approval.</p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-slate-900 font-bold flex items-center gap-2"><Smartphone className="w-5 h-5" /> Mobile Wallet info</h3>
                                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600">
                                    <p>1. Go to your {paymentMethod} app</p>
                                    <p>2. Select "Send Money" or "Payment"</p>
                                    <p>3. Send funds to our merchant number</p>
                                    <p>4. Copy the Transaction ID and paste it here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* History Tab Remains Mostly Same, adding Loader */
                /* Changed max-w-7xl to max-w-screen-2xl (approx 1536px) for maximum professional width */
              
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] w-full overflow-hidden">
        
        {/* Updated Header with Record Count */}
        <div className="flex items-center justify-between px-12 py-6 bg-slate-50/50 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                Transaction History 
                {/* Record Count Badge */}
                {!isLoadingHistory && (
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px]">
                        {transactions.length} {transactions.length === 1 ? 'Record' : 'Records'} Found
                    </span>
                )}
            </h3>
            <div className="hidden md:flex gap-2">
                 <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Live Sync Active</span>
            </div>
        </div>

        {/* Column Labels */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-12 py-4 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div>Details</div>
            <div className="text-center">Method</div>
            <div className="text-center">Status</div>
            <div className="text-right">Timestamp</div>
        </div>

        {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-secondary/40" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Processing Records...</p>
            </div>
        ) : transactions.length === 0 ? (
            <div className="text-center py-32">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="w-12 h-12 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold uppercase text-sm">No transaction records found</p>
            </div>
        ) : (
            <div className="p-4 md:p-8 space-y-3">
                {transactions.map((item) => (
                    <div
                        key={item.id}
                        className="group p-5 md:px-10 md:py-6 border border-slate-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 items-center gap-4 hover:border-secondary/30 hover:bg-slate-50/30 transition-all duration-300"
                    >
                        {/* Amount */}
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                item.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                            )}>
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">৳{item.amount}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">ID: {item.Transaction_ID || 'PENDING'}</p>
                            </div>
                        </div>

                        {/* Method */}
                        <div className="flex flex-col md:items-center">
                            <span className="text-[10px] font-black text-slate-700 uppercase px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                {item.payment_method}
                            </span>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">{item.number}</p>
                        </div>

                        {/* Status */}
                        <div className="flex md:justify-center">
                            <span className={cn(
                                "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all",
                                item.status === 'approved' ? "bg-green-500 text-white" : "bg-orange-400 text-white"
                            )}>
                                {item.status}
                            </span>
                        </div>

                        {/* Date */}
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-bold text-slate-800">
                                {new Date(item.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
)}
          
        </div>
    );
}