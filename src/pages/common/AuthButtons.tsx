import React from "react";

export default function AuthButtons() {
  return (
    <div className="flex gap-3 md:gap-4">
      <button className="text-xl px-6 py-4 rounded-full text-white bg-[#67AC79]">
        Login
      </button>
      <button className="text-xl px-6 py-4 rounded-full bg-[#FF9100] text-white">
        Register
      </button>
    </div>
  );
}