'use client'

import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, MapPin, UserIcon, ArrowLeft, Search } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import useModalStore from '@/store/Store';
import logo from '../../../../public/image/logo/logo.jpg';
import { useTranslation } from 'react-i18next';

const products = [
    { id: 1, name: 'Laptop', image: '../../../../public/image/search/laptop.jpg' },
    { id: 2, name: 'Smartphone', image: '../../../../public/image/search/smartphones.jpg' },
    { id: 3, name: 'Headphones', image: '../../../../public/image/search/headphones.jpg' },
    { id: 4, name: 'Camera', image: '../../../../public/image/search/camera.jpg' },
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
    const [language] = useState<'en' | 'bn'>('en');
    const cancelButtonRef = useRef(null);
    const [value] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [t, i18n] = useTranslation('global')

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

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handlePhoneChange = (value: string | undefined) => {
        setPhone(value || "");
        setErrorMessage(null);
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

    const handleSubmit = () => {
        alert("Successfully logged in");
        closeLoginModal();
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrorMessage(null);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            console.log("Image selected:", file.name);
        } else {
            alert("Please select a valid image file");
        }
    };

    const handleSearch = () => {
        if (searchText || image) {
            console.log("Searching with:", { text: searchText, image: image?.name });
            setShowSuggestions(false);
        } else {
            alert("Please enter text or select an image to search");
        }
    };

    const handleSuggestionClick = (productName: string) => {
        setSearchText(productName);
        setShowSuggestions(false);
    };


    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language)

    }
    console.log(i18n.language); // Should log 'bn' when switched to Bangla


    return (
        <div className=''>
            <header className=" shadow md:w-[1040px] sm:w-full w-[370px] fixed top-3  -mt-7 sm:-mt-4 flex items-center justify-between bg-gray-50 p-2 z-10 rounded">
                <div className="relative flex items-center gap-2 w-full p-2">
                    <input
                        type="text"
                        placeholder={t('header.search')}
                        className="w-full pr-20 py-2 px-4 text-gray-800 rounded-md bg-gray-100 border-primary-default border"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                    />
                    <label htmlFor="imageInput" className="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer flex">
                        <CameraIcon className="h-6 w-6 text-gray-500" />
                        <div className="h-5 w-[1px] bg-gray-400 mx-2"></div>
                    </label>

                    <button
                        className="absolute right-7 top-1/2 -translate-y-1/2"
                        onClick={handleSearch}
                    >
                        <Search className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                {imagePreview && (
                    <div className="absolute top-full left-0 mt-2">
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    </div>
                )}

                {showSuggestions && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                        {suggestions.length > 0 ? (
                            suggestions.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSuggestionClick(product.name)}
                                >
                                    <img src={product.image} alt={product.name} className="w-10 h-10 mr-2 object-cover" />
                                    <span>{product.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">No products found</div>
                        )}
                    </div>
                )}

                <div className="flex items-center">
                    <div className=" items-center border bg-primary-default rounded-full p-2 shadow hidden sm:hidden">
                        <MapPin size={20} className="text-white" />
                        <select className="bg-primary-default transition outline-none text-white hidden sm:hidden">
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Khulna">Khulna</option>
                        </select>
                    </div>

                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center bg-primary-default text-white px-3 py-1 border border-primary-default rounded-full">
                            <UserIcon className="h-6 w-4" />
                            <span className="ml-1 hidden sm:inline">{t('header.login')}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                                <button onClick={openLoginModal} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.login')}</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.profile')}</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.settings')}</button>
                                <Link to='/admin' className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.dashboard')}</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 mx-1 bg-primary-default border-gray-400 rounded-full">
                        <button
                            className={`px-3 py-1 ${language === 'en' ? 'text-white' : 'text-gray-500'}`}
                            onClick={() => handleChangeLanguage('en')}
                        >
                            EN
                        </button>
                        <div className="h-6 w-[1px] bg-white mx-2"></div>
                        <button
                            className={`px-3 py-1 ${language === 'bn' ? 'text-white' : 'text-gray-500'}`}
                            onClick={() => handleChangeLanguage('bn')}
                        >
                            BN
                        </button>
                    </div>
                </div>
            </header>

            <Transition.Root show={isLoginModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={closeLoginModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                        onClick={closeLoginModal}
                                    >
                                        {t('header.close')}
                                    </button>

                                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                            <img className="mx-auto h-15 w-auto" src={logo} alt="Your Company" />
                                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                {step === 1 && t('header.enterPhoneNumber')}
                                                {step === 2 && t('header.enterOTP')}
                                                {step === 3 && t('header.verifyDetails')}
                                            </h2>
                                        </div>

                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form className="space-y-6">
                                                {step === 1 && (
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                                            {t('header.phoneNumber')}
                                                        </label>
                                                        <div className="flex flex-col items-start w-full">
                                                            <PhoneInput
                                                                id="phone"
                                                                name="phone"
                                                                value={value}
                                                                onChange={handlePhoneChange}
                                                                required
                                                                defaultCountry="BD"
                                                                placeholder={t('header.phoneNumber')}
                                                                className="p-4 block w-full rounded-md mb-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (phone.length < 10) {
                                                                    setErrorMessage("Please enter a valid phone number");
                                                                } else {
                                                                    setErrorMessage(null);
                                                                    setStep(2);
                                                                }
                                                            }}
                                                            className="flex w-full justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            {t('header.next')}
                                                        </button>
                                                    </div>
                                                )}

                                                {step === 2 && (
                                                    <div>
                                                        <div className="mt-2 flex justify-center">
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {otp.map((value, index) => (
                                                                    <input
                                                                        key={index}
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={(e) => handleOtpChange(e, index)}
                                                                        maxLength={1}
                                                                        className="text-center border p-2 rounded-md"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-center mt-4 gap-4">
                                                            <button
                                                                type="button"
                                                                className="text-gray-500 hover:underline"
                                                                onClick={handleBack}
                                                            >
                                                                <ArrowLeft className="h-5 w-5 inline" /> {t('header.back')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleVerify}
                                                                className="rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                                                            >
                                                                {t('header.verify')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div>
                                                        <h3 className="text-center text-lg font-semibold text-gray-700">{t('header.verificationComplete')}</h3>
                                                        <p className="text-center text-gray-600 mt-4">{t('header.loggedIn')}</p>
                                                        <button
                                                            type="button"
                                                            onClick={handleSubmit}
                                                            className="mt-4 w-full flex justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            {t('header.finish')}
                                                        </button>
                                                    </div>
                                                )}

                                                {errorMessage && (
                                                    <div className="mt-2 text-red-600 text-sm text-center">
                                                        {errorMessage}
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default Header;

