"use client";

import { useState } from "react";
import { CheckCircle, Play } from "lucide-react";

export default function Stats() {
  const [play, setPlay] = useState(false);

  return (
    <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-stretch">

        {/* LEFT CONTENT */}
        <div
          className="p-10 rounded-xl shadow-sm h-full flex flex-col justify-between"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
          }}
        >
          <div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
              About Us
            </h2>

            {/* LINE */}
            <div className="w-24 h-1 mb-6" style={{ backgroundColor: "#F4A261" }} />

            <p className="leading-relaxed mb-10" style={{ color: "#475569" }}>
              SuperBiz BD is one of the largest dropshipping and reselling
              platforms in Bangladesh. We provide verified products, instant
              payments, fast delivery, and 24/7 customer support to help you
              grow your online business with confidence.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">

              {/* Vision */}
              <div>
                <h4 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>
                  Our Vision
                </h4>

                <ul className="space-y-3">
                  {[
                    "Build a trusted eCommerce ecosystem",
                    "Empower digital entrepreneurs",
                    "Simplify online business",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={20} color="#F4A261" />
                      <span style={{ color: "#475569" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mission */}
              <div>
                <h4 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>
                  Our Mission
                </h4>

                <ul className="space-y-3">
                  {[
                    "Provide verified quality products",
                    "Ensure fast delivery & instant payout",
                    "Offer 24/7 dedicated support",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={20} color="#F4A261" />
                      <span style={{ color: "#475569" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT VIDEO */}
        <div
          className="relative rounded-xl overflow-hidden shadow-lg h-full cursor-pointer group"
          style={{ border: "1px solid #E2E8F0" }}
          onClick={() => setPlay(true)}
        >

          {/* THUMBNAIL */}
          {!play && (
            <>
              <img
                src="https://img.youtube.com/vi/ie5vl25VGRY/maxresdefault.jpg"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="video thumbnail"
                loading="lazy"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/40" />

              {/* PLAY BUTTON */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">

                  {/* Ripple */}
                  <span
                    className="absolute w-24 h-24 rounded-full animate-ping"
                    style={{ backgroundColor: "#F4A261", opacity: 0.6 }}
                  ></span>

                  {/* Button */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: "#F4A261" }}
                  >
                    <Play size={36} color="#ffffff" />
                  </div>

                </div>
              </div>
            </>
          )}

          {/* IFRAME */}
          {play && (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/ie5vl25VGRY?autoplay=1"
              title="About SuperBiz BD"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          )}

        </div>

      </div>
    </section>
  );
}
