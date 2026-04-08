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
  const [otp, setOtp] = useState(''); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setStep('mobile');
    setMobile('');
    setOtp('');
    onClose();
  };

  const handleSendOtpSuccess = (userMobile: string) => {
    setMobile(userMobile);
    setStep('otp');
  };

  const handleOtpVerifySuccess = (verifiedOtp: string) => {
    setOtp(verifiedOtp);
    setStep('reset');
  };

  const handleResetPasswordSuccess = () => {
    handleClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                    onVerifySuccess={handleOtpVerifySuccess}
                    onBack={() => setStep('mobile')}
                  />
                )}

                {step === 'reset' && (
                  <ResetPasswordForm
                    mobile={mobile}
                    otp={otp}
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