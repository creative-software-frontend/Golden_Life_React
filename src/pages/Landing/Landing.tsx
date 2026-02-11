// import React from 'react';
// import Hero from "./sections/Hero";
// import Stats from "./sections/Stats";

// import Features from "./sections/Features";
// import Products from "./sections/Products";
// import HowItWorks from "./sections/HowItWorks";
import Experience from "./sections/Experience";
import HowItWorks from "./sections/HowItWorks";
import Products from "./sections/Products";
import Reviews from "./sections/Reviews";
import Services from "./sections/Services";

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col w-full">
            
            {/* 1. HERO (Full Width) */}
            {/* <Hero />

         
                <Stats />
        
                <Features />
             
               
           */}

            {/* 3. REVIEWS (Full Width) */}
            {/* We place this OUTSIDE the container so the background hits the edges */}
             <Products />
            <HowItWorks />
            <Services />
            <Reviews />
            <Experience />

        </div>
    );
};

export default Landing;