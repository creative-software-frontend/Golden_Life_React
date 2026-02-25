import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, Loader2, ArrowLeft } from "lucide-react";
import Logo from "../Logo";

const VendorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login Data:", formData);
      setIsLoading(false);
      // Add your login logic/redirection here
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* --- LEFT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative z-10">
      {/* BACK BUTTON */}
        <div className="absolute top-8 left-8 sm:left-12">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          {/* Header */}
         <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Store className="w-7 h-7 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
         
                     <Logo />
                  
            </span>
          </Link>

          {/* Header Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500">
              Please enter your details to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="vendor@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/vendor/forgot-password" className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Don't have a vendor account?{" "}
            <Link to="/vendor/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Apply Now
            </Link>
          </p>

          {/* Trust Badge / Footer Note */}
          <div className="pt-8 border-t border-gray-100 flex justify-center gap-6 text-gray-300">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-semibold uppercase tracking-wider">Secure</span>
               <div className="w-12 h-1 bg-gray-100 rounded-full mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-semibold uppercase tracking-wider">Encrypted</span>
               <div className="w-12 h-1 bg-gray-100 rounded-full mt-1"></div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Warehouse Management"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-lg"
          >
            <div className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              Vendor Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Grow your business with <span className="text-orange-500">GoldenLife</span>.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Manage inventory, track orders, and analyze your sales performance all in one place. Join thousands of sellers growing their revenue today.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">50k+</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Daily Orders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">12k+</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Active Vendors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default VendorLogin;