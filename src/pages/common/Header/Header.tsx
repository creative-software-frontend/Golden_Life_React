'use client'

import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, UserIcon, Search, Menu, X, LayoutDashboard, Loader2, Wallet } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import useModalStore from '@/store/Store';
import { useTranslation } from 'react-i18next';
import LoginOptionsModal from '@/components/LoginoptionsModal';
import axios from 'axios';
import { toast } from 'react-toastify'; // Added react-toastify import

const Header: React.FC = () => {
    const { isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const navigate = useNavigate();

    // Config: Dynamic Base URL from Environment Variables
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // Auth & UI States
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const cancelButtonRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [t, i18n] = useTranslation('global');
    const [isLoginOptionsModalOpen, setIsLoginOptionsModalOpen] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    // --- SEARCH STATES ---
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Split refs for Desktop and Mobile so clicking outside works properly
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const [walletBalance, setWalletBalance] = React.useState<string | null>(null);

    const [isLoading, setIsLoading] = React.useState(true); // Consolidating into one loading state

    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            if (new Date().getTime() > parsedSession.expiry) {
                localStorage.removeItem("student_session");
                return null;
            }
            return parsedSession.token;
        } catch (e) { return null; }
    };
React.useEffect(() => {
    const fetchWalletBalance = async () => {
        // Set loading to true at the start of every fetch
        setIsLoading(true); 

        try {
            const token = getAuthToken(); 
            const response = await axios.get(`${baseURL}/api/wallet-balance`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            // Corrected Path: response.data.data.balance based on your API structure
            if (response.data?.success && response.data?.data) {
                const rawBalance = response.data.data.balance;
                setWalletBalance(parseFloat(rawBalance).toFixed(2));
            } else {
                setWalletBalance("0.00");
            }
        } catch (error) {
            console.error("Wallet Balance Fetch Failed:", error);
            setWalletBalance("0.00");
        } finally {
            // This ensures the skeleton stops pulsing regardless of success or error
            setIsLoading(false); 
        }
    };

    fetchWalletBalance();
}, [baseURL]);

    // Inside your useEffect
 
    // Handle clicks outside the search dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(target);
            const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);

            if (isOutsideDesktop && isOutsideMobile) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- SEARCH API EFFECT WITH DEBOUNCE ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchText.trim().length > 0) {
                setIsSearching(true);
                try {
                    const response = await axios.get(`${baseURL}/api/products/search?keyword=${searchText}`);
                    const results = response.data?.products || [];
                    setSuggestions(results);
                } catch (error) {
                    console.error("Search API Error:", error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchText, baseURL]);

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    }

    const handlePhoneChange = (value: string | undefined) => {
        const newValue = value || "";
        setPhone(newValue);
        if (newValue.length !== 11) {
            setErrorMessage("Phone number must be exactly 11 digits.");
            setIsButtonDisabled(true);
        } else {
            setErrorMessage(null);
            setIsButtonDisabled(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        setErrorMessage(null);
    };

    const handleVerify = () => {
        if (otp.join("").length !== 4) {
            setErrorMessage("Please enter a valid 4-digit OTP");
        } else {
            setErrorMessage(null);
            setStep(3);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- UPDATED: Modern Search Handler ---
    const handleSearch = () => {
        if (searchText.trim()) {
            const query = searchText.trim();
            setShowSuggestions(false);
            setSearchText('');
            navigate(`/dashboard?q=${encodeURIComponent(query)}`);
        } else {
            toast.warning("Please enter text to search", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "light",
            });
        }
    };

    const getProductTitle = (product: any) => {
        if (i18n.language === 'bn' && product.product_title_bangla) {
            return product.product_title_bangla;
        }
        return product.product_title_english || product.name || 'Unknown Product';
    };

    // --- UPDATED: Select Suggestion Handler ---
    const handleSelectSuggestion = () => {
        setShowSuggestions(false);
        setSearchText('');
    };

    const handlePhoneLogin = () => {
        setLoginMethod('phone');
        setIsLoginOptionsModalOpen(false);
        openLoginModal();
    };

    const handleEmailLogin = () => {
        setLoginMethod('email');
        setIsLoginOptionsModalOpen(false);
        openLoginModal();
    };

    return (
        <div className="w-full bg-white shadow-md border-b border-gray-200 z-40 sticky top-0">

            {/* =========================================
                1. DESKTOP HEADER (Large Screens)
               ========================================= */}
            <header className="hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-5xl mx-auto h-20 gap-8">
                <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:border-green-100 transition-all group cursor-pointer">
                    {/* Icon Container */}
                    <div className={`flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300 ${isLoading ? "bg-slate-100 animate-pulse" : "bg-green-50 text-[#5ca367] group-hover:bg-[#5ca367] group-hover:text-white"
                        }`}>
                        {!isLoading && <Wallet className="h-5 w-5" />}
                    </div>

                    <div className="flex flex-col pr-2">
                        {/* Label */}
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none tracking-tight">
                            My Balance
                        </span>

                        {/* Dynamic Balance or Loading Skeleton */}
                        <div className="mt-1.5 h-4 flex items-center">
                            {isLoading ? (
                                /* The Loader: A pulsing bar that mimics the size of the balance */
                                <div className="h-4 w-16 bg-slate-100 animate-pulse rounded-md" />
                            ) : (
                                /* The Actual Balance */
                                <span className="text-[16px] font-black text-slate-900 tracking-tight leading-none">
                                    ৳{walletBalance}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-1 max-w-4xl relative" ref={desktopSearchRef}>
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder={t('header.search') || "Search products..."}
                            className="w-full pl-6 pr-28 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-default focus:ring-4 focus:ring-primary-default/10 text-lg transition-all"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => searchText.trim() && setShowSuggestions(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 pr-2">
                            {isSearching && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                            <label htmlFor="desktopImageInput" className="cursor-pointer">
                                <CameraIcon className="h-6 w-6 text-gray-400 hover:text-primary-default transition-colors" />
                                <input type="file" id="desktopImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <div className="h-6 w-[1.5px] bg-gray-300"></div>
                            <Search className="h-6 w-6 text-gray-500 cursor-pointer hover:text-primary-default" onClick={handleSearch} />
                        </div>
                    </div>

                    {/* Desktop Suggestions */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map(p => {
                                    const productTitle = getProductTitle(p);
                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/dashboard?q=${encodeURIComponent(productTitle)}`}
                                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0 gap-4 transition-colors"
                                            onClick={handleSelectSuggestion}
                                        >
                                            <img
                                                src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder-image.jpg'}
                                                className="w-12 h-12 rounded object-cover border border-gray-100"
                                                alt={productTitle}
                                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50'}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 line-clamp-1">{productTitle}</span>
                                                {p.offer_price && <span className="text-sm font-bold text-primary-default">৳{p.offer_price}</span>}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => handleChangeLanguage('en')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'en' ? 'bg-white text-primary-default shadow-sm' : 'text-gray-500'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleChangeLanguage('bn')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'bn' ? 'bg-white text-primary-default shadow-sm' : 'text-gray-500'}`}
                        >
                            BN
                        </button>
                    </div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 bg-primary-default text-white px-6 py-3 rounded-xl text-base font-black hover:bg-green-600 shadow-lg shadow-primary-default/20 transition-all active:scale-95"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>{t('header.dashboard') || "Dashboard"}</span>
                    </Link>
                </div>
            </header>

            {/* =========================================
                2. MOBILE HEADER (Small Screens)
               ========================================= */}
            <div className="lg:hidden flex flex-col w-full bg-white" ref={mobileSearchRef}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-700">
                        <Menu className="h-7 w-7" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-lg text-[11px] font-black border border-gray-200">
                            <button onClick={() => handleChangeLanguage('en')} className={`px-3 py-1 rounded-md ${i18n.language === 'en' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>EN</button>
                            <button onClick={() => handleChangeLanguage('bn')} className={`px-3 py-1 rounded-md ${i18n.language === 'bn' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>BN</button>
                        </div>
                        <Link to="/dashboard" className="bg-primary-light/10 p-2.5 rounded-full text-primary-default border border-primary-default/20 active:scale-90 transition-transform">
                            <UserIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>

                <div className="px-5 py-4 bg-white relative">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder={t('header.search')}
                            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-base font-medium shadow-inner focus:outline-none focus:bg-white focus:border-primary-default transition-all"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => searchText.trim() && setShowSuggestions(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isSearching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                            <CameraIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>

                    {/* Mobile Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-5 right-5 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map(p => {
                                    const productTitle = getProductTitle(p);
                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/dashboard?q=${encodeURIComponent(productTitle)}`}
                                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 gap-3 transition-colors"
                                            onClick={handleSelectSuggestion}
                                        >
                                            <img
                                                src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder-image.jpg'}
                                                className="w-10 h-10 rounded object-cover border border-gray-100"
                                                alt={productTitle}
                                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40'}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 text-sm line-clamp-1">{productTitle}</span>
                                                {p.offer_price && <span className="text-xs font-bold text-primary-default">৳{p.offer_price}</span>}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Transition.Root show={isLoginModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={closeLoginModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all text-center text-gray-900">
                                    <button onClick={closeLoginModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400"><X className="h-6 w-6" /></button>
                                    <h3 className="text-2xl font-black mb-8">{step === 1 ? t('header.enterPhoneNumber') : t('header.enterOTP')}</h3>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <LoginOptionsModal
                isOpen={isLoginOptionsModalOpen}
                onClose={() => setIsLoginOptionsModalOpen(false)}
                onPhoneLogin={handlePhoneLogin}
                onEmailLogin={handleEmailLogin}
            />
        </div>
    );
};

export default Header;