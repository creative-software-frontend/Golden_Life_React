import React from 'react';

const Banner: React.FC = () => {
    return (
        <div className="py-10 -ms-16 shadow mb-5">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex justify-between gap-4 py-4">

                    {/* First Inner Div */}
                    <div className="relative w-11/12 p-6 bg-primary-default rounded-lg overflow-hidden">
                        {/* Circle impact going through the top right corner */}
                        <div className="absolute -top-8 -right-5 w-24 h-24 flex items-center justify-center text-white text-2xl font-semibold bg-primary-light rounded-full">
                            20%
                        </div>
                        {/* Left text */}
                        <div className="text-left py-4">
                            <h2 className="text-xl font-bold text-white">Discount </h2>
                            <p className="text-white text-lg gap-10">Grab it Now!</p>
                        </div>

                    </div>

                    {/* Second Inner Div */}
                    <div className="relative w-11/12 p-6 bg-primary-default rounded-lg overflow-hidden">
                        {/* Circle impact going through the top right corner */}
                        <div className="absolute -top-8 -right-5 w-24 h-24 flex items-center justify-center text-white text-2xl font-semibold bg-blue-300 rounded-full">
                            10%
                        </div>
                        {/* Left text */}
                        <div className="text-left py-4">
                            <h2 className="text-xl font-bold text-white">Discount </h2>
                            <p className="text-white text-lg gap-10">Grab it Now!</p>
                        </div>

                    </div>

                    {/* Third Inner Div */}
                    <div className="relative w-11/12 p-6 bg-primary-default rounded-lg overflow-hidden">
                        {/* Circle impact going through the top right corner */}
                        <div className="absolute -top-8 -right-5 w-24 h-24 flex items-center justify-center text-white text-2xl font-semibold bg-blue-300 rounded-full">
                            5%
                        </div>
                        {/* Left text */}
                        <div className="text-left py-4">
                            <h2 className="text-xl font-bold text-white">Discount </h2>
                            <p className="text-white text-lg gap-10">Grab it Now!</p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Banner;
