import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// 👇 CORRECTED IMPORT LINE
import { reviewsData } from "@/data/reviewsData"; 

import ReviewCard from "./ReviewCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Custom styles to override Swiper defaults and implement the center-mode effect
const swiperStyles = `
  .swiper-pagination-bullet {
    background-color: theme('colors.primary');
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    width: 20px;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  .swiper-button-next, .swiper-button-prev {
    color: theme('colors.primary');
    background-color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 18px;
    font-weight: bold;
  }
  /* Ensure the swiper container doesn't cut off shadows */
  .swiper {
    padding-bottom: 50px !important;
    padding-top: 20px !important;
  }
`;

const Reviews: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <style>{swiperStyles}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-primary">Resellers</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the people who have transformed their earnings with ShopBase BD.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            // when window width is >= 768px (Tablet & Desktop)
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="reviews-swiper"
        >
          {reviewsData.map((review) => (
            <SwiperSlide key={review.id}>
              {/* This div applies the opacity and scale transition.
                The `[.swiper-slide-active_&]` is a Tailwind arbitrary variant that
                targets this element only when its parent has the `swiper-slide-active` class.
              */}
              <div className="h-full transition-all duration-500 ease-in-out transform opacity-40 scale-90 [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:scale-100 [.swiper-slide-active_&]:z-10 relative">
                <ReviewCard review={review} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;