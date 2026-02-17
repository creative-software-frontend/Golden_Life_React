import React from 'react'; // Updated import
import Experience from "./sections/Experience";
import HowItWorks from "./sections/HowItWorks";
import Products from "./sections/Products";
import Features from "./sections/Features";
import LandingHeader from "../common/LandingHeader/LandingHeader";
import Reviews from "./sections/Reviews";
import Services from "./sections/Services";
import Stats from "./sections/Stats";
import ProductFAQ from "./sections/ProductFAQ";



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
            

        </div>
    );
};

export default Landing;