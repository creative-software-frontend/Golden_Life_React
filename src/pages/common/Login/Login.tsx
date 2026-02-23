import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import Logo from '../Logo';

type LoginMethod = 'mobile' | 'email';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('mobile');
  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    mobile: '',
    email: '',
    password: ''
  });
  const [apiError, setApiError] = useState(''); // Added to show backend errors
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(''); // Clear global error on typing
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { mobile: '', email: '', password: '' };

    if (loginMethod === 'mobile') {
      if (!formData.mobile) {
        newErrors.mobile = 'মোবাইল নম্বর আবশ্যক';
        isValid = false;
      } else if (!/^01\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'বৈধ মোবাইল নম্বর দিন (01XXXXXXXXX)';
        isValid = false;
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'ইমেইল আবশ্যক';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'বৈধ ইমেইল ঠিকানা দিন';
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড আবশ্যক';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    // Assuming your login endpoint ends with /login. Adjust if it's different!
    const endpoint = `${baseURL}/api/student/login`; 

    // Create payload based on selected login method
    const payload = loginMethod === 'mobile' 
      ? { mobile: formData.mobile, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      // Make Axios POST request
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Extract token from backend response (adjust 'response.data.token' if your backend structure is different)
      const token = response.data.token; 

      if (token) {
        // 1. Save Token to Cookie with 1 Day Expiration
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (1 * 24 * 60 * 60 * 1000)); // Current time + 1 Day (in milliseconds)
        document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;

        // 2. Optional: Also save to LocalStorage with an expiry timestamp if you prefer using localStorage over cookies
        const storageData = {
          token: token,
          expiry: expirationDate.getTime()
        };
        localStorage.setItem('student_session', JSON.stringify(storageData));

        console.log('Login successful');
        navigate('/dashboard');
      } else {
        throw new Error('No token received from server');
      }

    } catch (error: any) {
      console.error('Login failed:', error);
      // Check if it's an Axios error with a response from the backend
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Invalid login credentials.');
      } else {
        setApiError(error.message || 'A network error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
      
      {/* Logo Section */}
      <div className="px-8 pt-10 pb-4 text-center">
        <Logo />
      </div>

      {/* Welcome Text */}
      <div className="px-8 pb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-2">Log in to your Golden Life account</p>
      </div>

      {/* Login Method Toggle Buttons */}
      <div className="mx-8 mb-6 flex bg-gray-100 p-1.5 rounded-xl">
        <button
          type="button"
          onClick={() => { setLoginMethod('mobile'); setErrors({mobile:'', email:'', password:''}); setApiError(''); }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
            loginMethod === 'mobile'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Mobile
        </button>
        <button
          type="button"
          onClick={() => { setLoginMethod('email'); setErrors({mobile:'', email:'', password:''}); setApiError(''); }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
            loginMethod === 'email'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Email
        </button>
      </div>

      {/* Form Section */}
      <div className="px-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Global API Error Display */}
          {apiError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
              {apiError}
            </div>
          )}

          {/* Dynamic Input Field based on selection */}
          {loginMethod === 'mobile' ? (
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all`}
                  disabled={isLoading}
                />
              </div>
              {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all`}
                disabled={isLoading}
              />
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#FF8A00] hover:text-orange-600 font-medium hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF8A00] text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loging ....
              </span>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 pt-2">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#FF8A00] hover:text-orange-600 font-bold hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </form>

        {/* Vendor Login Button */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <button
            onClick={() => navigate('/vendor/login')}
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-bold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Login as Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;