// app/constants/messages.ts

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
  REGISTER_SUCCESS: 'Registration successful! Please check your email to verify your account.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  EMAIL_SENT: 'Password reset email sent! Check your inbox.',
  EMAIL_SEND_FAILED: 'Could not send password reset email.',
  EMAIL_VERIFIED: 'Email verified successfully!',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed. Please try again.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_TOKEN: 'Please enter the verification token.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful! You can now log in with your new password.',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_TOKEN: 'Please enter a valid verification token.',
} as const;
