import React from 'react'; // Updated import
import LandingHeader from "../common/LandingHeader/LandingHeader";
import LandingFooter from '../common/LandingFooter/LandingFooter';
import Experience from './sections/Experience';
import ProductFAQ from './sections/ProductFAQ';
import Stats from './sections/Stats';
import Reviews from './sections/Reviews';
import Services from './sections/Services';
import Features from './sections/Features';
import Products from './sections/Products';



const Landing: React.FC = () => {
    return (
        <div className="flex flex-col w-full">
            <LandingHeader/>
            <Stats/>
            <Features />
            {/* 1. HERO (Full Width) */}
       
            {/* 3. REVIEWS (Full Width) */}
            {/* We place this OUTSIDE the container so the background hits the edges */}
             <Products />
            <Services />
            <Reviews />
          <ProductFAQ></ProductFAQ>
            <Experience />
            <LandingFooter/>
            

        </div>
    );
};

export default Landing;