import React from "react";
import Logo from "./Logo";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <div className="container mx-auto px-5 md:px-8 py-5 flex justify-between items-center">
        <Logo />
        <AuthButtons />
      </div>
    </header>
  );
}