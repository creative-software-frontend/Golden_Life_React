import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Search, Bell, MapPin, User, ChevronDown, ArrowLeft, 
    Wallet, PlusCircle, Send, Download, Landmark, Camera
} from 'lucide-react';
import ImageUploadModal from '@/components/shared/ImageUploadModal';

// --- CUSTOM ICONS ---
const MenuFoldLeftIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="9 7 4 12 9 17" />
    </svg>
);

const MenuFoldRightIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="15 7 20 12 15 17" />
    </svg>
);

const Navbar: React.FC<{ toggleSidebar: () => void; isOpen: boolean }> = ({ toggleSidebar, isOpen }) => {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    
    // --- State for Wallet ---
    const [isLoading, setIsLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState('0.00');
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false); 
    
    const walletRefDesktop = useRef<HTMLDivElement>(null);
    const walletRefMobile = useRef<HTMLDivElement>(null);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- Fetch Wallet Balance ---
    useEffect(() => {
        const fetchBalance = async () => {
            setIsLoading(true);
            try {
                const session = sessionStorage.getItem("student_session");
                const token = session ? JSON.parse(session).token : null;
                
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`${baseURL}/api/wallet-balance`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const fetchedBalance = response.data?.data?.balance || response.data?.balance || 0;
                setWalletBalance(Number(fetchedBalance).toFixed(2));
            } catch (error) {
                console.error("Failed to fetch wallet balance:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [baseURL]);

    // --- Close Menu on Click Outside ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                walletRefDesktop.current && !walletRefDesktop.current.contains(event.target as Node) &&
                walletRefMobile.current && !walletRefMobile.current.contains(event.target as Node)
            ) {
                setIsWalletMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- REUSABLE WALLET COMPONENT ---
    const renderWalletDropdown = (isMobile: boolean, ref: React.RefObject<HTMLDivElement>) => (
        <div className={`relative z-50 ${isMobile ? 'w-full' : ''}`} ref={ref}>
            
            {/* Wallet Button trigger */}
            <div 
                onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                className={`flex items-center justify-between bg-background border border-border shadow-sm hover:shadow-md hover:border-secondary/50 transition-all cursor-pointer select-none ${isMobile ? 'px-4 py-3 rounded-[16px] w-full' : 'px-4 py-2 rounded-2xl gap-3'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center rounded-xl transition-all duration-300 ${isLoading ? "bg-muted animate-pulse" : "bg-secondary/10 text-secondary"} ${isMobile ? 'h-10 w-10' : 'h-10 w-10'} ${isWalletMenuOpen ? 'bg-secondary text-secondary-foreground' : ''}`}>
                        {!isLoading && <Wallet className={isMobile ? 'h-5 w-5' : 'h-5 w-5'} strokeWidth={2.5} />}
                    </div>
                    
                    <div className="flex flex-col pr-1 text-left">
                        <span className={`font-black text-muted-foreground uppercase leading-none tracking-tight ${isMobile ? 'text-[11px]' : 'text-[11px]'}`}>My Balance</span>
                        <div className="mt-1 h-4 flex items-center">
                            {isLoading ? (
                                <div className={`bg-muted animate-pulse rounded-md ${isMobile ? 'h-3.5 w-16' : 'h-4 w-20'}`} />
                            ) : (
                                <span className={`font-black text-foreground tracking-tight leading-none ${isMobile ? 'text-[16px]' : 'text-[16px]'}`}>৳{walletBalance}</span>
                            )}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${isWalletMenuOpen ? 'rotate-180' : ''} ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </div>

            {/* Dropdown Options */}
            <div className={`absolute mt-2 bg-background rounded-2xl shadow-xl border border-border transition-all duration-200 overflow-hidden ${isWalletMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'} ${isMobile ? 'top-full left-0 w-full' : 'top-full left-0 w-56'}`}>
                <div className="p-2 flex flex-col gap-1">
                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/add" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors ${isMobile ? 'py-3 text-sm' : 'py-2.5 text-[13px]'}`}>
                        <PlusCircle className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-emerald-500`} /> Add Money
                    </Link>
                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/receive" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors ${isMobile ? 'py-3 text-sm' : 'py-2.5 text-[13px]'}`}>
                        <Download className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-purple-500`} /> Receive Money
                    </Link>
                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/send" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors ${isMobile ? 'py-3 text-sm' : 'py-2.5 text-[13px]'}`}>
                        <Send className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-blue-500`} /> Send Money
                    </Link>
                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/withdraw" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors ${isMobile ? 'py-3 text-sm' : 'py-2.5 text-[13px]'}`}>
                        <Landmark className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-orange-500`} /> Withdraw Money
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <header className="w-full bg-background border-b border-border sticky top-0 z-30 transition-colors duration-300 flex flex-col">
            
            {/* --- TABLET/MOBILE SEARCH OVERLAY --- */}
            {isMobileSearchOpen && (
                <div className={`absolute top-0 left-0 right-0 h-16 sm:h-20 bg-background z-50 flex items-center px-4 ${isOpen ? 'xl:hidden' : 'lg:hidden'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                    <button
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="p-2 mr-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                        aria-label="Close search"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all shadow-sm">
                        <Search size={22} className="text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search orders, customers..."
                            className="bg-transparent border-none focus:ring-0 text-base text-foreground ml-3 w-full placeholder:text-muted-foreground outline-none min-w-0"
                        />
                    </div>
                </div>
            )}

            {/* === ROW 1: ALWAYS VISIBLE === */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 w-full">
                
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSidebar();
                        }}
                        aria-label="Toggle Sidebar"
                        className="relative z-40 p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                        {isOpen ? <MenuFoldLeftIcon size={24} /> : <MenuFoldRightIcon size={24} />}
                    </button>

                    {/* DESKTOP WALLET (Hides automatically if search is open on tablets) */}
                    {!isMobileSearchOpen && (
                        <div className="hidden md:block">
                            {renderWalletDropdown(false, walletRefDesktop)}
                        </div>
                    )}

                    {/* DESKTOP SEARCH BOX */}
                    <div className={`ml-4 xl:ml-8 hidden ${isOpen ? 'xl:flex' : 'lg:flex'} flex-1 items-center bg-muted/50 border border-border rounded-xl px-3 lg:px-4 py-2 lg:py-2.5 w-full max-w-2xl min-w-[200px] focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all shadow-sm`}>
                        <Search size={20} className="text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search orders, customers..."
                            className="bg-transparent border-none focus:ring-0 text-sm lg:text-base text-foreground ml-2 lg:ml-3 w-full min-w-0 placeholder:text-muted-foreground outline-none text-ellipsis"
                        />
                        <button
                            onClick={() => setIsImageSearchOpen(true)}
                            className="p-1.5 hover:bg-yellow-50 rounded-lg transition ml-1"
                            title="Search by image"
                        >
                            <Camera size={20} className="text-gray-700 hover:text-yellow-600 transition" />
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE ICONS */}
                <div className="flex items-center gap-2 sm:gap-4 xl:gap-6 ml-2 sm:ml-4 flex-shrink-0">
                    <button
                        onClick={() => setIsMobileSearchOpen(true)}
                        className={`${isOpen ? 'xl:hidden' : 'lg:hidden'} p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors`}
                    >
                        <Search size={22} />
                    </button>

                    {/* Mobile/Tablet Search Overlay with Camera */}
                    {isMobileSearchOpen && (
                        <div className={`absolute top-0 left-0 right-0 h-16 sm:h-20 bg-background z-50 flex items-center px-4 ${isOpen ? 'xl:hidden' : 'lg:hidden'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                            <button
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="p-2 mr-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                                aria-label="Close search"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all shadow-sm">
                                <Search size={22} className="text-muted-foreground flex-shrink-0" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search orders, customers..."
                                    className="bg-transparent border-none focus:ring-0 text-base text-foreground ml-3 w-full placeholder:text-muted-foreground outline-none min-w-0"
                                />
                                <button
                                    onClick={() => setIsImageSearchOpen(true)}
                                    className="p-1.5 hover:bg-yellow-50 rounded-lg transition ml-2"
                                    title="Search by image"
                                >
                                    <Camera size={20} className="text-gray-700 hover:text-yellow-600 transition" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground text-sm xl:text-base cursor-pointer hover:text-foreground transition-colors">
                        <MapPin size={20} />
                        <span>Dhaka</span>
                    </div>

                    <button className="relative p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors flex-shrink-0">
                        <Bell className="w-[22px] h-[22px] sm:w-6 sm:h-6" />
                        <span className="absolute top-[7px] right-[7px] sm:top-[7px] sm:right-[7px] w-2.5 h-2.5 sm:w-3 sm:h-3 bg-destructive rounded-full border-[2px] border-background"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-5 border-l border-border cursor-pointer group flex-shrink-0">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm xl:text-base font-bold text-foreground leading-none">Farhana Jaman</p>
                            <p className="text-[11px] xl:text-xs text-secondary font-bold mt-1 sm:mt-1.5 uppercase tracking-wider">Available</p>
                        </div>
                        <div className="bg-secondary/10 p-2 sm:p-2.5 rounded-full text-secondary group-hover:bg-secondary/20 transition-colors">
                            <User className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
                        </div>
                        <ChevronDown size={18} className="text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                    </div>
                </div>
            </div>

            {/* === ROW 2: MOBILE WALLET (Hides entirely when search is open) === */}
            {!isMobileSearchOpen && (
                <div className="md:hidden flex items-center px-4 pb-4 w-full">
                    {renderWalletDropdown(true, walletRefMobile)}
                </div>
            )}

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
            />

        </header>
    );
};

export default Navbar;