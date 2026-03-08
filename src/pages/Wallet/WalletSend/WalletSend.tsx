import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Wallet, Send, User, 
    CheckCircle2, AlertCircle, KeyRound, ArrowRight 
} from 'lucide-react';

// Import our newly separated modals
import SetPinModal from '../SetPinModal/SetPinModal';
import ConfirmTransferModal from '../ConfirmTransferModal/ConfirmTransferModal';

export default function WalletSend() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Transfer Form State ---
    const [amount, setAmount] = useState<string>('');
    const [receiverType, setReceiverType] = useState<string>('student');
    const [affiliateId, setAffiliateId] = useState<string>('');
    
    // --- UI & Modals State ---
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true); // <-- Added loading state
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showSetPinModal, setShowSetPinModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const presetAmounts: number[] = [100, 500, 1000, 2000];

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

    // --- 2. Call it when the page first loads ---
    useEffect(() => {
        fetchBalance();
    }, [baseURL]);

    // --- Modal Callback Handlers ---
    const handleSuccess = (message: string) => {
        setErrorMessage('');
        setSuccessMessage(message);
    };

    // --- 3. Call fetchBalance() again after a successful transfer ---
    const handleTransferSuccess = async (message: string) => {
        setErrorMessage('');
        setSuccessMessage(message);
        
        // This automatically fetches the fresh balance from the database!
        await fetchBalance(); 
        
        setAmount('');
        setAffiliateId('');
    };

    const handleError = (message: string) => {
        setSuccessMessage('');
        setErrorMessage(message);
    };

    const triggerPinConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        if (Number(amount) > currentBalance) {
            setErrorMessage("Insufficient funds!");
            return;
        }
        setShowConfirmModal(true);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- Modals --- */}
            <SetPinModal 
                isOpen={showSetPinModal} 
                onClose={() => setShowSetPinModal(false)}
                onSuccess={handleSuccess}
                onError={handleError}
                baseURL={baseURL}
                token={getAuthToken()}
            />

            <ConfirmTransferModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onSuccess={(msg) => handleTransferSuccess(msg)}
                onError={handleError}
                amount={amount}
                receiverType={receiverType}
                affiliateId={affiliateId}
                baseURL={baseURL}
                token={getAuthToken()}
            />

            {/* --- Main Page Header --- */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-background border border-border shadow-sm hover:bg-muted hover:border-border/80 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <div>
                        {/* Responsive Font Size for Header */}
                        <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Send Money</h1>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                            Wallet <ArrowRight className="w-3 h-3" strokeWidth={3} /> Wallet
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowSetPinModal(true)} 
                    className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                >
                    <KeyRound className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} /> Set PIN
                </button>
            </div>

            {/* --- Main Content Card --- */}
            <div className="bg-background rounded-[24px] md:rounded-[32px] border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
                
                {/* Modern Balance Header */}
                <div className="bg-gradient-to-br from-secondary/10 to-background p-5 md:p-8 border-b border-border/50 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4 md:gap-5">
                        {/* Responsive Icon Box */}
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
                    {/* Decorative background shape */}
                    <div className="absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-10 md:-mt-10"></div>
                </div>

                {/* Form Section */}
                <form onSubmit={triggerPinConfirmation} className="p-5 md:p-8 space-y-6 md:space-y-8">
                    
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

                    {/* Receiver Type & ID (Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Receiver Type</label>
                            <select 
                                value={receiverType} 
                                onChange={(e) => setReceiverType(e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base bg-muted/50 border-2 border-transparent focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 rounded-xl md:rounded-2xl outline-none font-bold text-foreground cursor-pointer transition-all appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8l5 5 5-5'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                            >
                                <option value="student">Student</option>
                                <option value="vendor">Vendor</option>
                                <option value="affiliate">Affiliate</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:space-y-2.5">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Receiver ID</label>
                            <div className="relative">
                                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground"><User className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /></span>
                                <input 
                                    type="text" 
                                    value={affiliateId} 
                                    onChange={(e) => setAffiliateId(e.target.value)} 
                                    placeholder="e.g. 20259940" 
                                    className="w-full pl-11 pr-4 py-3 md:pl-14 md:pr-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount Section */}
                    <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Transfer Amount</label>
                            {Number(amount) > currentBalance && !isLoadingBalance && <span className="text-[10px] md:text-xs font-black text-destructive animate-pulse">Exceeds Balance</span>}
                        </div>
                        <div className="relative group">
                            {/* Responsive Currency Symbol */}
                            <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black text-muted-foreground group-focus-within:text-foreground transition-colors">৳</span>
                            {/* Responsive Big Input */}
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="0.00" 
                                className={`w-full pl-11 pr-4 py-3.5 md:pl-14 md:pr-6 md:py-5 text-3xl md:text-4xl font-black bg-muted/50 border-2 rounded-[20px] md:rounded-3xl focus:bg-background transition-all outline-none placeholder:text-muted-foreground/30 ${Number(amount) > currentBalance && !isLoadingBalance ? 'border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10 text-destructive' : 'border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 text-foreground'}`} 
                                required 
                            />
                        </div>
                        
                        {/* Modernized Quick Chips - Scaled for Mobile */}
                        <div className="flex flex-wrap gap-2 md:gap-2.5 pt-2 md:pt-3">
                            {presetAmounts.map((preset) => {
                                const isSelected = Number(amount) === preset;
                                return (
                                    <button 
                                        key={preset} 
                                        type="button" 
                                        onClick={() => setAmount(preset.toString())} 
                                        disabled={isLoadingBalance || preset > currentBalance} 
                                        className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-[14px] font-bold text-xs md:text-sm transition-all border-2 
                                            ${isSelected 
                                                ? 'bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20' 
                                                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50'
                                            } 
                                            disabled:opacity-40 disabled:hover:bg-background disabled:hover:border-border disabled:cursor-not-allowed`}
                                    >
                                        ৳{preset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button Container */}
                    <div className="pt-4 md:pt-6">
                        <button 
                            type="submit" 
                            disabled={!amount || !affiliateId || isLoadingBalance || Number(amount) > currentBalance} 
                            className="w-full group flex items-center justify-center gap-2 md:gap-2.5 py-4 md:py-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl md:rounded-2xl font-black text-base md:text-lg tracking-wide shadow-xl shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            <Send className="w-5 h-5 md:w-[22px] md:h-[22px] group-hover:translate-x-1 transition-transform" strokeWidth={2.5} /> 
                            Proceed to Verify 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}