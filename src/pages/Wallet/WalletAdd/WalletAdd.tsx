import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
    ArrowLeft, Wallet, Smartphone, ShieldCheck, 
    Loader2, CheckCircle2, UploadCloud, AlertCircle, ArrowRight
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface WalletAddResponse {
    status: string;
    message: string;
    data?: any;
}

export default function WalletAdd() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Form State ---
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [trxId, setTrxId] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);
    
    // --- UI & Data State ---
    const [currentBalance, setCurrentBalance] = useState<string>('0.00');
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const presetAmounts: number[] = [500, 1000, 2000, 5000];

    // --- Auth Helper ---
    const getAuthToken = (): string | null => {
        const session = sessionStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    // --- 1. Fetch Current Balance ---
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
            console.error("Failed to fetch wallet balance:", error);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [baseURL]);

    // --- 2. Submit Handler ---
    const handleAddFunds = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const token = getAuthToken();
            const generatedInvoice = `INV-${new Date().getTime()}SZ`;

            const formData = new FormData();
            formData.append('type', 'add');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('Transaction_ID', trxId);
            formData.append('payment_method', paymentMethod);
            formData.append('invoiceNumber', generatedInvoice);
            
            if (attachment) {
                formData.append('attachment', attachment);
            }

            const response: AxiosResponse<WalletAddResponse> = await axios.post(
                `${baseURL}/api/transactions`, 
                formData, 
                {
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                }
            );

            if (response.data?.status === 'success' || response.data?.status === "true") {
                setSuccessMessage(response.data.message || "Transaction created successfully.");
                
                // Clear the form fields
                setAmount('');
                setAccountNumber('');
                setTrxId('');
                setAttachment(null);

                // Auto-refresh the balance
                await fetchBalance();
            } else {
                setErrorMessage(String(response.data?.message || "Something went wrong. Please try again."));
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            const responseData = axiosError.response?.data;
            
            let finalErrorMessage = "Failed to process transaction. Please try again.";

            if (responseData) {
                if (typeof responseData.message === 'string') {
                    finalErrorMessage = responseData.message;
                }
                
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
            setErrorMessage(String(finalErrorMessage));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- Header --- */}
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-background border border-border shadow-sm hover:bg-muted hover:border-border/80 text-muted-foreground hover:text-foreground transition-all"
                >
                    <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Top Up Wallet</h1>
                    <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                        Bank / Mobile <ArrowRight className="w-3 h-3" strokeWidth={3} /> Wallet
                    </p>
                </div>
            </div>

            {/* --- Main Content Card --- */}
            <div className="bg-background rounded-[24px] md:rounded-[32px] border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
                
                {/* Balance Header */}
                <div className="bg-gradient-to-br from-secondary/10 to-background p-5 md:p-8 border-b border-border/50 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4 md:gap-5">
                        <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-[16px] md:rounded-[20px] bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25">
                            <Wallet className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-0.5 md:mb-1">Available Balance</p>
                            
                            {/* Loader Logic */}
                            {isLoadingBalance ? (
                                <div className="h-7 md:h-9 w-28 md:w-36 bg-foreground/10 animate-pulse rounded-md mt-1"></div>
                            ) : (
                                <p className="text-2xl md:text-3xl font-black text-foreground tracking-tight animate-in fade-in duration-300">
                                    ৳ {currentBalance}
                                </p>
                            )}

                        </div>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-10 md:-mt-10"></div>
                </div>

                <form onSubmit={handleAddFunds} className="p-5 md:p-8 space-y-6 md:space-y-8">
                    
                    {/* Status Messages */}
                    {successMessage && (
                        <div className="flex items-center gap-3 p-3 md:p-4 bg-secondary/10 text-secondary rounded-xl md:rounded-2xl border border-secondary/20 animate-in fade-in zoom-in-95">
                            <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                            <p className="text-xs md:text-sm font-bold">{successMessage}</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="flex items-center gap-3 p-3 md:p-4 bg-destructive/10 text-destructive rounded-xl md:rounded-2xl border border-destructive/20 animate-in fade-in zoom-in-95">
                            <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                            <p className="text-xs md:text-sm font-bold">{errorMessage}</p>
                        </div>
                    )}

                    {/* Amount Input */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest px-1">Top Up Amount</label>
                        <div className="relative group">
                            <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black text-muted-foreground group-focus-within:text-foreground transition-colors">৳</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-11 pr-4 py-3.5 md:pl-14 md:pr-6 md:py-5 text-3xl md:text-4xl font-black bg-muted/50 border-2 border-transparent rounded-[20px] md:rounded-3xl focus:bg-background transition-all outline-none placeholder:text-muted-foreground/30 focus:border-secondary focus:ring-4 focus:ring-secondary/10 text-foreground"
                                required
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-2.5 pt-2">
                            {presetAmounts.map((preset) => {
                                const isSelected = Number(amount) === preset;
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setAmount(preset.toString())}
                                        className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-[14px] font-bold text-xs md:text-sm transition-all border-2 
                                            ${isSelected 
                                                ? 'bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20' 
                                                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50'
                                            }`}
                                    >
                                        + ৳{preset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment Gateway Selection */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Payment Gateway</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
                            {['bkash', 'nagad', 'rocket', 'bank'].map((method) => {
                                const isSelected = paymentMethod === method;
                                return (
                                    <label key={method} className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-secondary bg-secondary/10 shadow-sm' : 'border-border bg-background hover:bg-muted/50 hover:border-border/80'}`}>
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value={method} 
                                            className="hidden" 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)} 
                                            checked={isSelected} 
                                        />
                                        <Smartphone className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} strokeWidth={isSelected ? 2.5 : 2} />
                                        <span className={`text-[10px] md:text-xs font-bold capitalize ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{method}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Account/Mobile Number</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountNumber(e.target.value)}
                                placeholder="e.g. 017XXXXXXXX"
                                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40"
                                required
                            />
                        </div>
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</label>
                            <input
                                type="text"
                                value={trxId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrxId(e.target.value)}
                                placeholder="e.g. TRX123456"
                                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40 uppercase"
                                required
                            />
                        </div>
                    </div>

                    {/* File Upload Attachment */}
                    <div className="space-y-2 md:space-y-2.5">
                        <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Screenshot / Attachment</label>
                        <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-border rounded-xl md:rounded-2xl cursor-pointer bg-muted/30 hover:bg-muted/60 transition-colors group">
                            <div className="flex flex-col items-center justify-center pt-4 pb-5 md:pt-5 md:pb-6">
                                <UploadCloud className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2 md:mb-3" strokeWidth={2} />
                                <p className="text-xs md:text-sm font-bold text-muted-foreground px-4 text-center">
                                    {attachment ? <span className="text-secondary line-clamp-1">{attachment.name}</span> : "Click to upload transaction screenshot"}
                                </p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setAttachment(e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 md:pt-6">
                        <button 
                            type="submit"
                            disabled={!amount || !accountNumber || !trxId || isSubmitting}
                            className="w-full group flex items-center justify-center gap-2 md:gap-2.5 py-4 md:py-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl md:rounded-2xl font-black text-base md:text-lg tracking-wide shadow-xl shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                                    Submit Request {amount ? `৳${amount}` : ''}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}