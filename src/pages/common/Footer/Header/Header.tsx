import { CameraIcon, MapPin, UserIcon, ArrowLeft } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import logo from '../../../../../public/image/logo/logo.jpg';

const Header: React.FC = () => {
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

    return (
        <div>
            <header className="shadow md:w-[1040px] fixed top-6 -mt-7 flex items-center justify-between bg-gray-50 p-2 z-10 rounded">
                <div className="relative flex items-center gap-2 w-full p-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pr-10 py-1 px-4 text-gray-800 rounded-md bg-gray-100 border-primary-default border"
                    />
                    <CameraIcon className="absolute right-3 h-7 w-7 m-2 text-gray-500" />
                </div>

                <div className="flex items-center">
                    <div className="flex items-center border bg-primary-default rounded-full p-2 shadow">
                        <MapPin size={20} className="text-white" />
                        <select className="bg-primary-default transition outline-none text-white">
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Khulna">Khulna</option>
                        </select>
                    </div>
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center bg-primary-default text-white px-3 py-1 border border-primary-default rounded-full">
                            <UserIcon className="h-6 w-4 mr-1" onClick={() => setIsModalOpen(true)} />
                        </button>
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
                                            <form className="space-y-6" action="#" method="POST">
                                                {step > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={handleBack}
                                                        className="flex items-center text-gray-500 mb-4"
                                                    >
                                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                                        Back
                                                    </button>
                                                )}

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
                                                        <label htmlFor="otp" className="block text-sm font-medium leading-6 text-primary-light">
                                                            OTP
                                                        </label>
                                                        <div className="mt-2 grid grid-cols-4 gap-2">
                                                            {otp.map((value, index) => (
                                                                <input
                                                                    key={index}
                                                                    type="text"
                                                                    maxLength={1}
                                                                    value={value}
                                                                    onChange={(e) => handleOtpChange(e, index)}
                                                                    className="w-full p-4 text-center rounded-md border-0 py-1.5 text-primary-light shadow-sm ring-1 ring-inset ring-primary-light placeholder:text-primary-light focus:ring-2 focus:ring-inset focus:ring-primary-light sm:text-sm sm:leading-6 mb-4"
                                                                />
                                                            ))}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleVerify}
                                                            className="flex w-full justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                                                        >
                                                            Verify
                                                        </button>
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={handleSubmit}
                                                            className="flex w-full justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                                                        >
                                                            Complete Login
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
