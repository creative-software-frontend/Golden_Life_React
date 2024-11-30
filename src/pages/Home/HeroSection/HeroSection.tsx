import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // Only import pagination CSS
import { Pagination, Autoplay } from "swiper/modules";

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
        <div className="flex justify-start py-8 md:max-w-[1040px] w-[370px]   sm:w-full">
            <Swiper
                modules={[Pagination, Autoplay]} // Removed Navigation
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }} // Pagination will be shown
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="rounded-lg shadow-lg"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative">
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-auto sm:h-[400px] md:h-[400px] lg:h-[400px] rounded-lg"
                        />

                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSection;
