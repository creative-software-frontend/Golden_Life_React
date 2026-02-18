import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Youtube, Linkedin, ChevronRight } from 'lucide-react';
import playstore from '../../../../public/image/footer/Play Store.png';
import paywith from '../../../../public/image/footer/Pay-With.png';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation("global");
    const [value, setValue] = useState();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 pt-16 mt-8 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* About Section */}
                <div>
                    <h3 className="font-bold text-lg mb-6 text-gray-800 uppercase tracking-wider">{t('footer.aboutGoldenLife')}</h3>
                    <ul className="space-y-3">
                        <li><Link to="/help/our-story" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.ourStory')}</Link></li>
                        <li><Link to="#" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.team')}</Link></li>
                        <li><Link to="/help/privacy-policy" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.privacyPolicy')}</Link></li>
                        <li><Link to="/help/terms" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.termsOfUse')}</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="font-bold text-lg mb-6 text-gray-800 uppercase tracking-wider">{t('footer.customerService')}</h3>
                    <ul className="space-y-3">
                        <li><Link to="/help/contact" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.contactUs')}</Link></li>
                        <li><Link to="/help" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.faq')}</Link></li>
                        <li><Link to="/help" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.help')}</Link></li>
                    </ul>
                </div>

                {/* For Business & Payment */}
                <div>
                    <h3 className="font-bold text-lg mb-6 text-gray-800 uppercase tracking-wider">{t('footer.forBusiness')}</h3>
                    <ul className="space-y-3">
                        <li><Link to="#" className="text-gray-500 hover:text-emerald-600 transition-colors text-sm">{t('footer.corporate')}</Link></li>
                    </ul>
                    <div className="mt-12">
                        {/* Enlarged Heading */}
                        <h3 className="font-bold text-lg mb-6 text-gray-800 uppercase tracking-wider">{t('footer.paymentMethods')}</h3>
                        {/* Bigger Image: Changed h-12 to h-16/h-20 for more impact */}
                        <img 
                            src={paywith} 
                            alt="Payment Methods" 
                            className="h-16 md:h-20 w-auto grayscale hover:grayscale-0 transition-all opacity-100 drop-shadow-md" 
                        />
                    </div>
                </div>

                {/* App & Support */}
                <div className="space-y-8">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase tracking-wider">{t('footer.getApp')}</h3>
                    <div className="space-y-4">
                        <div className="relative border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-emerald-500 transition-colors">
                            <PhoneInput
                                placeholder={t('footer.phoneNumber')}
                                value={value}
                                onChange={setValue}
                                defaultCountry="BD"
                                international
                                className="footer-phone-input px-4 py-3 text-sm outline-none"
                            />
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 w-full text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95">
                            {t('footer.getApp')}
                        </button>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center text-gray-800 mb-2">
                            <Phone className="h-5 w-5 mr-3 text-emerald-600" />
                            <p className="text-2xl font-black tracking-tighter">0000000000000</p>
                        </div>
                        <p className="text-gray-500 text-sm font-medium italic opacity-80">or support@goldenlife.com</p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-500 text-sm font-medium order-2 md:order-1">
                        {t('copyright', { year: currentYear })}
                    </p>
                    
                    <div className="flex items-center gap-4 order-1 md:order-2">
                        {/* Enlarged Social Icons: Increased container w/h and Icon size */}
                        {[Linkedin, Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
                            <Link 
                                key={idx} 
                                to="#" 
                                className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-md hover:-translate-y-1"
                            >
                                <Icon size={24} />
                            </Link>
                        ))}
                        <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block" />
                        <button
                            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')}
                            className="bg-gray-800 text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-md"
                        >
                            {i18n.language === 'en' ? 'BN' : 'EN'}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;