import React from "react";

export default function Hero() {
  return (
    <section className="relative z-10 container mx-auto px-5 md:px-8 pt-32">
      <div className="container min-h-[calc(100vh-120px)] flex flex-col">
        
        {/* MIDDLE CONTENT */}
        <div className="mt-12 md:mt-20 text-left md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-8xl font-serif leading-tight text-[#67AC79] mb-8">
            Live Better.<br />
            Manage Life<br />
            <span className="text-[#FF9100]">All in One Place</span>
          </h1>

          <button className="px-9 py-6 text-3xl rounded-r-full bg-[#FF9100] text-white">
            Get Started
          </button>
        </div>

        {/* BOTTOM DESCRIPTION */}
        <p className="mt-auto text-lg text-left md:text-left text-[#FF9100] max-w-md pb-10">
          Golden Life is a modern multi-service platform designed for the modern
          lifestyle — simple, seamless, and built for everyday life.
        </p>

      </div>
    </section>
  );
}