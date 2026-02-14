import React from "react";
import Header from "../Header";
import Hero from "@/pages/landing/sections/Hero";


export default function LandingHeader() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      
      {/* RIGHT HALF BACKGROUND IMAGE */}
      <div className="absolute top-0 right-0 h-full sm:w-full md:w-1/2">
        <img
          src="https://i.ibb.co.com/hRN1NgxF/landing1.jpg"
          alt="Golden Life Hero"
          className="h-full w-full object-cover"
        />
      </div>

      {/* HEADER COMPONENT */}
      <Header />

      {/* HERO SECTION COMPONENT */}
      <Hero />

    </div>
  );
}