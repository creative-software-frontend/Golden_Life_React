// import React from 'react';
// import Hero from "./sections/Hero";
// import Stats from "./sections/Stats";
// import Services from "./sections/Services";
// import Features from "./sections/Features";
// import Products from "./sections/Products";
// import HowItWorks from "./sections/HowItWorks";
import LandingHeader from "../common/LandingHeader/LandingHeader";
import Reviews from "./sections/Reviews";



const Landing: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 pb-20">
        
            {/* Hero Section (Full Width) */}
            {/* <Hero /> */}
            <LandingHeader/>

            {/* Container to center content and add spacing */}
            <div className="container mx-auto px-4 space-y-20">
                {/* <Stats />
                <Services />
                <Features />
                <Products />
                <HowItWorks /> */}
                <Reviews />
            </div>
        </div>
    );
};

export default Landing;