import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Logo';

type LoginMethod = 'mobile' | 'email';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // --- Form States ---
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('mobile');
  const [showPassword, setShowPassword] = useState(false);
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
  const [apiError, setApiError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  // --- OTP Modal States (For Mobile Only) ---
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // 4-digit OTP
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { mobile: '', email: '', password: '' };

    if (loginMethod === 'mobile') {
      // Validation for Mobile (No Password Required)
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
        isValid = false;
      } else if (!/^01\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'Enter a valid mobile number (01XXXXXXXXX)';
        isValid = false;
      }
    } else {
      // Validation for Email (Password IS Required)
      if (!formData.email) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
        isValid = false;
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- 1. HANDLE LOGIN SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    if (loginMethod === 'mobile') {
      // ==========================================
      // FLOW A: MOBILE LOGIN (FAKE DESIGN ONLY)
      // ==========================================
      
      // Simulate network delay for UI purposes (1 second)
      setTimeout(() => {
        setIsLoading(false);
        setShowOtpModal(true); // Open Modal
      }, 1000);

    } else {
      // ==========================================
      // FLOW B: EMAIL LOGIN (REAL API VERIFICATION)
      // ==========================================
      const endpoint = `${baseURL}/api/student/login`; 
      
      try {
        const response = await axios.post(endpoint, { 
          email: formData.email, 
          password: formData.password 
        }, {
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
          }
        });
        
        // Adjust token path based on your backend response structure
        const token = response.data.token || response.data.data?.token;

        if (token) {
          // Save Token to Cookie (1 Day Expiration)
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + (1 * 24 * 60 * 60 * 1000));
          document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;

          // Save Token to LocalStorage
          localStorage.setItem('student_session', JSON.stringify({ 
            token: token, 
            expiry: expirationDate.getTime() 
          }));
          
          console.log('Email Login successful');
          navigate('/dashboard'); // Direct redirect, no OTP modal!
        } else {
          throw new Error('No token received from server');
        }
      } catch (error: any) {
        console.error('Email Login failed:', error);
        setApiError(error.response?.data?.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- 2. OTP INPUT HANDLERS (For Mobile Fake Flow) ---
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(''); // Clear error on typing

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto-focus previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // --- 3. VERIFY OTP (FAKE DESIGN ONLY - SAVES TOKEN) ---
  const handleOtpSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsOtpLoading(true);

    // Simulate verification delay for UI purposes (1 second)
    setTimeout(() => {
      setIsOtpLoading(false);
      
      // We will pretend "1234" is the only correct OTP for testing design
      if (otpCode !== "1234") {
        setOtpError("Invalid OTP. Hint: Use 1234");
        return;
      }

      setShowOtpModal(false);

      // --- CREATE AND SAVE FAKE TOKEN SO DASHBOARD WORKS ---
      const fakeToken = "fake_jwt_token_for_mobile_otp_login";
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + (1 * 24 * 60 * 60 * 1000));
      
      document.cookie = `token=${fakeToken}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
      localStorage.setItem('student_session', JSON.stringify({ 
        token: fakeToken, 
        expiry: expirationDate.getTime() 
      }));

      // Redirect to dashboard with token saved
      navigate('/dashboard'); 
    }, 1000);
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative mt-8 md:mt-12 mb-8">
        
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
              loginMethod === 'mobile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Mobile (OTP)
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setErrors({mobile:'', email:'', password:''}); setApiError(''); }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
              loginMethod === 'email' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Email (Password)
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

            {/* PASSWORD FIELD - ONLY VISIBLE IF EMAIL LOGIN SELECTED */}
            {loginMethod === 'email' && (
              <>
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-[#FF8A00] hover:text-orange-600 font-medium hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </>
            )}

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
                  Processing...
                </span>
              ) : (
                <span>{loginMethod === 'mobile' ? 'Login via OTP' : 'Login'}</span>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#FF8A00] hover:text-orange-600 font-bold hover:underline transition-colors">
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

      {/* --- 4. OTP VERIFICATION MODAL --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in-95 relative">
            
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 text-[#FF8A00] flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Verify Your Phone</h2>
              <p className="text-gray-500 mt-2 text-sm">
                We've sent a 4-digit verification code to <br/>
                <span className="font-bold text-gray-800">{formData.mobile}</span>
              </p>
              <p className="text-xs text-orange-500 font-bold mt-1">(Hint: Enter 1234 to login)</p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-4 text-center">
                {otpError}
              </div>
            )}

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  // @ts-ignore
                  ref={el => otpInputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-black text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={isOtpLoading || otp.join("").length < 4}
              className="w-full bg-[#FF8A00] hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isOtpLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : "Verify & Continue"}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Didn't receive the code? <button type="button" onClick={handleSubmit} className="text-[#FF8A00] font-bold hover:underline">Resend</button>
            </p>

          </div>
        </div>
      )}
    </>
  );
};

export default Login;