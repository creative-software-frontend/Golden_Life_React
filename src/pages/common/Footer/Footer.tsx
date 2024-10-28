import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Globe, CreditCard, Download, Phone, Youtube, Linkedin } from 'lucide-react';
import mastercard from '../../../../public/image/Mastercard-logo.svg'
import paypal from '../../../../public/image/paypal.png'
import visa from '../../../../public/image/visa.png'
import bkash from '../../../../public/image/bkash2.png'
import playstore from '../../../../public/image/playstore.png'
import appstore from '../../../../public/image/appstore.jpg'

const Footer = () => {
    return (
        <footer className=" pt-12">
            <div className=" mx-4 bg-gray-300">
                <div className="pt-6 grid grid-cols-1 md:grid-cols-4 ">
                    <div className=''>
                        <h3 className="font-bold text-xl  mb-4 text-gray-600">About Golden Life</h3>
                        <ul className="space-y-2 text-start ms-16">
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-start">Our Story</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Team</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Terms of Use</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl  mb-4 text-gray-600 -ms-2">Customer Service</h3>
                        <ul className="space-y-2  text-start ms-12">
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">FAQ</Link></li>
                        </ul>
                    </div>
                    <div >
                        <h3 className="font-bold text-xl  mb-4 text-gray-600 -ms-4">For Business</h3>
                        <ul className="space-y-2  text-start ms-16">
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Corporate</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3 px-2  ">
                        <div className="flex items-center">
                            <div className="flex w-full py-1 border-primary-default border rounded-lg bg-white">
                                <input
                                    type="text"
                                    placeholder="+88"
                                    className="  px-3 py-2 w-full focus:outline-none"
                                />
                                <button className="bg-primary-default  text-white px-2 mr-1 text-nowrap rounded-lg">
                                    Get app
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between gap-3  p-2">
                            <Link to="#" className="flex-1">
                                <img src={playstore} alt='Play Store' className="object-cover h-10 w-full object-cover text-gray-600" />
                            </Link>
                            <Link to="#" className="flex-1">
                                <img src={appstore} alt='App Store' className="object-cover h-10 w-full object-cover text-gray-600" />
                            </Link>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end">
                                <Phone className="h-4 w-4 text-gray-600 mr-2" /> {/* Phone icon */}
                                <p className="text-2xl text-gray-500 font-bold">0000000000000</p>
                            </div>
                            <p className="text-gray-500 text-lg">or support@goldenlife.com</p>
                        </div>

                    </div>
                </div>
                <div className="">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <div className='flex justify-evenly'>
                            <h3 className="font-bold text-lg mb-2  text-gray-500 ms-16">Payment Methods</h3>
                            <div className="flex space-x-4 ml-2">
                                <img src={mastercard} alt="Visa" className="h-8 w-8 object-cover" />
                                <img src={paypal} alt="Visa" className="h-8 w-8 object-cover" />
                                <img src={visa} alt="Visa" className="h-8 w-8 object-cover" />
                                <img src={bkash} alt="Visa" className="h-8 w-8 object-cover" />

                            </div>
                        </div>

                    </div>
                    <div className="border border-gray-300 shadow bg-white py-2">

                        <div className=" mt-4 flex flex-wrap justify-between items-center mx-2">
                            <p className="text-gray-600 ms-16">&copy; 2024 Golden Life Shopping.</p>
                            <div className="flex space-x-4">
                                <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Linkedin size={20} className="text-gray-600" />
                                </Link>
                                <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Youtube size={20} className="text-gray-600" />
                                </Link>
                                <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Facebook size={20} className="text-gray-600" />
                                </Link>
                                <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Twitter size={20} className="text-gray-600" />
                                </Link>
                                <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Instagram size={20} className="text-gray-600" />
                                </Link>
                             
                                <div className="flex items-center space-x-1 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
                                    <Globe size={20} className="text-gray-600" />
                                    <span className="text-gray-600">English (EN)</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
