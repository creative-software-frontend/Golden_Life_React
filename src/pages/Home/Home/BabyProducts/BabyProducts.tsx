import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Sample baby products data
const babyProducts = [
    {
        id: 1,
        title: 'Baby Stroller',
        description: 'Comfortable stroller for your little one.',
        image: 'https://chemtrust.org/wp-content/uploads/B33sq.jpg'
    },
    {
        id: 2,
        title: 'Baby Diapers',
        description: 'Soft and absorbent diapers for your baby.',
        image: "https://images.othoba.com/images/thumbs/0530484_teethers-baby-pacifiers-friendly-baby-product.webp"
    },
    {
        id: 3,
        title: 'Baby Crib',
        description: 'Safe and stylish crib for your baby\'s sleep.',
        image: "https://softsensbaby.com/cdn/shop/files/babycare.jpg?v=1615796924"
    },
    {
        id: 4,
        title: 'Baby Clothes',
        description: 'Cute and comfortable clothes for babies.',
        image: "https://eoms.cutpricebd.com/oms_products/big/62fa072c2a0d5_baby-care-kit-8-pcs-convenient-healthcare-grooming-set-for-toddler-infant-89484.png"
    },
    {
        id: 5,
        title: 'Baby Bottles',
        description: 'BPA-free bottles for safe feeding.',
        image: 'https://m.media-amazon.com/images/I/71hWY+ZT-UL._SL1500_.jpg',
    },
    {
        id: 6,
        title: 'Baby Toys',
        description: 'Fun and educational toys for infants.',
        image: 'https://juniorscart.com/wp-content/uploads/2023/02/Diaper-Bags.jpg',
    },
];

const BabyProducts: React.FC = () => {
    return (
        <div className="py-10 -ms-16 shadow mb-5">
            <div className="container mx-auto max-w-7xl px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-500">Baby Products</h1>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3} // Adjust number of slides based on screen size
                    navigation
                    pagination={{ clickable: true }}
                    className="mySwiper"
                >
                    {babyProducts.map((product) => (
                        <SwiperSlide key={product.id} className="rounded-lg shadow-lg overflow-hidden">
                            <div className="flex flex-col items-center justify-between p-4 bg-white rounded-lg h-64"> {/* Fixed height for the card */}
                                <div className="h-32 w-full relative overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold">{product.title}</h2>
                                <p className="text-gray-600 text-center">{product.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default BabyProducts;
