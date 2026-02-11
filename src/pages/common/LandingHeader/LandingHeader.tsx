import React from "react";

export default function Banner() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* RIGHT HALF BACKGROUND IMAGE */}
      <div className="absolute top-0 right-0 h-full  sm:w-auto md:w-1/2">
        <img
          src="https://i.ibb.co.com/hRN1NgxF/landing1.jpg"
          alt="Golden Life Hero"
          className="h-full w-full object-cover"
        />
      </div>

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex justify-between items-center">
          <div className="text-2xl font-semibold">
            <span className="text-[#FF9100]">Golden</span>{" "}
            <span className="text-[#67AC79]">Life</span>
          </div>

          <div className="flex gap-3 md:gap-4">
            <button className="text-sm px-4 py-2 rounded-full text-white bg-[#67AC79]">
              Login
            </button>
            <button className="text-sm px-5 py-2 rounded-full bg-[#FF9100] text-white">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* HERO CONTENT */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-32">
        <div className="max-w-xl min-h-[calc(100vh-120px)] flex flex-col">

          {/* MIDDLE CONTENT */}
          <div className="mt-12 md:mt-20 text-left md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#67AC79] mb-8">
              Live Better.<br />
              Manage Life<br />
              <span className="text-[#FF9100]">All in One Place</span>
            </h1>

            <button className="px-6 py-3 rounded-r-full bg-[#FF9100] text-white">
              Get Started
            </button>
          </div>

          {/* BOTTOM DESCRIPTION */}
          <p className="mt-auto text-sm text-left md:text-left text-gray-600 max-w-md pb-10">
            Golden Life is a modern multi-service platform designed for the modern
            lifestyle — simple, seamless, and built for everyday life.
          </p>

        </div>
      </section>

    </div>
  );
}
