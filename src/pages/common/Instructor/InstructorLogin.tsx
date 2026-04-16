import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import { useInstructorOtp } from './hooks/useInstructorOtp';
import MobileOTPTab from './components/MobileOTPTab';
import EmailPasswordTab from './components/EmailPasswordTab';
import InstructorForgotPasswordModal from './components/InstructorForgotPasswordModal';
import InstructorLoginRightSideContent from './components/InstructorLoginRightSideContent';


type ActiveTab = 'mobile' | 'email';

const InstructorLogin: React.FC = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('mobile');

  // Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Hook
  const { sendOtp, verifyOtp } = useInstructorOtp();

  // Handle Send OTP (Mobile Tab)
  const handleSendOtp = async (mobile: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendOtp(mobile, 'mobile');

      if (!response.success) {
        throw new Error(response.message || 'Failed to send OTP');
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP (Mobile Tab)
  const handleVerifyOtp = async (otpCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOtp(otpCode);

      if (!response.success || !response.token) {
        throw new Error('Invalid OTP or no token received');
      }

      // Store auth token
      handleAuthSuccess(response.token);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseURL}/api/instructor/login`, {
        email,
        password,
      });

      if (!response.data.token) {
        throw new Error('No token received');
      }

      // Store auth token
      handleAuthSuccess(response.data.token);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Successful Authentication
  const handleAuthSuccess = (token: string) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

    // Store in sessionStorage
    sessionStorage.setItem('instructor_session', JSON.stringify({
      token: token,
      isVerified: true,
      expiry: expirationDate.getTime()
    }));

    // Store in cookies
    document.cookie = `instructor_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;

    // Redirect to instructor dashboard
    navigate('/instructor/dashboard');
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row shadow-2xl overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center bg-gray-50/50 p-4 lg:py-16 md:py-12 py-8 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Navigation Bar */}
          <div className="w-full flex items-center justify-between mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="flex flex-col items-center">
              <Logo />

            </div>

            <div className="w-24 hidden md:block"></div> {/* Spacer for symmetry */}
          </div>

          {/* Main Card */}
          <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Instructor Login</h2>
              <p className="text-gray-500 text-sm mt-2">Access your instructor dashboard</p>
            </div>

            {/* Tabs */}
            <div className="mx-8 mb-6 flex bg-gray-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mobile');
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'mobile'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Mobile (OTP)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('email');
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'email'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Email (Password)
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-8 pb-10">
              {activeTab === 'mobile' ? (
                <MobileOTPTab
                  onSendOtp={handleSendOtp}
                  onVerifyOtp={handleVerifyOtp}
                  isLoading={isLoading}
                  error={error}
                  onSuccess={() => { }}
                />
              ) : (
                <EmailPasswordTab
                  onLogin={handleEmailLogin}
                  isLoading={isLoading}
                  error={error}
                  onForgotPassword={handleForgotPassword}
                />
              )}

              {/* Registration Link */}
              <p className="text-center text-gray-600 pt-6 mt-8 border-t border-gray-100">
                Don't have an instructor account?{' '}
                <Link
                  to="/instructor/register"
                  className="text-[#FF8A00] font-bold hover:underline"
                >
                  Apply Now
                </Link>
              </p>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <Link
                  to="/vendor/login"
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <span>Are you a vendor ?</span>
                  <span className="text-[#FF8A00] font-bold">vendor here</span>
                  <svg
                    className="w-4 h-4 text-[#FF8A00] transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          <InstructorForgotPasswordModal
            isOpen={showForgotPassword}
            onClose={handleCloseForgotPassword}
          />
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <InstructorLoginRightSideContent />
    </div>
  );

};

export default InstructorLogin;
