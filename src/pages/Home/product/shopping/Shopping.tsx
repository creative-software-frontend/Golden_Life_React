import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Sample categories data
const categories = [
    {
        id: 1,
        title: 'Fashion',
        description: 'Explore the latest trends in fashion.',
        image: 'https://thumbs.dreamstime.com/b/shopping-basket-full-fresh-food-isolated-wire-groceries-including-fruit-vegetables-milk-wine-meat-dairy-products-white-39073602.jpg',
    },
    {
        id: 2,
        title: 'Electronics',
        description: 'Discover the newest gadgets and devices.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiN7Bm4xf9HP4dHRUuli_Dns00kOuw-HfVJw&s',
    },
    {
        id: 3,
        title: 'Home & Garden',
        description: 'Find everything you need for your home and garden.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_pBX6pBK4Ee9E1XTb0DPYGcKF2OxNrid9sg&s',
    },
    {
        id: 4,
        title: 'Beauty',
        description: 'Enhance your beauty with our products.',
        image: 'https://cdn.images.express.co.uk/img/dynamic/1/590x/shopping-385445.jpg?r=1686998680160',
    },
];

const Shopping: React.FC = () => {
    return (
        <div className="py-10 -ms-16 shadow mb-5">
            <div className="container mx-auto max-w-7xl px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-500">Shopping Categories</h1>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3} // Adjust number of slides based on screen size
                    navigation
                    pagination={{ clickable: true }}
                    className="mySwiper"
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id} className="rounded-lg shadow-lg overflow-hidden">
                            <div className="flex flex-col items-center justify-between p-4 bg-white rounded-lg h-64"> {/* Fixed height for the card */}
                                {/* Set a fixed height for the image container */}
                                <div className="h-32 w-full relative overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold">{category.title}</h2>
                                <p className="text-gray-600 text-center">{category.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Shopping;
