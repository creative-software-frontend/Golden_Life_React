import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import {
    ArrowLeft, Wallet, Smartphone, ShieldCheck,
    Loader2, CheckCircle2, UploadCloud, AlertCircle,
    ArrowRight, History, Plus, Clock, Activity
} from 'lucide-react';
import { cn } from "@/lib/utils";

// --- TypeScript Interfaces ---
interface Transaction {
    id: number;
    type: string;
    amount: string;
    payment_method: string;
    number: string;
    Transaction_ID: string | null;
    invoice_number: string;
    status: string;
    created_at: string;
}

interface WalletAddResponse {
    status: string;
    message: string;
    data?: any;
}

export default function WalletAdd() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [trxId, setTrxId] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [currentBalance, setCurrentBalance] = useState<string>('0.00');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

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
            const fetchedBalance = response.data?.data?.balance || response.data?.balance || '0.00';
            setCurrentBalance(Number(fetchedBalance).toFixed(2));
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
            const response = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data?.status === "success") {
                const addOnly = response.data.transactions.filter((t: Transaction) => t.type === 'add');
                setTransactions(addOnly);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchHistory();
    }, [baseURL]);

    const handleAddFunds = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (Number(amount) <= 0) {
            setErrorMessage("Amount must be greater than 0.");
            return;
        }
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('type', 'add');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('Transaction_ID', trxId);
            formData.append('payment_method', paymentMethod);
            if (attachment) formData.append('attachment', attachment);

            const response: AxiosResponse<WalletAddResponse> = await axios.post(
                `${baseURL}/api/transactions`,
                formData,
                { headers: { ...(token && { Authorization: `Bearer ${token}` }) } }
            );

            if (response.data?.status === 'success' || response.data?.status === "true") {
                setSuccessMessage(response.data.message || "Transaction created successfully.");
                setAmount(''); setAccountNumber(''); setTrxId(''); setAttachment(null);
                await fetchBalance();
                await fetchHistory();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Failed to process transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        /* INCREASED WIDTH TO 5XL */
        <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Area */}
            <div className="flex items-center gap-4 mb-8 md:mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-500 transition-all"
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={2} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900">Wallet Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Manage your funds and view transaction history
                    </p>
                </div>
            </div>

            {/* Tab Switcher - Standard Text */}
            <div className="flex p-1.5 bg-muted/50 rounded-[22px] mb-8 border border-border/50 shadow-inner">
                <button
                    onClick={() => setActiveTab('add')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px] font-black text-xs md:text-sm transition-all duration-300",
                        activeTab === 'add' ? "bg-white shadow-xl text-foreground scale-100" : "text-muted-foreground hover:text-foreground scale-95 opacity-70"
                    )}
                >
                    <Plus className="w-4 h-4" /> Add Money
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px] font-black text-xs md:text-sm transition-all duration-300",
                        activeTab === 'history' ? "bg-white shadow-xl text-foreground scale-100" : "text-muted-foreground hover:text-foreground scale-95 opacity-70"
                    )}
                >
                    <History className="w-4 h-4" /> Add History
                </button>
            </div>

            <div className="w-full">
                {activeTab === 'add' ? (
                    /* --- TAB: ADD MONEY --- */
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-left-4 duration-300">
                        <div className="bg-slate-50 p-8 md:p-12 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
                                    <Wallet className="w-7 h-7" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                                    {isLoadingBalance ? (
                                        <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
                                    ) : (
                                        <p className="text-4xl font-bold text-slate-900">৳ {currentBalance}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAddFunds} className="p-8 md:p-12 space-y-10">
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 ml-1">Top Up Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">৳</span>
                                    <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-14 pr-6 py-6 text-5xl font-bold bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none focus:border-secondary transition-all" required />
                                </div>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {presetAmounts.map((preset) => (
                                        <button key={preset} type="button" onClick={() => setAmount(preset.toString())} className={cn("px-6 py-2.5 rounded-xl font-bold text-sm transition-all border", Number(amount) === preset ? 'bg-secondary text-white border-secondary' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>+ ৳{preset}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 pl-1">Select Gateway</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['bkash', 'nagad', 'rocket', 'bank'].map((method) => (
                                        <label key={method} className={cn("flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all", paymentMethod === method ? 'border-secondary bg-secondary/5' : 'border-slate-100 bg-white hover:border-slate-200')}>
                                            <input type="radio" name="payment" value={method} className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} checked={paymentMethod === method} />
                                            <Smartphone className={cn("w-6 h-6", paymentMethod === method ? 'text-secondary' : 'text-slate-400')} />
                                            <span className="text-xs font-bold uppercase text-slate-700 capitalize">{method}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Sender Number</label>
                                    <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="017XXXXXXXX" className="w-full px-5 py-4 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Transaction ID</label>
                                    <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="TRX123456" className="w-full px-5 py-4 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all uppercase" required />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Payment Receipt</label>
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                    <p className="text-sm font-semibold text-slate-500">{attachment ? attachment.name : "Click to upload screenshot"}</p>
                                    <input type="file" className="hidden" onChange={(e) => e.target.files && setAttachment(e.target.files[0])} />
                                </label>
                            </div>

                            <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center gap-3 py-5 bg-secondary text-white rounded-2xl font-bold text-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="animate-spin w-7 h-7" /> : <><ShieldCheck className="w-6 h-6" /> Submit Request</>}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* --- TAB: HISTORY --- */
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300 min-h-[500px]">
                        <div className="bg-slate-50 p-8 md:p-12 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-900 text-white shadow-lg">
                                    <Activity className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction History</p>
                                    <p className="text-4xl font-bold text-slate-900">
                                        {transactions.length} <span className="text-lg font-medium text-slate-400 uppercase ml-2">Records</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-12 h-12 animate-spin text-secondary" />
                                    <p className="font-semibold text-slate-500">Fetching records...</p>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">No history found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {transactions.map((item) => (
                                        <div key={item.id} className="group bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-secondary transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-xl flex items-center justify-center shrink-0",
                                                    item.status === 'approved' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                                )}>
                                                    <Clock className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-2xl font-bold text-slate-900">৳{item.amount}</h3>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                                                            item.status === 'approved' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                                        )}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                                        {item.payment_method} <ArrowRight className="w-3 h-3 text-slate-300" /> <span>{item.number}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                                                <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 font-mono">
                                                    {item.Transaction_ID || "N/A"}
                                                </p>
                                                <p className="text-xs font-medium text-slate-400 mt-2">
                                                    {new Date(item.created_at).toLocaleDateString('en-GB')} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}