import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Clock, Plus, Minus, Receipt } from 'lucide-react';

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        try {
            const session = sessionStorage.getItem("student_session");
            return session ? JSON.parse(session).token : null;
        } catch (error) {
            console.error("Session parse error:", error);
            return null;
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.status === "success") {
                setTransactions(data.transactions || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getStatusBadge = (status) => {
        if (!status) return <span className="px-4 py-1.5 text-[10px] md:text-xs font-black text-white bg-[#10b981] rounded-full uppercase tracking-wider">Success</span>;
        const normalized = status.toLowerCase();
        if (normalized === 'completed' || normalized === 'success') {
            return <span className="px-4 py-1.5 text-[10px] md:text-xs font-black text-white bg-[#10b981] rounded-full uppercase tracking-wider">Success</span>;
        }
        if (normalized === 'pending') {
            return <span className="px-4 py-1.5 text-[10px] md:text-xs font-black text-white bg-[#fb923c] rounded-full uppercase tracking-wider">Pending</span>;
        }
        return <span className="px-4 py-1.5 text-[10px] md:text-xs font-black text-white bg-[#ef4444] rounded-full uppercase tracking-wider">{status}</span>;
    };

    return (
        /* UPDATED: Added max-w-4xl and mx-auto to center it */
        <div className="animate-in fade-in duration-300 w-full max-w-4xl mx-auto px-4 py-12 md:py-8  md:px-8">
            
            {/* Header Area */}
            <div className="flex flex-wrap items-center justify-start gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-base md:text-lg font-black text-slate-500 uppercase tracking-widest">
                    Transaction History
                </h2>
                <span className="bg-[#eef7f2] text-[#6cb28d] px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider shrink-0">
                    {transactions.length} Records Found
                </span>
            </div>

            <div className="w-full">
                {/* Desktop Headers */}
                <div className="hidden md:grid grid-cols-4 gap-4 pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest px-6">
                    <div>Details</div>
                    <div>Method</div>
                    <div>Status</div>
                    <div className="text-right">Timestamp</div>
                </div>

                <div className="space-y-4">
                    {isLoadingHistory ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#fb923c]" />
                            <p className="text-sm font-medium">Loading history...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No transactions found.
                        </div>
                    ) : (
                        transactions.map((tx, idx) => {
                            const isPositive = tx.type === 'add';
                            const isPurchase = tx.type === 'purchase';

                            return (
                                <div key={tx.id || idx} className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-4 gap-x-2 md:gap-4 p-4 md:py-5 md:px-6 border border-slate-100 rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow">
                                    
                                    {/* 1. Details */}
                                    <div className="order-1 flex items-center gap-3 md:gap-4">
                                        <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-500' : 'bg-[#fff6ef] text-[#fb923c]'}`}>
                                            {isPositive ? <Plus size={20} strokeWidth={3} /> : isPurchase ? <Receipt size={20} strokeWidth={2.5} /> : <Minus size={20} strokeWidth={3} />}
                                        </div>
                                        <div>
                                            <p className="text-[16px] md:text-[18px] font-black text-[#0f172a] leading-none mb-1 tracking-tight">
                                                {isPositive ? '+' : '-'}৳{Number(tx.amount || 0).toFixed(2)}
                                            </p>
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase truncate max-w-[100px] md:max-w-none">
                                                {tx.Transaction_ID || tx.invoice_number || 'No ID'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 3. Status (Swapped for Desktop Order) */}
                                    <div className="order-2 md:order-3 flex items-center justify-end md:justify-start w-full">
                                        {getStatusBadge(tx.status)}
                                    </div>

                                    {/* 2. Method & Type */}
                                    <div className="order-3 md:order-2 flex flex-col items-start w-full">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="bg-[#f1f5f9] text-[#334155] px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                                {tx.payment_method || 'Wallet'}
                                            </span>
                                            <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase">
                                                {tx.type} • {tx.number || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4. Timestamp */}
                                    <div className="order-4 flex flex-col items-end text-right w-full">
                                        <p className="text-[12px] md:text-[14px] font-black text-[#0f172a] mb-0.5">
                                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] md:text-[11px] font-semibold">
                                                {tx.created_at ? new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}