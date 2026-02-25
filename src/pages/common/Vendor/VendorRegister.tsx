import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, Loader2, ArrowLeft, User, Phone, ShoppingBag } from "lucide-react";
import Logo from "../Logo";

const VendorRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
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
      console.log("Register Data:", formData);
      setIsLoading(false);
      // Logic: Navigate to login or dashboard
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* --- LEFT SIDE: REGISTER FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative z-10 overflow-y-auto h-screen lg:h-auto">
        
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
          className="w-full max-w-md mx-auto space-y-8 mt-16 lg:mt-0"
        >
          {/* Header */}
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Store className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                        <Logo />
                </span>
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500">
              Start selling to millions of customers today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Owner Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Owner Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Shop Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Shop / Business Name</label>
              <div className="relative group">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="text"
                  name="shopName"
                  required
                  placeholder="My Awesome Store"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+880..."
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-gray-900"
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
              className="w-full py-3.5 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register Shop
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have a vendor account?{" "}
            <Link to="/vendor/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image - Different from Login to distinguish pages */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
            alt="Store Owner"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="relative z-10 w-full h-full flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-lg"
          >
            <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              Join Us Today
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Start your journey with <span className="text-green-400">GoldenLife</span>.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              "Since joining GoldenLife, my sales have increased by 200%. The platform is incredibly easy to use."
            </p>
            
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="User" />
                </div>
                <div>
                    <p className="text-white font-bold">Rahim Ahmed</p>
                    <p className="text-gray-400 text-sm">Owner, Rahim Electronics</p>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default VendorRegister;