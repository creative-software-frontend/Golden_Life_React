import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, Wallet, Smartphone, ShieldCheck,
    Loader2, AlertCircle, History, Plus, Clock, Building2,
    HelpCircle, X
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
    // Updated translation hook based on your request
    const { t, i18n } = useTranslation('global'); 
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
    const [showGuideModal, setShowGuideModal] = useState(false); // Modal state

    const presetAmounts = [500, 1000, 2000, 5000];
    const paymentMethods = [
        { id: 'bkash', label: 'bKash', icon: <Smartphone className="w-6 h-6 mb-1" />, active: true },
        { id: 'nagad', label: 'Nagad', icon: <Smartphone className="w-6 h-6 mb-1" />, active: true },
        { id: 'rocket', label: 'Rocket', icon: <Smartphone className="w-6 h-6 mb-1" />, active: false },
        { id: 'bank', label: 'Bank', icon: <Building2 className="w-6 h-6 mb-1" />, active: false }
    ];

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

    // --- Dynamic Input Validation ---
    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        val = val.replace(/(?!^\+)[^\d]/g, '');

        let maxLength = 11; 
        if (val.startsWith('+')) {
            maxLength = 15; 
        } else if (val.startsWith('880')) {
            maxLength = 13; 
        }

        if (val.length > maxLength) {
            val = val.slice(0, maxLength);
        }

        setAccountNumber(val);
        if (error) setError(null);
    };

    // --- Form Submission Validation ---
    const validateForm = (): boolean => {
        setError(null);
        const numAmount = Number(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError(t('error_invalid_amount', "Please enter a valid amount."));
            return false;
        }

        if (paymentMethod !== 'bank') {
            const mobileRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
            if (!mobileRegex.test(accountNumber)) {
                setError(t('error_invalid_number', "Invalid sender number. Use format: 01XXXXXXXXX"));
                return false;
            }
        }

        if (trxId.trim().length < 6) {
            setError(t('error_invalid_trx', "Transaction ID seems too short (minimum 6 characters)."));
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
                setSuccess(data.message || t('success_request_submitted', "Request submitted successfully!"));
                setAmount(''); 
                setAccountNumber(''); 
                setTrxId(''); 
                setAttachment(null);
                fetchBalance(); 
                fetchHistory();
                setTimeout(() => setSuccess(null), 5000); 
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t('error_server', "Internal server error."));
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Modal Configuration Helpers ---
    const getGatewayConfig = () => {
        switch (paymentMethod) {
            case 'nagad':
                return {
                    name: 'Nagad',
                    bg: 'bg-[#f7931e]',
                    text: 'text-[#f7931e]',
                    border: 'border-[#f7931e]/20',
                    ussd: '*167#'
                };
            case 'bkash':
                return {
                    name: 'bKash',
                    bg: 'bg-[#e2136e]',
                    text: 'text-[#e2136e]',
                    border: 'border-[#e2136e]/20',
                    ussd: '*247#'
                };
            case 'bank':
                return {
                    name: 'Bank',
                    bg: 'bg-blue-600',
                    text: 'text-blue-600',
                    border: 'border-blue-200',
                    ussd: ''
                };
            default:
                return { name: paymentMethod, bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200', ussd: '' };
        }
    };

    const gatewayConfig = getGatewayConfig();

    const ussdSteps = [
        { id: 1, text: t('instruction_step_1', 'Dial USSD to start'), highlight: gatewayConfig.ussd },
        { id: 2, text: t('instruction_step_2', 'Press to select Payment'), highlight: '4 (Payment)' }, // Adjusted generally for bKash/Nagad
        { id: 3, text: t('instruction_step_3', 'Enter Merchant No'), highlight: '01XXXXXXXXX' },
        { id: 4, text: t('instruction_step_4', 'Enter Amount'), highlight: 'XXXX' },
        { id: 5, text: t('instruction_step_5', 'Enter Reference'), highlight: '1' },
        { id: 6, text: t('instruction_step_6', 'Enter Counter Number'), highlight: '1' },
        { id: 7, text: t('instruction_step_7', 'Enter PIN to confirm'), highlight: 'Your PIN' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('wallet_portal', 'Wallet Portal')}</h1>
                    <p className="text-slate-500">{t('wallet_subtitle', 'Securely top up your account balance')}</p>
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
                        {tab === 'add' ? t('tab_add_money', 'Add Money') : t('tab_history', 'History')}
                    </button>
                ))}
            </div>

          {activeTab === 'add' ? (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-8 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{t('current_balance', 'Balance')}</p>
                                    <p className="text-2xl font-bold text-slate-900">৳ {currentBalance}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAddFunds} className="p-8 space-y-8">
                            {/* Amount Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700">{t('enter_amount', 'Enter Amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">৳</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        placeholder="0.00" 
                                        className="w-full pl-12 pr-6 py-5 text-4xl font-bold bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all" 
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {presetAmounts.map((p) => (
                                        <button 
                                            key={p} 
                                            type="button" 
                                            onClick={() => setAmount(p.toString())} 
                                            className={cn(
                                                "px-4 py-2 rounded-xl border text-sm font-bold transition-all", 
                                                Number(amount) === p 
                                                    ? "bg-secondary text-white border-secondary" 
                                                    : "bg-white text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            + ৳{p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gateway Selection & Guide Button */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">{t('select_gateway', 'Select Gateway')}</label>
                                    
                                    {/* HOW TO PAY BUTTON */}
                                    <button 
                                        type="button" 
                                        onClick={() => setShowGuideModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        <HelpCircle className="w-4 h-4" /> 
                                        {t('how_to_pay', 'How to Pay?')}
                                    </button>
                                </div>

                                {/* UPDATED GATEWAY BUTTONS */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {paymentMethods.map((method) => {
                                        // Set specific brand colors for the icons and text
                                        let brandColorClass = "text-slate-400";
                                        if (method.id === 'bkash') brandColorClass = "text-[#e2136e]"; // bKash Pink
                                        if (method.id === 'nagad') brandColorClass = "text-[#ed1c24]"; // Nagad Red
                                        if (method.id === 'rocket') brandColorClass = "text-[#8c3494]"; // Rocket Purple
                                        if (method.id === 'bank') brandColorClass = "text-blue-600"; // Bank Blue

                                        return (
                                            <label
                                                key={method.id}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl border-2 transition-all uppercase text-[12px] font-black overflow-hidden bg-white",
                                                    !method.active
                                                        ? "opacity-50 cursor-not-allowed border-slate-100 text-slate-300"
                                                        : cn("cursor-pointer", brandColorClass),
                                                    paymentMethod === method.id && method.active
                                                        ? "border-green-600 bg-green-50/30" // Green active border from your screenshot
                                                        : "border-slate-100 hover:border-slate-200 shadow-sm"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    disabled={!method.active}
                                                    onChange={() => setPaymentMethod(method.id)}
                                                    checked={paymentMethod === method.id}
                                                />
                                                <div className="mb-1 transform scale-110">
                                                    {method.icon}
                                                </div>
                                                {method.label}
                                                
                                                {!method.active && (
                                                    <span className="absolute top-2 right-2 bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md text-[10px] tracking-normal normal-case font-bold">Soon</span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Input Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">
                                        {paymentMethod === 'bank' ? t('reference_account', 'Reference/Account') : t('sender_number', 'Sender Number')}
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={paymentMethod === 'bank' ? (e) => setAccountNumber(e.target.value) : handlePhoneInput}
                                        placeholder={paymentMethod === 'bank' ? t('account_no', "Account No") : "01XXXXXXXXX"}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('transaction_id', 'Transaction ID')}</label>
                                    <input
                                        type="text"
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        placeholder="TRX-XXXXXX"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none uppercase transition-all"
                                    />
                                </div>
                            </div>

                            {/* Feedback & Submit */}
                            <div className="space-y-4 pt-4">
                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-bounce">
                                        <ShieldCheck className="w-4 h-4" /> {success}
                                    </div>
                                )}

                                <button 
                                    disabled={isSubmitting} 
                                    type="submit" 
                                    className="w-full flex items-center justify-center gap-3 py-5 bg-secondary text-white rounded-2xl font-bold text-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : t('btn_submit_request', "Submit Top Up Request")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ): (
                /* History Tab */
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] w-full overflow-hidden">
                    <div className="flex items-center justify-between px-12 py-6 bg-slate-50/50 border-b border-slate-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                            {t('transaction_history', 'Transaction History')}
                            {!isLoadingHistory && (
                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px]">
                                    {transactions.length} {t('records_found', 'Records Found')}
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="hidden md:grid grid-cols-4 gap-4 px-12 py-4 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div>{t('table_col_details', 'Details')}</div>
                        <div className="text-center">{t('table_col_method', 'Method')}</div>
                        <div className="text-center">{t('table_col_status', 'Status')}</div>
                        <div className="text-right">{t('table_col_time', 'Timestamp')}</div>
                    </div>

                    {isLoadingHistory ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-secondary/40" />
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t('loading_records', 'Processing Records...')}</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <History className="w-12 h-12 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-sm">{t('no_records_found', 'No transaction records found')}</p>
                        </div>
                    ) : (
                        <div className="p-4 md:p-8 space-y-3">
                            {transactions.map((item) => (
                                <div
                                    key={item.id}
                                    className="group p-5 md:px-10 md:py-6 border border-slate-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 items-center gap-4 hover:border-secondary/30 hover:bg-slate-50/30 transition-all duration-300"
                                >
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

                                    <div className="flex flex-col md:items-center">
                                        <span className="text-[10px] font-black text-slate-700 uppercase px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                            {item.payment_method}
                                        </span>
                                        <p className="text-[11px] font-medium text-slate-500 mt-1">{item.number}</p>
                                    </div>

                                    <div className="flex md:justify-center">
                                        <span className={cn(
                                            "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all",
                                            item.status === 'approved' ? "bg-green-500 text-white" : "bg-orange-400 text-white"
                                        )}>
                                            {item.status}
                                        </span>
                                    </div>

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

            {/* --- INSTRUCTION MODAL --- */}
       {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        
                        <button 
                            onClick={() => setShowGuideModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* UPDATED: Added classes to hide the scrollbar across all browsers */}
                        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {paymentMethod === 'bank' ? (
                                <div className="p-5 md:p-6">
                                    <div className={cn("flex flex-col mb-6 -mx-5 md:-mx-6 -mt-5 md:-mt-6 p-6 text-white text-center shadow-sm", gatewayConfig.bg)}>
                                        <h3 className="font-bold text-xl mb-1">{t('how_to_pay_title', 'How to make the Payment')}</h3>
                                        <p className="text-xs text-blue-100 uppercase font-bold tracking-widest">{t('bank_transfer_guide', 'Bank Transfer Guide')}</p>
                                    </div>
                                    
                                    <div className="p-4 bg-blue-50 rounded-2xl space-y-4 text-sm mt-4 border border-blue-100">
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">{t('bank_name_label', 'Bank Name')}</p>
                                            <p className="font-bold text-blue-900 text-lg">{BANK_DETAILS.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">{t('bank_acc_num_label', 'Account Number')}</p>
                                            <p className="font-bold text-blue-900 text-lg">{BANK_DETAILS.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-black text-[10px] uppercase">{t('bank_acc_name_label', 'Account Name')}</p>
                                            <p className="font-bold text-blue-900">{BANK_DETAILS.accountName}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 italic mt-6 text-center">{t('bank_instruction_note', 'Please include your student ID in the transfer reference for faster approval.')}</p>
                                </div>
                            ) : (
                                <div className="p-5 md:p-6">
                                    <div className={cn("flex flex-col mb-6 -mx-5 md:-mx-6 -mt-5 md:-mt-6 p-6 text-white text-center shadow-sm rounded-t-3xl", gatewayConfig.bg)}>
                                        <h3 className="font-bold text-xl mb-1">{t('how_to_pay_title', 'How to make the Payment')}</h3>
                                        <p className="text-xs uppercase font-bold tracking-widest opacity-90">{gatewayConfig.name} {t('ussd_guide', 'USSD Guide')}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        {ussdSteps.map((step) => (
                                            <div key={step.id} className={cn(
                                                "relative border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50 border-slate-100",
                                                step.id === 7 ? "col-span-2" : "col-span-1"
                                            )}>
                                                <div className="absolute -top-3 -right-2 w-6 h-6 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded flex items-center justify-center text-[10px] shadow-sm">
                                                    {step.id}
                                                </div>
                                                
                                                <p className="text-[10px] font-medium text-slate-600 leading-tight mb-2 min-h-[24px]">
                                                    {step.text}
                                                </p>
                                                
                                                <div className="w-full bg-white border border-slate-200 rounded p-1.5 text-center shadow-inner overflow-hidden">
                                                    <span className={cn("font-bold text-xs tracking-tight truncate block", gatewayConfig.text)}>
                                                        {step.highlight}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium text-center">
                                        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                                        {t('payment_confirmation_note', 'You will receive a confirmation SMS after successful payment.')}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                             <button 
                                onClick={() => setShowGuideModal(false)}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                             >
                                 {t('btn_close', 'Close')}
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}