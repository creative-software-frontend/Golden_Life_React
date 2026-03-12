// src/components/vendor/LoginForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Store, Loader2, ArrowLeft, 
  CheckCircle2, AlertCircle 
} from "lucide-react";
import Logo from "../Logo";

// Scroll Animation Variants
const scrollVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const LoginForm = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // API Feedback States
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (!formData.email || !formData.password) {
      setApiError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://api.goldenlife.my";
      const endpoint = `${baseUrl}/api/vendor/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      // Handle Rate Limiting / Blacklisting
      if (response.status === 403 || response.status === 429) {
        throw new Error("Too many attempts. Your IP has been temporarily blocked.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // --- SUCCESS FLOW ---
      
      if (data.token) {
        // 1. Save to SessionStorage instead of LocalStorage for better security
        sessionStorage.setItem("vendor_token", data.token);
        sessionStorage.setItem("vendor_session", JSON.stringify({
          token: data.token,
          isVerified: true,
          expiry: new Date().getTime() + 86400000 // Expires in 24 hours
        }));

        // 2. Save to Browser Cookies
        document.cookie = `vendor_token=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }

      // 3. Show the Success Toast
      setSuccessMessage("Login successful! Redirecting to dashboard...");
      
      // 4. Redirect to Dashboard after 1.5 seconds so they can read the message
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/vendor/dashboard");
      }, 1500);

    } catch (error: any) {
      console.error("Login Error:", error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- SUCCESS TOAST OVERLAY --- */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 24, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[200] flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium text-sm tracking-wide">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OUTER WRAPPER: Native CSS injected to completely hide scrollbars across ALL browsers */}
      <div className="h-screen w-full overflow-y-auto relative bg-background [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* INNER WRAPPER: Ensures content is centered but safely expands */}
        <div className="min-h-full flex flex-col justify-center px-6 pt-28 pb-8 sm:p-12 lg:p-24 relative">
          
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-8 left-6 sm:left-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="w-full max-w-md mx-auto">
            
            {/* Logo */}
            <motion.div 
              variants={scrollVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-8 sm:mb-10"
            >
              <Link to="/" className="inline-flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm transition-all">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 transition-all" strokeWidth={2.5} />
                </div>
                <div className="scale-100 sm:scale-125 origin-left transition-all">
                  <Logo />
                </div>
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div 
              variants={scrollVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back!</h1>
              <p className="text-gray-500 text-sm sm:text-base">Please enter your details to access your dashboard</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* API Feedback Alert */}
              {apiError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{apiError}</p>
                </motion.div>
              )}

              {/* Email */}
              <motion.div 
                variants={scrollVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${apiError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all shadow-sm ${apiError ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50' : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'}`}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div 
                variants={scrollVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link 
                    to="/vendor/forgot-password" 
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${apiError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl outline-none transition-all shadow-sm ${apiError ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50' : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.div 
                variants={scrollVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={scrollVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.p 
              variants={scrollVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="text-center text-sm text-gray-500 mt-8"
            >
              Don't have a vendor account?{" "}
              <Link to="/vendor/register" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
                Apply Now
              </Link>
            </motion.p>

            {/* Trust Badge */}
            <motion.div 
              variants={scrollVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center justify-center gap-8 mt-10 pt-6 border-t border-gray-100"
            >
              {["Secure", "Encrypted", "Trusted"].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item}</span>
                  <div className="w-6 h-0.5 bg-gray-200 rounded-full mt-1.5" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;