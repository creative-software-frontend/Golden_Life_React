import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import OtpVerificationModal from './components/OtpVerificationModal';
import ResetPasswordForm from './components/ResetPasswordForm';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'mobile' | 'otp' | 'reset';

const ForgotPassword = ({ isOpen, onClose }: ForgotPasswordProps) => {
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setStep('mobile');
    setMobile('');
    setUserId(null);
    onClose();
  };

  const handleSendOtpSuccess = (userMobile: string, userId: number) => {
    setMobile(userMobile);
    setUserId(userId);
    setStep('otp');
  };

  const handleOtpVerifySuccess = () => {
    setStep('reset');
  };

  const handleResetPasswordSuccess = () => {
    handleClose();
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop - Fixed overlay
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  {step === 'mobile' && 'Forgot Password'}
                  {step === 'otp' && 'Verify OTP'}
                  {step === 'reset' && 'Reset Password'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === 'mobile' && (
                  <ForgotPasswordModal
                    onSendOtpSuccess={handleSendOtpSuccess}
                    onClose={handleClose}
                  />
                )}

                {step === 'otp' && (
                  <OtpVerificationModal
                    mobile={mobile}
                    userId={userId}
                    onVerifySuccess={handleOtpVerifySuccess}
                    onBack={() => setStep('mobile')}
                  />
                )}

                {step === 'reset' && (
                  <ResetPasswordForm
                    mobile={mobile}
                    onResetSuccess={handleResetPasswordSuccess}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPassword;
