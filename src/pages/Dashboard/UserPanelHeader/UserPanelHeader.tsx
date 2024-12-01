import { NavLink, useNavigate } from 'react-router-dom'
import { Moon, Sun, ChevronDown, UserRound } from 'lucide-react'
import promise from '../../../../public/image/logo/logo.jpg'
import { useState, useEffect } from 'react'
import { Dialog, Disclosure } from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from '@heroicons/react/20/solid'

const products = [
    {
        name: 'Analytics',
        description: 'Get a better understanding of your traffic',
        href: '#',
        icon: ChartPieIcon,
    },
    {
        name: 'Engagement',
        description: 'Speak directly to your customers',
        href: '#',
        icon: CursorArrowRaysIcon,
    },
    {
        name: 'Security',
        description: 'Your customers’ data will be safe and secure',
        href: '#',
        icon: FingerPrintIcon,
    },
    {
        name: 'Integrations',
        description: 'Connect with third-party tools',
        href: '#',
        icon: SquaresPlusIcon,
    },
    {
        name: 'Automations',
        description: 'Build strategic funnels that will convert',
        href: '#',
        icon: ArrowPathIcon,
    },
]
const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function AdminHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode')
        return savedMode ? JSON.parse(savedMode) : false
    })

    // useEffect(() => {
    //     if (darkMode) {
    //         document.documentElement.classList.add('dark')
    //     } else {
    //         document.documentElement.classList.remove('dark')
    //     }
    //     localStorage.setItem('darkMode', JSON.stringify(darkMode))
    // }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }
    // Logout function
    // const handleLogout = () => {
    //   // Clear authentication state
    //   localStorage.removeItem('isAuthenticated') // Clear any authentication data
    //   navigate('/') // Redirect to the home page or login page
    // }
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={promise}
                        alt="Courier Delivery Limited"
                        className="h-9 w-full object-cover"
                    />

                    {/* Navigation links */}
                    <nav className="ml-10 hidden md:flex space-x-8">
                        <NavLink
                            to="/merchant"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-gray-900 dark:text-white font-medium border-b-4 border-red-500 pb-2'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/merchant/deliveries"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-gray-900 dark:text-white font-medium border-b-4 border-red-500 pb-2'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }
                        >
                            Deliveries
                        </NavLink>
                        <NavLink
                            to="/merchant/invoices"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-gray-900 dark:text-white font-medium border-b-4 border-red-500 pb-2'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }
                        >
                            Invoices
                        </NavLink>
                        <NavLink
                            to="/merchant/store"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-gray-900 dark:text-white font-medium border-b-4 border-red-500 pb-2'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }
                        >
                            Store
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    {/* New Delivery Button  */}
                    <button
                        onClick={() => navigate('/neworder')}
                        className="bg-primary-default hidden lg:block text-white px-4 py-2 rounded-md md:flex items-center"
                    >
                        New order
                    </button>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleDarkMode}
                        className="bg-gray-300 dark:bg-gray-600 rounded-full p-2 text-black-500 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Profile Dropdown */}

                    <div className="relative sm:display: none">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center focus:outline-none"
                        >
                            <div className=" hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-white to-green-500 text-white hover:from-green-300 hover:to-green-600">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <span className=" hidden lg:block ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dilouar Hos
                            </span>
                            <ChevronDown className="hidden lg:block ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Your Profile
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Settings
                                </NavLink>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('isAuthenticated')
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                    {/* <div className="relative hidden lg:flex items-center">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-white to-green-500 text-white hover:from-green-300 hover:to-green-600">
                <UserRound className="h-5 w-5" />
              </div>
              <span className="ml-2 text-gray-900 dark:text-white">
                Dilaur Hos
              </span>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-8 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Your Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Settings
                </NavLink>
                <button
                  onClick={() => {
                    localStorage.removeItem("isAuthenticated");
                  }}
                  to="/"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Sign out
                </button>
              </div>
            )}
          </div> */}

                    {/* Mobile Menu Dialog */}
                    <Dialog
                        as="div"
                        className="lg:hidden"
                        open={mobileMenuOpen}
                        onClose={setMobileMenuOpen}
                    >
                        <div className="fixed inset-0 z-10" />
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto object-cover"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <Disclosure as="div" className="-mx-3">
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
                                                        Product
                                                        <ChevronDownIcon
                                                            className={classNames(
                                                                open ? 'rotate-180' : '',
                                                                'h-5 w-5 flex-none',
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="mt-2 space-y-2">
                                                        {[...products, ...callsToAction].map((item) => (
                                                            <Disclosure.Button
                                                                key={item.name}
                                                                as="a"
                                                                href={item.href}
                                                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                            >
                                                                {item.name}
                                                            </Disclosure.Button>
                                                        ))}
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                        <a
                                            href="#"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Features
                                        </a>
                                        <a
                                            href="#"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Marketplace
                                        </a>
                                        <a
                                            href="#"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Company
                                        </a>
                                    </div>
                                    <div className="py-6">
                                        <a
                                            href="#"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Log in
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                </div>
            </div>
        </header>
    )
}
