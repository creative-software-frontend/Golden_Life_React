# 🔐 Vendor Authentication - Complete Documentation

## 📋 Overview

Complete authentication system for Vendor Dashboard including Login, Forgot Password, Reset Password, and Logout functionality.

---

## 🎯 Features

### 1. **Login System**
- Email/password authentication
- Session management
- Token-based authentication

### 2. **Password Recovery**
✅ **Three-Step Process:**
1. **Mobile Number Input** - Send OTP to vendor's mobile
2. **OTP Verification** - Verify 6-digit OTP
3. **Password Reset** - Set new password

### 3. **Logout System**
✅ **Key Features:**
- API integration for secure logout
- Session cleanup
- Cookie clearing
- Toast notifications
- Redirect to login page

✅ **Key Features:**
- Mobile number validation (Bangladesh format)
- OTP countdown timer (60 seconds)
- OTP resend functionality
- Password strength validation
- Real-time error feedback
- Success toast notifications
- Smooth animations with Framer Motion
- Responsive design
- Loading states

---

## 📁 Files Created

```
src/pages/common/Vendor/
├── ForgotPassword.tsx                    # Main container component
├── components/
│   ├── ForgotPasswordModal.tsx           # Step 1: Mobile input + Send OTP
│   ├── OtpVerificationModal.tsx          # Step 2: OTP verification
│   ├── ResetPasswordForm.tsx             # Step 3: New password form
│   └── index.ts                          # Component exports
└── LoginForm.tsx                         # Updated with Forgot Password link

src/hooks/
└── useVendorAuth.ts                      # Authentication hook (logout, token management)

src/layout/VendorLayout/
├── Sidebar.tsx                           # Updated with logout functionality
└── Navbar.tsx                            # Updated with logout in profile dropdown
```

---

## 🔗 API Endpoints Used

### 1. Send OTP (Forgot Password)
```http
POST /api/password/forgot
Content-Type: application/json

{
  "mobile": "01865847806"
}
```

**Response:**
```json
{
  "success": true,
  "user_id": 123,
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP (Optional - Based on API availability)
```http
POST /api/password/verify-otp
Content-Type: application/json

{
  "mobile": "01865847806",
  "user_id": 123,
  "otp": "123456"
}
```

### 3. Reset Password
```http
POST /api/password/reset
Content-Type: application/json

{
  "mobile": "01865847806",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 4. Vendor Logout
```http
POST /api/vendor/logout
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🚀 Component Flow

```
VendorLogin.tsx
    ↓
LoginForm.tsx
    ↓ (Click "Forgot Password?")
ForgotPassword.tsx (Main Container)
    ↓
Step 1: ForgotPasswordModal.tsx
    - Enter mobile number
    - Click "Send OTP"
    - API: POST /api/password/forgot
    ↓
Step 2: OtpVerificationModal.tsx
    - Enter 6-digit OTP
    - Countdown timer (60s)
    - Resend OTP option
    - API: POST /api/password/verify-otp (if available)
    ↓
Step 3: ResetPasswordForm.tsx
    - Enter new password
    - Confirm password
    - API: POST /api/password/reset
    ↓
Success → Redirect to Login
```

---

## 💻 Usage Example

### In VendorLogin.tsx or any parent component:

```tsx
import ForgotPassword from './pages/common/Vendor/ForgotPassword';

function VendorLogin() {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  return (
    <div>
      {/* Your login form */}
      <button onClick={() => setIsForgotPasswordOpen(true)}>
        Forgot Password?
      </button>

      {/* Forgot Password Modal */}
      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
```

---

## 🎨 Component Props

### ForgotPassword.tsx
```typescript
interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### ForgotPasswordModal.tsx
```typescript
interface ForgotPasswordModalProps {
  onSendOtpSuccess: (mobile: string, userId: number) => void;
  onClose: () => void;
}
```

### OtpVerificationModal.tsx
```typescript
interface OtpVerificationModalProps {
  mobile: string;
  userId: number | null;
  onVerifySuccess: () => void;
  onBack: () => void;
}
```

### ResetPasswordForm.tsx
```typescript
interface ResetPasswordFormProps {
  mobile: string;
  onResetSuccess: () => void;
}
```

---

## ✅ Validation Rules

### Mobile Number
- Bangladesh format only
- **Must be exactly 11 digits** (e.g., 01865847806)
- Must start with `01` followed by 9 digits
- Input automatically filters non-digit characters
- API accepts: `01XXXXXXXXX` format (no +88 prefix)
- Examples: `01865847806`, `01712345678`

### Password
- Minimum 6 characters
- Must match confirmation password

### OTP
- Exactly 6 digits
- Numeric only
- Auto-focus next input field
- Paste support

---

## 🎯 Error Handling

All components include comprehensive error handling:

1. **Network Errors**: Caught and displayed to user
2. **API Errors**: Displayed from backend response
3. **Validation Errors**: Checked before API calls
4. **Session Errors**: User ID validation

---

## 🔄 State Management

Each component manages its own state:
- Loading states for async operations
- Error states with user-friendly messages
- Success states with toast notifications
- Form data with React useState

---

## 🎨 Styling

- **Tailwind CSS** for all styling
- **Framer Motion** for smooth animations
- **Lucide Icons** for iconography
- **Responsive design** (mobile-first approach)
- **Primary color**: Orange (`bg-primary`, `text-primary`)

---

## 📱 Responsive Features

- Mobile-optimized modal size
- Touch-friendly input fields
- Adaptive layout for different screen sizes
- Proper z-index for modals (z-50)

---

## 🔒 Security Features

1. **Client-side validation** before API calls
2. **Password confirmation** to prevent typos
3. **OTP expiration** (60 seconds countdown)
4. **Session-based** authentication flow
5. **No sensitive data** in localStorage

---

## 🧪 Testing Checklist

- [ ] Send OTP with valid mobile number
- [ ] Send OTP with invalid mobile number
- [ ] OTP verification with correct OTP
- [ ] OTP verification with incorrect OTP
- [ ] OTP resend functionality
- [ ] Password reset with valid data
- [ ] Password reset with mismatched passwords
- [ ] Password reset with weak password
- [ ] Modal close and reopen behavior
- [ ] Back button navigation
- [ ] Network error handling
- [ ] Loading states during API calls

---

## 🛠️ Customization Options

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color' // Currently using orange-600
    }
  }
}
```

### Change OTP Length
In `OtpVerificationModal.tsx`:
```typescript
// Change from 6 to 4 digits
const [otp, setOtp] = useState(['', '', '', '']); // 4 digits
```

### Change Countdown Timer
In `OtpVerificationModal.tsx`:
```typescript
const [timeLeft, setTimeLeft] = useState(120); // 120 seconds
```

---

## 🔓 Logout Implementation Details

### useVendorAuth Hook

The `useVendorAuth` hook provides centralized authentication management:

```typescript
import { useVendorAuth } from '@/hooks/useVendorAuth';

function MyComponent() {
  const { handleLogout, getAuthToken, isAuthenticated, getCurrentVendor } = useVendorAuth();
  
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

### Available Methods

1. **handleLogout** - Async function to logout vendor
   - Calls `/api/vendor/logout` API
   - Clears sessionStorage and cookies
   - Shows success toast
   - Redirects to `/vendor/login`

2. **getAuthToken** - Get current auth token from session
3. **isAuthenticated** - Check if vendor is logged in
4. **getCurrentVendor** - Get current vendor info from session

### Usage in Components

#### Sidebar.tsx Example:
```typescript
import { useVendorAuth } from '@/hooks/useVendorAuth';

const Sidebar = () => {
  const { handleLogout } = useVendorAuth();
  
  return (
    <button onClick={handleLogout}>
      <LogOut />
      Logout
    </button>
  );
};
```

#### Navbar.tsx Example:
```typescript
import { useVendorAuth } from '@/hooks/useVendorAuth';

const Navbar = () => {
  const { handleLogout } = useVendorAuth();
  
  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut />
      Logout
    </DropdownMenuItem>
  );
};
```

---

## 📝 Notes

1. **API Endpoint Flexibility**: The `/api/password/verify-otp` endpoint is optional. If not available in your backend, the component will proceed directly to the password reset form.

2. **Mobile Format**: The component automatically formats mobile numbers to international format (+88) before sending to API.

3. **Toast Notifications**: Uses `react-toastify` for notifications. Make sure it's configured in your app.

4. **Animations**: All transitions use Framer Motion for smooth, professional animations.

---

## 🐛 Common Issues & Solutions

### Issue: "The mobile field format is invalid" error
**Solution**: 
- Ensure mobile number is exactly 11 digits
- Remove any +88 or country code prefix
- Input should be in format: `01XXXXXXXXX`
- The component now automatically cleans input to digits only

### Issue: Modal not appearing centered

### Issue: Modal not opening
**Solution**: Check if `isOpen` prop is set correctly and parent component state is updating.

### Issue: API calls failing
**Solution**: Verify `VITE_API_BASE_URL` environment variable is set correctly.

### Issue: Toast notifications not showing
**Solution**: Ensure `react-toastify` is installed and `ToastContainer` is in your App.tsx.

### Issue: OTP inputs not auto-focusing
**Solution**: Check browser compatibility and ensure refs are properly initialized.

---

## 📦 Dependencies

Make sure these packages are installed:
```json
{
  "react": "^18.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "axios": "^1.x",
  "react-toastify": "^9.x"
}
```

---

## ✨ Next Steps

1. Test with actual API endpoints
2. Add unit tests for validation functions
3. Implement rate limiting on frontend
4. Add analytics tracking for password resets
5. Consider adding email as alternative to mobile

---

## 📞 Support

For issues or questions, check the component code comments for detailed inline documentation.

---

**Implementation Date**: March 31, 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready for Testing
