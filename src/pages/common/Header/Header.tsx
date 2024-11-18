import { CameraIcon, MapPin, UserIcon, ArrowLeft, Search } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import logo from '../../../../public/image/logo/logo.jpg';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const cancelButtonRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
    };

    const handleVerify = () => {
        setStep(3);
    };

    const handleSubmit = () => {
        alert("Successfully logged in");
        setIsModalOpen(false);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
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
            // Implement your search logic here
        } else {
            alert("Please enter text or select an image to search");
        }
    };

    return (
        <div>
            <header className="shadow md:w-[1040px] fixed top-6 -mt-7 flex items-center justify-between bg-gray-50 p-2 z-10 rounded">
                <div className="relative flex items-center gap-2 w-full p-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pr-20 py-2 px-4 text-gray-800 rounded-md bg-gray-100 border-primary-default border"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                    />
                    <label htmlFor="imageInput" className="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer">
                        <CameraIcon className="h-6 w-6 text-gray-500" />
                    </label>
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={handleSearch}
                    >
                        <Search className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                {imagePreview && (
                    <div className="absolute top-full left-0 mt-2">
                        <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    </div>
                )}

                <div className="flex items-center">
                    <div className="flex items-center border bg-primary-default rounded-full p-2 shadow">
                        <MapPin size={20} className="text-white" />
                        <select className="bg-primary-default transition outline-none text-white">
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Khulna">Khulna</option>
                        </select>
                    </div>

                    {/* User Icon with Dropdown */}
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center bg-primary-default text-white px-3 py-1 border border-primary-default rounded-full">
                            <UserIcon className="h-6 w-4 mr-1" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                                <button onClick={() => setIsModalOpen(true)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">login</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                                <Link to='/admin' className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 mx-1 bg-primary-default border-gray-400 rounded-full">
                        <button className="text-gray-500 px-3 py-1">EN</button>
                        <div className="h-6 w-[1px] bg-white mx-2"></div>
                        <button className="text-white px-3 py-1">BN</button>
                    </div>
                </div>
            </header>

            <Transition.Root show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsModalOpen}>
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
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close
                                    </button>

                                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                            <img className="mx-auto h-15 w-auto" src={logo} alt="Your Company" />
                                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                {step === 1 && "Enter your phone number"}
                                                {step === 2 && "Enter OTP"}
                                                {step === 3 && "Verify your details"}
                                            </h2>
                                        </div>

                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form className="space-y-6">
                                                {step === 1 && (
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Phone Number
                                                        </label>
                                                        <div className="mt-2 mb-4">
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="tel"
                                                                value={phone}
                                                                onChange={handlePhoneChange}
                                                                required
                                                                placeholder="Enter your phone number"
                                                                className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStep(2)}
                                                            className="flex w-full justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            Next
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
                                                                <ArrowLeft className="h-5 w-5 inline" /> Back
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleSubmit}
                                                                className="rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                                                            >
                                                                Verify
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div>
                                                        <h3 className="text-center text-lg font-semibold text-gray-700">Verification Complete!</h3>
                                                        <p className="text-center text-gray-600 mt-4">You are now logged in.</p>
                                                        <button
                                                            type="button"
                                                            onClick={handleSubmit}
                                                            className="mt-4 w-full flex justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            Finish
                                                        </button>
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