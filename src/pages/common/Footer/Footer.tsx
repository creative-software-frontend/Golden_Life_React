import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Youtube, Linkedin } from 'lucide-react';
import playstore from '../../../../public/image/footer/Play Store.png';
import paywith from '../../../../public/image/footer/Pay-With.png';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Footer = () => {
    const { t, i18n } = useTranslation("global"); // Initialize translation hook
    const [value, setValue] = useState();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-300 pt-4 md:max-w-[1040px] sm:w-full w-[370px]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                <div>
                    <h3 className="font-bold text-xl mb-4 text-gray-600">{t('footer.aboutGoldenLife')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/help/our-story" className="text-gray-600 hover:text-gray-900">{t('footer.ourStory')}</Link></li>
                        <li><Link to="#" className="text-gray-600 hover:text-gray-900">{t('footer.team')}</Link></li>
                        <li><Link to="/help/privacy-policy" className="text-gray-600 hover:text-gray-900">{t('footer.privacyPolicy')}</Link></li>
                        <li><Link to="/help/terms" className="text-gray-600 hover:text-gray-900">{t('footer.termsOfUse')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-4 text-gray-600">{t('footer.customerService')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/help/contact" className="text-gray-600 hover:text-gray-900">{t('footer.contactUs')}</Link></li>
                        <li><Link to="/help" className="text-gray-600 hover:text-gray-900">{t('footer.faq')}</Link></li>
                        <li><Link to="/help" className="text-gray-600 hover:text-gray-900">{t('footer.help')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-4 text-gray-600">{t('footer.forBusiness')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="#" className="text-gray-600 hover:text-gray-900">{t('footer.corporate')}</Link></li>
                    </ul>
                </div>
                <div className="space-y-3 px-2">
                    <div className="flex flex-col items-start w-full">
                        <PhoneInput
                            placeholder={t('footer.phoneNumber')}
                            value={value}
                            onChange={setValue}
                            defaultCountry="BD"
                            international
                            className="w-full px-2 py-2 border border-gray-400 rounded-lg bg-white PhoneInputInput:focus"
                        />
                        <button className="bg-primary-default w-full text-white px-3 py-2 mt-2 rounded-lg">
                            {t('footer.getApp')}
                        </button>
                    </div>
                    <div className="flex justify-between gap-3 p-2">
                        <Link to="#">
                            <img src={playstore} alt="Play Store" className="object-cover h-15 w-auto" />
                        </Link>
                    </div>
                    <div className="text-start">
                        <div className="flex items-center justify-end">
                            <Phone className="h-4 w-4 text-gray-800 mr-2" />
                            <p className="text-2xl text-gray-500 font-bold">0000000000000</p>
                        </div>
                        <p className="text-gray-500 text-lg">or support@goldenlife.com</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap justify-between items-center mb-4 px-4">
                    <div className='flex items-center'>
                        <h3 className="font-bold text-lg mb-2 text-gray-500">{t('footer.paymentMethods')}</h3>
                        <img src={paywith} alt="paywith" className="h-auto w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] object-cover" />
                    </div>
                </div>
                <div className="border-0 -mb-8 border-gray-300 bg-white py-2">
                    <div className="flex flex-wrap justify-between items-center mx-2 px-4">
                        <p className="text-gray-600 text-start">{t('copyright', { year: currentYear })}</p>
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
                            <div className="flex items-center gap-1 mx-1">
                                <button
                                    onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')}
                                    className="text-gray-800"
                                >
                                    {i18n.language === 'en' ? 'BN' : 'EN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
