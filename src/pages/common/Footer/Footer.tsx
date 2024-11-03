import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Globe, Phone, Youtube, Linkedin } from 'lucide-react';

import playstore from '../../../../public/Play Store.png'
import paywith from '../../../../public/Pay-With.png'

const Footer = () => {
    return (
        <footer >
            <div className=" mx-6  bg-gray-300 -ms-16 pt-4">
                <div className="pt-6 grid grid-cols-1 md:grid-cols-4 ">
                    <div className=''>
                        <h3 className="font-bold text-xl  mb-4 text-gray-600 ms-8">About Golden Life</h3>
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
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900">Help</Link></li>
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
                            <Link to="#" className="">
                                <img src={playstore} alt='Play Store' className="object-cover h-15 w-full  text-gray-600" />
                            </Link>
                            {/* <Link to="#" className="flex-1">
                                <img src={appstore} alt='App Store' className="object-cover h-10 w-full  text-gray-600" />
                            </Link> */}
                        </div>
                        <div className="text-start">
                            <div className="flex items-center justify-end">
                                <Phone className="h-4 w-4 text-gray-800 mr-2" /> {/* Phone icon */}
                                <p className="text-2xl text-gray-500 font-bold">0000000000000</p>
                            </div>
                            <p className="text-gray-500 text-lg ">or support@goldenlife.com</p>
                        </div>

                    </div>
                </div>
                <div className="">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <div className='flex justify-start items-center'>
                            <h3 className="font-bold text-lg mb-2  text-gray-500 ms-16">Payment Methods</h3>
                            <img src={paywith} alt="paywith" className="h-1/2 w-2/3 object-cover" />

                            {/* <div className="">
                                <img src={paywith} alt="paywith" className="h-1/2 w-1/2 object-cover" />
                                <img src={paypal} alt="Visa" className="h-8 w-8 object-cover" />
                                <img src={visa} alt="Visa" className="h-8 w-8 object-cover" />
                                <img src={bkash} alt="Visa" className="h-8 w-8 object-cover" />

                            </div> */}
                        </div>

                    </div>
                    <div className="border-0 -mb-8  border-gray-300  bg-white py-2">

                        <div className="mt-4 flex flex-wrap justify-between items-center mx-2">
                            <p className="text-gray-600 text-start">&copy; 2024 Golden Life Shopping.</p>
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

                                <div className="flex items-center gap-1 mx-1 bg-primary-default border-gray-400 rounded-full">
                                    <button className="text-gray-500 px-3 py-1">EN</button>
                                    <div className="h-6 w-[1px] bg-white mx-2"></div>
                                    <button className="text-white px-3 py-1">BN</button>
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
