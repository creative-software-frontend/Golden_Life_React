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
            <section className="hidden lg:block w-full px-4 py-10">
                <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="h-[600px]"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id} className="relative group">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center items-start text-left p-24 transition-opacity duration-300">
                                    <h2 className="text-white text-6xl font-extrabold mb-4 drop-shadow-2xl">{banner.title}</h2>
                                    <p className="text-gray-100 text-xl max-w-xl mb-8 font-medium drop-shadow-md">{banner.description}</p>
                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all">Get Started</button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* =========================================
                MOBILE & TABLET VIEW (Visible below lg)
               ========================================= */}
            <section className="block lg:hidden w-full px-3 py-4">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900">
                    {/* Background Image (Using the first banner as static hero) */}
                    <div className="absolute inset-0">
                        <img 
                            src={banner1} 
                            alt="Welcome" 
                            className="w-full h-full object-cover opacity-60" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center h-[400px] px-6">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-emerald-300 uppercase bg-emerald-900/50 rounded-full border border-emerald-500/30">
                            Welcome
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                            Discover Amazing <br /> Features
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base max-w-sm mb-6 leading-relaxed">
                            Join thousands of students learning new skills every day. Start your journey with us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95">
                                Get Started
                            </button>
                            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-sm backdrop-blur-sm transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Optional: Small Features Grid below the Hero for Mobile */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-emerald-50 p-4 rounded-xl text-center">
                        <h3 className="text-emerald-800 font-bold text-lg">100+</h3>
                        <p className="text-emerald-600 text-xs">Courses</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl text-center">
                        <h3 className="text-orange-800 font-bold text-lg">50k+</h3>
                        <p className="text-orange-600 text-xs">Students</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;