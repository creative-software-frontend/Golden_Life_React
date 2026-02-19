import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import your images
import banner1 from '../../../../public/image/Banner/Screenshot_3.png';
import banner2 from '../../../../public/image/Banner/Screenshot_4.png';
import banner3 from '../../../../public/image/Banner/Screenshot_7.png';

const HeroSection = () => {
    const banners = [
        { id: 1, image: banner1, title: "Welcome to Our Website", description: "Discover amazing features and great content." },
        { id: 2, image: banner2, title: "Explore Our Services", description: "We offer a wide range of services to suit your needs." },
        { id: 3, image: banner3, title: "Join Us Today", description: "Become part of our community and enjoy exclusive benefits." },
    ];

    return (
        <>
            {/* =========================================
                DESKTOP VIEW (Visible on lg+ screens)
               ========================================= */}
            {/* Reduced padding from py-10 to py-6 */}
            <section className="hidden lg:block w-full px-4 py-6">
                {/* Added max-w-6xl to decrease overall width */}
                <div className="max-w-containe mx-auto overflow-hidden rounded-2xl shadow-xl">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        // Reduced height from h-[600px] to h-[400px]
                        className="h-[400px]"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id} className="relative group">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                {/* Reduced padding from p-24 to p-12 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center items-start text-left p-12 md:p-16 transition-opacity duration-300">
                                    {/* Reduced font size from text-6xl to text-4xl */}
                                    <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-xl">{banner.title}</h2>
                                    {/* Reduced font size and margin */}
                                    <p className="text-gray-100 text-lg max-w-lg mb-6 font-medium drop-shadow-md">{banner.description}</p>
                                    {/* Reduced button size */}
                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-full font-bold text-base shadow-lg transform hover:scale-105 transition-all">
                                        Get Started
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* =========================================
                MOBILE & TABLET VIEW (Visible below lg)
               ========================================= */}
            <section className="block lg:hidden w-full px-3 py-3">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img 
                            src={banner1} 
                            alt="Welcome" 
                            className="w-full h-full object-cover opacity-60" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    {/* Reduced height from h-[400px] to h-[280px] */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center h-[280px] px-4">
                        <span className="inline-block px-2.5 py-0.5 mb-3 text-[10px] font-bold tracking-wider text-emerald-300 uppercase bg-emerald-900/50 rounded-full border border-emerald-500/30">
                            Welcome
                        </span>
                        {/* Reduced title size from text-3xl to text-2xl */}
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                            Discover Amazing <br /> Features
                        </h1>
                        {/* Reduced text size and margin */}
                        <p className="text-gray-300 text-xs sm:text-sm max-w-xs mb-4 leading-relaxed">
                            Join thousands of students learning new skills every day.
                        </p>
                        <div className="flex flex-row gap-2 w-full justify-center">
                            {/* Smaller buttons */}
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold text-xs shadow-md">
                                Get Started
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2 rounded-lg font-bold text-xs backdrop-blur-sm">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Compact Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-emerald-50 p-2.5 rounded-lg text-center">
                        <h3 className="text-emerald-800 font-bold text-base">100+</h3>
                        <p className="text-emerald-600 text-[10px]">Courses</p>
                    </div>
                    <div className="bg-orange-50 p-2.5 rounded-lg text-center">
                        <h3 className="text-orange-800 font-bold text-base">50k+</h3>
                        <p className="text-orange-600 text-[10px]">Students</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;