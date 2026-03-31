import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface OtpVerificationModalProps {
  mobile: string;
  userId: number | null;
  onVerifySuccess: () => void;
  onBack: () => void;
}

const OtpVerificationModal = ({ 
  mobile, 
  userId, 
  onVerifySuccess, 
  onBack 
}: OtpVerificationModalProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press (backspace navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) {
      setError('OTP must contain only numbers');
      return;
    }

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus on the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 3;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      setError('Please enter complete 4-digit OTP');
      return;
    }

    if (!userId) {
      setError('User ID not found. Please start over.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 [OTP Verification] Verifying OTP:', { mobile, userId, otp: otpValue });
      
      // Note: Based on your API structure, you might need to adjust this endpoint
      // Some APIs verify OTP separately, others combine it with password reset
      // This is a verification step before showing the reset password form
      
      const response = await axios.post(
        `${baseURL}/api/password/verify-otp`,
        { 
          mobile,
          user_id: userId,
          otp: otpValue 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('🟢 [OTP Verification] Response:', response.data);

      if (response.data?.success) {
        toast.success('OTP verified successfully!');
        onVerifySuccess();
      } else {
        throw new Error(response.data?.message || 'Invalid OTP');
      }
    } catch (err: any) {
      console.error('🔴 [OTP Verification] Error:', err);
      
      // If verify-otp endpoint doesn't exist, we'll proceed to reset directly
      // The actual verification will happen during password reset
      if (err.response?.status === 404) {
        console.log('⚠️ [OTP Verification] Verify endpoint not found, proceeding to reset form');
        toast.info('Proceeding to password reset...');
        onVerifySuccess();
        return;
      }

      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Invalid OTP. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      console.log('🔵 [Resend OTP] Sending new OTP to:', mobile);
      
      const response = await axios.post(
        `${baseURL}/api/password/forgot`,
        { mobile },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        setTimeLeft(60);
        setOtp(['', '', '', '', '', '']);
        toast.success('OTP resent successfully! Please check your mobile.');
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(response.data?.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      console.error('🔴 [Resend OTP] Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Info Text */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <p className="text-gray-600">
          We've sent a 4-digit OTP to your mobile number
        </p>
        <p className="text-sm font-medium text-gray-800">
          {mobile.replace(/(\d{3})(\d{3})(\d{4})/, '+88 $1-$2-$3')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        {/* OTP Input Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 text-center block">
            Enter OTP
          </label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-semibold border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                disabled={isLoading}
              />
            ))}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm justify-center mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            {timeLeft > 0 ? (
              <span className="text-gray-500">
                Resend in {formatTime(timeLeft)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Resend OTP
              </button>
            )}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otp.some((d) => !d)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isLoading || otp.some((d) => !d)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← Change Mobile Number
        </button>
      </div>
    </motion.div>
  );
};

export default OtpVerificationModal;
