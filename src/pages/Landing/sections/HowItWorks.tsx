import React from "react";
import { motion } from "framer-motion";
import { howItWorksLeft, howItWorksRight } from "@/data/howItWorksData";

// Animation Variants for Staggered Entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each item appearing
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 50 } 
  },
};

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 bg-[#FFF8DC] overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* 1. Senior Level Header (Matched "Our Services" Style) */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            How to Start Business <span className="text-primary">With Us</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Start your online business easily with our dropshipping model, without any risk or hassle.
          </motion.p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN CARD --- */}
          {/* Kept your exact gradient theme */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-gradient-to-br from-[#FFD768] to-[#FF7F27] p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-6"
          >
            {howItWorksLeft.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }} // Senior Dev Touch: Micro-interaction
                className="bg-white rounded-2xl p-5 flex items-start gap-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
              >
                {/* Number Circle with cleaner look */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#FFF8DC] border-2 border-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 text-xl shadow-inner">
                  {item.number}
                </div>
                {/* Text */}
                <p className="text-gray-800 text-base font-medium leading-relaxed pt-1">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* --- RIGHT COLUMN CARD --- */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-gradient-to-br from-[#FFD768] to-[#FF7F27] p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-6"
          >
            {howItWorksRight.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }} // Senior Dev Touch: Micro-interaction
                className="bg-white rounded-2xl p-5 flex items-start gap-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
              >
                {/* Number Circle */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#FFF8DC] border-2 border-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 text-xl shadow-inner">
                  {item.number}
                </div>
                {/* Text */}
                <p className="text-gray-800 text-base font-medium leading-relaxed pt-1">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;