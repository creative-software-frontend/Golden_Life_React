import React from "react";

export default function AuthButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200">
        Login
      </button>
      <button className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-[#FF8A00] text-white hover:bg-orange-600 transition-colors duration-200">
        Register
      </button>
    </div>
  );
}