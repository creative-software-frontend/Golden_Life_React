// import React from 'react';
// import Hero from "./sections/Hero";
// import Stats from "./sections/Stats";
// import Services from "./sections/Services";
// import Features from "./sections/Features";
// import Products from "./sections/Products";
// import HowItWorks from "./sections/HowItWorks";
import Reviews from "./sections/Reviews";

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col w-full">
            
            {/* 1. HERO (Full Width) */}
            {/* <Hero />

         
                <Stats />
                <Services />
                <Features />
                <Products />
                <HowItWorks />
           */}

            {/* 3. REVIEWS (Full Width) */}
            {/* We place this OUTSIDE the container so the background hits the edges */}
            <Reviews />

        </div>
    );
};

export default Landing;