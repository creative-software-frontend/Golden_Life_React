'use client'

import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, UserIcon, Search, Menu, X, Bell, LayoutDashboard } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import useModalStore from '@/store/Store';
import { useTranslation } from 'react-i18next';
import LoginOptionsModal from '@/components/LoginoptionsModal';

const products = [
    { id: 1, name: 'Laptop', image: '/image/search/laptop.jpg' },
    { id: 2, name: 'Smartphone', image: '/image/search/smartphones.jpg' },
    { id: 3, name: 'Headphones', image: '/image/search/headphones.jpg' },
    { id: 4, name: 'Camera', image: '/image/search/camera.jpg' },
];

const Header: React.FC = () => {
    const { isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const cancelButtonRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [t, i18n] = useTranslation('global');
    const [isLoginOptionsModalOpen, setIsLoginOptionsModalOpen] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (searchText) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setSuggestions(filteredProducts);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchText]);

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

    const handleSearch = () => {
        if (searchText || image) {
            setShowSuggestions(false);
        } else {
            alert("Please enter text or select an image to search");
        }
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
        // FIXED: Header is now w-full and sticky to ensure it stretches across all devices
        <div className="w-full bg-white shadow-md border-b border-gray-200 z-40 sticky top-0">
            
            {/* =========================================
                1. DESKTOP HEADER (Large Screens)
               ========================================= */}
            <header className="hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-4xl mx-auto h-20 gap-8">
                
                {/* Search Bar Container */}
                <div className="flex-1 max-w-4xl relative">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder={t('header.search') || "Search products..."}
                            className="w-full pl-6 pr-28 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-default focus:ring-4 focus:ring-primary-default/10 text-lg transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 pr-2">
                            <label htmlFor="desktopImageInput" className="cursor-pointer">
                                <CameraIcon className="h-6 w-6 text-gray-400 hover:text-primary-default transition-colors" />
                                <input type="file" id="desktopImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <div className="h-6 w-[1.5px] bg-gray-300"></div>
                            <Search className="h-6 w-6 text-gray-500 cursor-pointer hover:text-primary-default" onClick={handleSearch} />
                        </div>
                    </div>

                    {/* Desktop Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {suggestions.map(p => (
                                <div key={p.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0 gap-4" onClick={() => setSearchText(p.name)}>
                                    <img src={p.image} className="w-12 h-12 rounded object-cover" alt="" />
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-6 shrink-0">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                        <button onClick={() => handleChangeLanguage('en')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${i18n.language === 'en' ? 'bg-white text-primary-default shadow-sm' : 'text-gray-500'}`}>EN</button>
                        <button onClick={() => handleChangeLanguage('bn')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${i18n.language === 'bn' ? 'bg-white text-primary-default shadow-sm' : 'text-gray-500'}`}>BN</button>
                    </div>

                    {/* FIXED: Removed Login button, added Dashboard Text */}
                    <Link 
                        to="/dashboard"
                        className="flex items-center gap-2 bg-primary-default text-white px-6 py-3 rounded-xl text-base font-black hover:bg-primary-dark shadow-lg shadow-primary-default/20 transition-all active:scale-95"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>{t('header.dashboard') || "Dashboard"}</span>
                    </Link>
                </div>
            </header>

            {/* =========================================
                2. MOBILE HEADER (Small Screens)
               ========================================= */}
            <div className="lg:hidden flex flex-col w-full bg-white">
                {/* Top Row: Menu & Profile */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-700">
                        <Menu className="h-7 w-7" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-lg text-[11px] font-black border border-gray-200">
                            <button onClick={() => handleChangeLanguage('en')} className={`px-3 py-1 rounded-md ${i18n.language === 'en' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>EN</button>
                            <button onClick={() => handleChangeLanguage('bn')} className={`px-3 py-1 rounded-md ${i18n.language === 'bn' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>BN</button>
                        </div>
                        {/* Mobile Dashboard Icon */}
                        <Link to="/dashboard" className="bg-primary-light/10 p-2.5 rounded-full text-primary-default border border-primary-default/20 active:scale-90 transition-transform">
                            <UserIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Full Width Search */}
                <div className="px-5 py-4 bg-white">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder={t('header.search')}
                            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-base font-medium shadow-inner focus:outline-none focus:bg-white focus:border-primary-default transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                             <CameraIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Modal Container (Kept for Logic) */}
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
                                    {/* Modal Content... */}
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