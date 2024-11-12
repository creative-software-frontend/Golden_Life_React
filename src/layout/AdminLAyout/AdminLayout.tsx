import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../../../public/image/logo/logo.jpg'
import { Bike, LayoutDashboard, UserIcon, Users, Settings } from 'lucide-react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [current] = useState(true)

    return (
        <div className="flex min-h-screen  max-w-7xl bg-slate-100 text-primaryWhite ">
            {/* Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>

                                {/* Small Screen Sidebar */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4 ring-1 ring-gray-200/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <img className="h-8 w-auto" src={Logo} alt="Your Company" />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul role="list" className="-mx-2 space-y-1">
                                                    <Link
                                                        to="/admin/overview"
                                                        className={classNames(
                                                            current
                                                                ? 'bg-gray-200 text-gray-900'
                                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 ease-in-out',
                                                            'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
                                                        )}
                                                    >
                                                        <LayoutDashboard
                                                            className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-blue-600 transition-colors duration-200 ease-in-out"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 ease-in-out">
                                                            Overview
                                                        </span>
                                                    </Link>
                                                    <Link
                                                        to="/admin/merchants"
                                                        className={classNames(
                                                            current
                                                                ? 'bg-gray-200 text-gray-900'
                                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 ease-in-out',
                                                            'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
                                                        )}
                                                    >
                                                        <Users
                                                            className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-green-600 transition-colors duration-200 ease-in-out"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="text-gray-700 group-hover:text-green-600 transition-colors duration-200 ease-in-out">
                                                            Merchants
                                                        </span>
                                                    </Link>
                                                </ul>
                                            </li>
                                            <li className="-mx-6 mt-auto">
                                                <a
                                                    href="#"
                                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200"
                                                >
                                                    <UserIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                                                    <span className="sr-only">Your profile</span>
                                                    <span aria-hidden="true">Dilaur Hos</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* For large screens */}
            <div className="hidden lg:flex lg:flex-col lg:w-[25%] lg:bg-white border-r border-gray-200">
                <div className="flex h-16 shrink-0 items-center p-2">
                    <img className="h-12 w-full  ovject-cover" src={Logo} alt="Your Company" />
                </div>
                <nav className="flex flex-1 flex-col  ">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list">
                                <NavLink
                                    to="/admin/overview"
                                    className={({ isActive }) =>
                                        classNames(
                                            isActive
                                                ? 'bg-gray-200 text-gray-900'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 ease-in-out',
                                            'group flex items-center gap-x-3 rounded-md p-2  text-sm font-semibold',
                                        )
                                    }
                                >
                                    <LayoutDashboard
                                        className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-blue-600 transition-colors duration-200 ease-in-out "
                                        aria-hidden="true"
                                    />
                                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 ease-in-out">
                                        Overview
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/admin/merchants"
                                    className={({ isActive }) =>
                                        classNames(
                                            isActive
                                                ? 'bg-gray-200 text-gray-900'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 ease-in-out',
                                            'group flex items-center gap-x-3 rounded-md p-2 pl-2 text-sm font-semibold',
                                        )
                                    }
                                >
                                    <Users
                                        className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-green-600 transition-colors duration-200 ease-in-out"
                                        aria-hidden="true"
                                    />
                                    <span className="text-gray-700 group-hover:text-green-600 transition-colors duration-200 ease-in-out">
                                        Merchants
                                    </span>
                                </NavLink>
                            </ul>
                        </li>

                        <li className="-mx-6 mt-auto">
                            <a
                                href="#"
                                className="pl-12 flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200"
                            >
                                <UserIcon className="h-5 w-5 text-blue-500" />
                                <span className="sr-only">Your profile</span>
                                <span aria-hidden="true">Dilaur Hos</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className=" w-screen">
                <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                    </button>
                </div>

                {/* Outlet for rendering nested routes */}
                <main className="flex flex-1 overflow-y-auto ">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
