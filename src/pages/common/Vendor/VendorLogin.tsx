// src/pages/common/Vendor/VendorLogin.tsx

import LoginForm from "./LoginForm";
import LoginRightSideContent from "./LoginRightSideContent";

const VendorLogin = () => {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Scrollable Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto relative">
        <LoginForm />
      </div>

      {/* Right Side - Fixed Content */}
      <LoginRightSideContent />
    </div>
  );
};

export default VendorLogin;