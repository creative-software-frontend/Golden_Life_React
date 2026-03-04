import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Added Lucide icons
import Logo from '../Logo';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Registration States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // 4-digit OTP
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', 
    referCode: '', 
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', 
    referCode: '', 
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!/^01\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid mobile number (01XXXXXXXXX)';
      isValid = false;
    }

    if (!formData.referCode.trim()) {
      newErrors.referCode = 'Referral code is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else if (!/(?=.*[a-zA-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one letter';
        isValid = false;
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
        isValid = false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(''); 

    try {
      const response = await fetch(`${baseURL}/api/student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          mobile: formData.phone,
          referral_code: formData.referCode, 
          password: formData.password,
          password_confirmation: formData.confirmPassword, 
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed.');
      }
      setShowOtpModal(true);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
        setOtpError("Enter the complete 4-digit OTP.");
        return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
        if (otpCode === "1234") {
            localStorage.setItem("student_session", JSON.stringify({
                token: "fake_token",
                expiry: new Date().getTime() + 86400000 
            }));
            setShowOtpModal(false);
            navigate('/dashboard');
        } else {
            setOtpError("Invalid OTP. Try 1234.");
            setIsOtpLoading(false);
        }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">
      
      {/* LOGO SECTION */}
      <div className="mb-10 transform scale-150">
        <Logo />
      </div>

      {/* REGISTRATION CARD */}
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">Join Golden Life to get started</p>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="firstName" placeholder="John"
                  value={formData.firstName} onChange={handleChange} disabled={isLoading}
                  className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="lastName" placeholder="Doe"
                  value={formData.lastName} onChange={handleChange} disabled={isLoading}
                  className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email" type="email" placeholder="example@email.com"
                  value={formData.email} onChange={handleChange} disabled={isLoading}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  name="phone" type="tel" placeholder="01XXXXXXXXX"
                  value={formData.phone} onChange={handleChange} disabled={isLoading}
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Referral Code</label>
              <input
                name="referCode" type="text" placeholder="Required referral code"
                value={formData.referCode} onChange={handleChange} disabled={isLoading}
                className={`w-full px-4 py-3 border ${errors.referCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
              />
              {errors.referCode && <p className="text-xs text-red-500">{errors.referCode}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={formData.password} onChange={handleChange} disabled={isLoading}
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}
                    className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00]`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox" name="acceptTerms"
                checked={formData.acceptTerms} onChange={handleChange}
                className="mt-1 h-4 w-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
              />
              <label className="text-sm text-gray-600">I accept Terms & Conditions</label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>

            <p className="text-center text-gray-600">
              Already have an account? <Link to="/login" className="text-[#FF8A00] font-bold hover:underline">Login here</Link>
            </p>
          </form>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 text-center">Verify OTP</h2>
            <p className="text-gray-500 text-center mt-2 text-sm">Code sent to {formData.phone} <br/> <span className="text-orange-500 font-bold">(Use 1234)</span></p>
            {otpError && <div className="mt-4 bg-red-50 text-red-600 p-2 rounded text-center text-sm">{otpError}</div>}
            <div className="flex justify-center gap-3 my-8">
              {otp.map((data, index) => (
                <input
                  key={index} type="text" maxLength={1}
                  ref={el => otpInputRefs.current[index] = el}
                  value={data} onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF8A00] outline-none"
                />
              ))}
            </div>
            <button onClick={handleOtpSubmit} disabled={isOtpLoading} className="w-full bg-[#FF8A00] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95">
              {isOtpLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;