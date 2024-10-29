import { MapPin, UserIcon } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import logo from '../../../../../public/image/logo/logo.jpg'

const Header: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const cancelButtonRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const menus = [
        { id: 'pharmacy', label: 'Pharmacy' },
        { id: 'fashion', label: 'Fashion' },
        { id: 'electronics', label: 'Electronics' },
        { id: 'beauty', label: 'Beauty' },
    ];

    return (
        <div>
            <header className="mx-4 -mt-7 flex items-center justify-between bg-gray-100 p-2 -ms-16">
                {/* Left Side - Menu Buttons */}
                <div className="flex items-center gap-2">
                    {menus.map((menu) => (
                        <button key={menu.id} className="px-2 py-2 border border-primary-default rounded bg-white text-gray-500">
                            {menu.label}
                        </button>
                    ))}
                </div>

                {/* Address Selector */}
                <div className="flex items-center border bg-primary-default rounded-full p-2 shadow">
                    <MapPin size={20} className="text-white" />
                    <select className="bg-primary-default transition outline-none text-white">
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Khulna">Khulna</option>
                    </select>
                </div>

                {/* Center - Hotline */}
                <div className="flex items-center text-lg font-semibold text-red-400">
                    Hotline: +1-800-555-1234
                </div>

                {/* Right Side - Login and Language Buttons */}
                <div className="flex items-center">
                    {/* Login Icon with Dropdown */}
                    <div className="relative z-10">
                        <button onClick={toggleDropdown} className="flex items-center bg-primary-default text-white px-3 py-1 border border-primary-default rounded-full">
                            <UserIcon className="h-6 w-4 mr-1" />
                        </button>
                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                                <ul>
                                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Profile</li>
                                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Settings</li>
                                    <li onClick={() => setIsModalOpen(true)} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                                        Login
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 mx-1 bg-primary-default border-gray-400 rounded-full">
                        <button className="text-white px-3 py-1">EN</button>
                        <div className="h-6 w-[1px] bg-white mx-2"></div>
                        <button className="text-white px-3 py-1">BN</button>
                    </div>
                </div>
            </header>

            {/* Login Modal */}
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
                                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                            <img
                                                className="mx-auto h-10 w-auto"
                                                src={logo}
                                                alt="Your Company"
                                            />
                                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                Sign in to your account
                                            </h2>
                                        </div>

                                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                            <form className="space-y-6" action="#" method="POST">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Email address
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            autoComplete="email"
                                                            required
                                                            className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Password
                                                        </label>
                                                        <div className="text-sm">
                                                            <a href="#" className="font-semibold text-primary-default hover:text-primary-default">
                                                                Forgot password?
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="current-password"
                                                            required
                                                            className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="flex w-full justify-center rounded-md bg-primary-default px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        Sign in
                                                    </button>
                                                </div>
                                            </form>

                                            {/* <p className="mt-10 text-center text-sm text-gray-500">
                                                Not a member?{' '}
                                                <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                                    Start a 14 day free trial
                                                </a>
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Close
                                        </button>
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
