// BannerSection.tsx
import React from 'react';
import banner1 from '../../../../public/image/Banner/Screenshot_3.png';
import banner2 from '../../../../public/image/Banner/Screenshot_4.png';
import banner3 from '../../../../public/image/Banner/Screenshot_7.png';

type Banner = {
    id: number;
    image: string;
    title: string;
    description: string;
};

const BannerSection: React.FC = () => {
    const banners: Banner[] = [
        {
            id: 1,
            image: banner1,
            title: "Welcome to Our Website",
            description: "Discover amazing features and great content.",
        },
        {
            id: 2,
            image: banner2,
            title: "Explore Our Services",
            description: "We offer a wide range of services to suit your needs.",
        },
        {
            id: 3,
            image: banner3,
            title: "Join Us Today",
            description: "Become part of our community and enjoy exclusive benefits.",
        },
    ];

    return (
        <div className="flex relative  gap-4 py-8 px-2  -ms-16 m-4">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    className="flex-1  rounded-lg overflow-hidden shadow-lg h-64 w-11/12" // Adjusted width
                >
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                    {/* <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center p-4">
                        <h2 className="text-lg md:text-2xl font-semibold mb-2">
                            {banner.title}
                        </h2>
                        <p className="text-sm md:text-lg">{banner.description}</p>
                    </div> */}
                </div>
            ))}
        </div>

    );
};

export default BannerSection;
