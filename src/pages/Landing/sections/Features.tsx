import FeatureCard from "@/pages/common/FeatureCard";
import React from "react";

export default function Features() {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-5 md:px-8">

                {/* SECTION HEADER */}
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            {/* BADGE */}
                            <span className="inline-block px-4 py-2 bg-[#FF9100]/10 text-[#FF9100] rounded-full text-sm font-semibold mb-4">
                                Our Services
                            </span>

                            {/* TITLE */}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl">
                                Services We Provide to <br />
                                <span className="text-[#67AC79]">Elevate Your Business</span>
                            </h2>
                        </div>

                        {/* VIEW ALL BUTTON */}
                        <div>
                            <a
                                href="#"
                                className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#FF9100] text-[#FF9100] font-semibold rounded-lg hover:bg-[#FF9100] hover:text-white transition-all duration-300 group"
                            >
                                View All Services
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* FEATURE CARDS GRID - 3 COLUMNS */}
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <FeatureCard
                            title="Zero Investment"
                            description="Start your business with zero investment. Simply register and sell your products with cash on delivery through our platform."
                        />

                        <FeatureCard
                            title="Instant Payment"
                            description="Receive your payment instantly after successful delivery. Payments are automatically transferred to your account without any hassle."
                        />

                        <FeatureCard
                            title="Cash on Delivery"
                            description="Sell confidently with cash on delivery. Your customers can pay after receiving the product, increasing trust and conversion."
                        />

                        <FeatureCard
                            title="Verified Products"
                            description="All products go through a verification process to ensure quality, authenticity, and customer satisfaction."
                        />

                        <FeatureCard
                            title="Search by Image"
                            description="Customers can search products using images. Just upload a photo and instantly find similar products from our marketplace."
                        />

                        <FeatureCard
                            title="Fast Delivery"
                            description="Get your orders delivered within 1–3 days. We ensure fast and reliable delivery across major locations."
                        />

                    </div>

                </div>



            </div>
        </section>
    );
}