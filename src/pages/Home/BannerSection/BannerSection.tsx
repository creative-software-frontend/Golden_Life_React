import React from 'react';
import sampleImage1 from '../../../../public/image/Banner/Screenshot_3.png';
import sampleImage2 from '../../../../public/image/Banner/Screenshot_3.png';
import sampleImage3 from '../../../../public/image/Banner/Screenshot_3.png';

const Banner: React.FC = () => {
    return (
        <div className="-ms-20 container mx-auto max-w-7xl px-4 -mt-6 -mb-8">
            <div className="flex justify-between gap-2 py-4" style={{ width: '108%' }}>

                {/* First Image Div */}
                <div style={{ width: '50%' }}>
                    <img src={sampleImage1} alt="Discount Image 1" className="w-full h-auto rounded-lg" />
                </div>

                {/* Second Image Div */}
                <div style={{ width: '50%' }}>
                    <img src={sampleImage2} alt="Discount Image 2" className="w-full h-auto rounded-lg" />
                </div>

                {/* Third Image Div */}
                <div style={{ width: '50%' }}>
                    <img src={sampleImage3} alt="Discount Image 3" className="w-full h-auto rounded-lg" />
                </div>

            </div>
        </div>
    );
};

export default Banner;
