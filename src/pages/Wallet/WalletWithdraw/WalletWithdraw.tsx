import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { 
    ArrowLeft, Wallet, Landmark, Smartphone, Lock, 
    UploadCloud, CheckCircle2, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';

export default function WalletWithdraw() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Form State ---
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);
    
    // --- UI & Data State ---
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true); // <-- Added loading state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const presetAmounts: number[] = [500, 1000, 2000, 5000];

    const getAuthToken = (): string | null => {
        const session = sessionStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    // --- 1. Fetch Current Balance ---
    const fetchBalance = async () => {
        setIsLoadingBalance(true); // <-- Turn on loader
        try {
            const token = getAuthToken();
            if (!token) return;
            const response = await axios.get(`${baseURL}/api/wallet-balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedBalance = response.data?.data?.balance || response.data?.balance || 0;
            setCurrentBalance(Number(fetchedBalance));
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error);
        } finally {
            setIsLoadingBalance(false); // <-- Turn off loader
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [baseURL]);

    // --- 2. Submit Handler ---
    const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (Number(amount) > currentBalance) {
            setErrorMessage("Insufficient funds for this withdrawal.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = getAuthToken();
            
            const formData = new FormData();
            formData.append('type', 'withdraw');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('payment_method', paymentMethod);
            formData.append('password', password);
            
            if (attachment) {
                formData.append('attachment', attachment);
            }

            const response = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) }
            });

            if (response.data?.status === 'success' || response.data?.status === true) {
                setSuccessMessage(response.data?.message || "Withdrawal request submitted successfully!");
                
                // Clear the form
                setAmount('');
                setAccountNumber('');
                setPassword('');
                setAttachment(null);
                
                // Refresh balance dynamically (this will trigger the loader automatically!)
                await fetchBalance();
            } else {
                setErrorMessage(String(response.data?.message || "Withdrawal failed. Please check your details."));
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            const responseData = axiosError.response?.data;
            
            let finalErrorMessage = "Failed to process withdrawal. Please try again.";

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
                    <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Withdraw Funds</h1>
                    <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                        Wallet <ArrowRight className="w-3 h-3" strokeWidth={3} /> Bank / Mobile
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
                            
                            {/* --- Conditionally Render Loader or Balance --- */}
                            {isLoadingBalance ? (
                                <div className="h-7 md:h-9 w-28 md:w-36 bg-foreground/10 animate-pulse rounded-md mt-1"></div>
                            ) : (
                                <p className="text-2xl md:text-3xl font-black text-foreground tracking-tight animate-in fade-in duration-300">
                                    ৳ {currentBalance.toFixed(2)}
                                </p>
                            )}

                        </div>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-10 md:-mt-10"></div>
                </div>

                <form onSubmit={handleWithdraw} className="p-5 md:p-8 space-y-6 md:space-y-8">
                    
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

                    {/* Amount Section */}
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Withdraw Amount</label>
                            {Number(amount) > currentBalance && !isLoadingBalance && <span className="text-[10px] md:text-xs font-black text-destructive animate-pulse">Exceeds Balance</span>}
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black text-muted-foreground group-focus-within:text-foreground transition-colors">৳</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="0.00" 
                                className={`w-full pl-11 pr-4 py-3.5 md:pl-14 md:pr-6 md:py-5 text-3xl md:text-4xl font-black bg-muted/50 border-2 rounded-[20px] md:rounded-3xl focus:bg-background transition-all outline-none placeholder:text-muted-foreground/30 ${Number(amount) > currentBalance && !isLoadingBalance ? 'border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10 text-destructive' : 'border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 text-foreground'}`} 
                                required 
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-2.5 pt-2">
                            {presetAmounts.map((preset) => {
                                const isSelected = Number(amount) === preset;
                                return (
                                    <button 
                                        key={preset} type="button" onClick={() => setAmount(preset.toString())} 
                                        disabled={isLoadingBalance || preset > currentBalance} 
                                        className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-[14px] font-bold text-xs md:text-sm transition-all border-2 
                                            ${isSelected ? 'bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20' : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50'} 
                                            disabled:opacity-40 disabled:hover:bg-background disabled:hover:border-border disabled:cursor-not-allowed`}
                                    >
                                        ৳{preset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Withdraw To</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
                            {['bkash', 'nagad', 'rocket', 'bank'].map((method) => {
                                const isSelected = paymentMethod === method;
                                return (
                                    <label key={method} className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-secondary bg-secondary/10 shadow-sm' : 'border-border bg-background hover:bg-muted/50 hover:border-border/80'}`}>
                                        <input type="radio" name="payment" value={method} className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} checked={isSelected} />
                                        {method === 'bank' ? <Landmark className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} strokeWidth={isSelected ? 2.5 : 2} /> : <Smartphone className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} strokeWidth={isSelected ? 2.5 : 2} />}
                                        <span className={`text-[10px] md:text-xs font-bold capitalize ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{method}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Account Details & Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Account Number</label>
                            <div className="relative">
                                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground"><Smartphone className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /></span>
                                <input 
                                    type="text" 
                                    value={accountNumber} 
                                    onChange={(e) => setAccountNumber(e.target.value)} 
                                    placeholder="e.g. 017XXXXXXXX" 
                                    className="w-full pl-11 pr-4 py-3 md:pl-14 md:pr-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Account Password</label>
                            <div className="relative">
                                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /></span>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter your password" 
                                    className="w-full pl-11 pr-4 py-3 md:pl-14 md:pr-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Optional File Upload */}
                    <div className="space-y-2 md:space-y-2.5">
                        <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Attachment (Optional)</label>
                        <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-border rounded-xl md:rounded-2xl cursor-pointer bg-muted/30 hover:bg-muted/60 transition-colors group">
                            <div className="flex flex-col items-center justify-center pt-4 pb-5 md:pt-5 md:pb-6">
                                <UploadCloud className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2 md:mb-3" strokeWidth={2} />
                                <p className="text-xs md:text-sm font-bold text-muted-foreground px-4 text-center">
                                    {attachment ? <span className="text-secondary line-clamp-1">{attachment.name}</span> : "Click to upload attachment"}
                                </p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setAttachment(e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 md:pt-6">
                        {/* Replaced inline styles with md:py-[18px] for fully responsive padding */}
                        <button 
                            type="submit" 
                            disabled={!amount || !accountNumber || !password || isLoadingBalance || Number(amount) > currentBalance || isSubmitting} 
                            className="w-full group flex items-center justify-center gap-2 md:gap-2.5 py-4 md:py-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl md:rounded-2xl font-black text-base md:text-lg tracking-wide shadow-xl shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                            ) : (
                                <>
                                    <Landmark className="w-5 h-5 md:w-[22px] md:h-[22px] group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} /> 
                                    Submit Withdrawal Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}