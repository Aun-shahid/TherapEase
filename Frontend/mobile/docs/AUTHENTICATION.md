# Authentication System Documentation

## Overview

This authentication system follows React Native best practices with a clean separation of concerns:

- **Services**: Handle API calls and business logic
- **Hooks**: Manage state and side effects
- **Types**: Define TypeScript interfaces
- **Utils**: Provide validation and helper functions
- **Constants**: Store reusable messages and values
- **Components**: Handle UI rendering only

## File Structure

```
app/
├── components/auth/           # Authentication UI components
│   ├── login.tsx
│   ├── register.tsx
│   ├── request-reset.tsx
│   ├── reset-confirm.tsx
│   └── verify-email.tsx
├── services/                  # API service layer
│   └── auth.service.ts
├── hooks/                     # Custom React hooks
│   └── useAuth.ts
├── types/                     # TypeScript interfaces
│   └── auth.ts
├── utils/                     # Utility functions
│   ├── api.ts                # Axios configuration with interceptors
│   └── validation.ts         # Input validation functions
├── constants/                 # Application constants
│   └── messages.ts
├── contexts/                  # React contexts
│   └── AuthContext.tsx
└── config.ts                 # Environment configuration
```

## Environment Configuration

The app reads the backend URL from environment variables:

1. **Development**: Set in `app.json` under `expo.extra.BACKEND_URL`
2. **Production**: Can be overridden by environment variables

```json
// app.json
{
  "expo": {
    "extra": {
      "BACKEND_URL": "http://192.168.1.8:8000"
    }
  }
}
```

## API Integration

### Axios Configuration (`utils/api.ts`)

- Automatic token attachment to requests
- Token refresh on 401 errors
- Centralized error handling
- Request/response interceptors

### Authentication Service (`services/auth.service.ts`)

Handles all authentication-related API calls:

- `login(credentials)`
- `register(userData)`
- `requestPasswordReset(data)`
- `confirmPasswordReset(data)`
- `verifyEmail(data)`
- `logout()`

## State Management

### useAuth Hook (`hooks/useAuth.ts`)

Manages authentication state and actions:

```typescript
const {
  user,
  isLoading,
  isAuthenticated,
  error,
  login,
  register,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  verifyEmail,
  clearError,
  checkAuthStatus,
} = useAuth();
```

### Auth Context (`contexts/AuthContext.tsx`)

Provides authentication state globally across the app:

```typescript
// Wrap your app
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
const auth = useAuthContext();
```

## Validation

### Input Validation (`utils/validation.ts`)

Provides validation functions for:

- Email format validation
- Password strength requirements
- Required field validation
- Token validation

```typescript
const emailValidation = validateEmailField(email);
if (!emailValidation.isValid) {
  setError(emailValidation.message);
}
```

## Error Handling

### Centralized Error Management

1. **Service Layer**: Catches and transforms API errors
2. **Hook Layer**: Manages error state
3. **Component Layer**: Displays user-friendly error messages

### Error Types

```typescript
interface AuthError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
```

## Usage Examples

### Login Component

```typescript
import { useAuth } from '../../hooks/useAuth';

const { login, isLoading, error } = useAuth();

const handleLogin = async () => {
  try {
    await login({ email, password });
    // Navigation handled by hook
  } catch (err) {
    // Error displayed by component
  }
};
```

### Password Reset Flow

1. User requests reset (`request-reset.tsx`)
2. Email sent with reset token
3. User clicks link, navigates to confirm screen (`reset-confirm.tsx`)
4. User enters new password
5. Password updated, user redirected to login

## Security Features

- Automatic token refresh
- Secure token storage (AsyncStorage)
- Input validation
- Error message sanitization
- HTTPS enforcement (production)

## Development Guidelines

### Adding New Auth Features

1. Add TypeScript interfaces in `types/auth.ts`
2. Implement API calls in `services/auth.service.ts`
3. Add state management in `hooks/useAuth.ts`
4. Create UI component following existing patterns
5. Add validation functions if needed
6. Update error messages in `constants/messages.ts`

### Component Structure

All auth components should follow this pattern:

```typescript
// 1. Imports
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// 2. Component with validation
export default function AuthComponent() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { authAction, isLoading, error } = useAuth();

  // 3. Event handlers with validation
  const handleSubmit = async () => {
    // Validate input
    // Call auth action
    // Handle success/error
  };

  // 4. UI with loading states and error display
  return (
    // Component JSX
  );
}
```

## Testing

### Unit Tests

- Service layer methods
- Validation functions
- Hook state management

### Integration Tests

- Complete auth flows
- Error handling scenarios
- Token refresh behavior

## Deployment

### Environment Variables

Ensure these are set in production:

- `BACKEND_URL`: Your API server URL

### Build Configuration

The app automatically handles environment differences through the config system.
