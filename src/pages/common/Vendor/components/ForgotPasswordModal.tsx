import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ForgotPasswordModalProps {
  onSendOtpSuccess: (mobile: string, userId: number) => void;
  onClose: () => void;
}

const ForgotPasswordModal = ({ onSendOtpSuccess, onClose }: ForgotPasswordModalProps) => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Clean and format mobile number - remove all non-digits
  const cleanMobile = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Validate mobile number (11 digits for Bangladesh)
  const validateMobile = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Must be exactly 11 digits starting with 01
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Clean mobile number - remove all non-digit characters
    const cleanedMobile = cleanMobile(mobile);

    // Validation
    if (!cleanedMobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (cleanedMobile.length !== 11) {
      setError('Mobile number must be 11 digits');
      return;
    }

    if (!validateMobile(cleanedMobile)) {
      setError('Please enter a valid mobile number (e.g., 01865847806)');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 [ForgotPassword] Sending OTP to:', cleanedMobile);
      
      const response = await axios.post(
        `${baseURL}/api/password/forgot`,
        { mobile: cleanedMobile }, // Send only digits, no +88 prefix
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('🟢 [ForgotPassword] API Response:', response.data);

      if (response.data?.success) {
        toast.success('OTP sent successfully! Please check your mobile.');
        onSendOtpSuccess(cleanedMobile, response.data.user_id);
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('🔴 [ForgotPassword] Error:', err);
      console.error('🔴 [ForgotPassword] Error Response:', err.response?.data);
      
      // Check for specific API validation errors
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err.response?.data?.message) {
        const apiMessage = err.response.data.message;
        
        // Handle mobile format validation error from API
        if (apiMessage.includes('format') || apiMessage.includes('invalid')) {
          errorMessage = 'Please enter a valid 11-digit mobile number (e.g., 01865847806)';
        } else if (apiMessage.includes('not found') || apiMessage.includes('exists')) {
          errorMessage = 'This mobile number is not registered';
        } else {
          errorMessage = apiMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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
    >
      <div className="space-y-4">
        {/* Info Text */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            Enter your mobile number and we'll send you an OTP to verify your identity.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          {/* Mobile Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  // Allow only digits, remove any non-digit characters
                  const cleanedValue = e.target.value.replace(/\D/g, '');
                  // Limit to 11 digits
                  if (cleanedValue.length <= 11) {
                    setMobile(cleanedValue);
                    if (error) setError(null);
                  }
                }}
                placeholder="018XXXXXXXX"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={11}
                className={`w-full pl-10 pr-4 py-3 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
                Sending OTP...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send OTP
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordModal;
