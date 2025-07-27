// app/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import {
  User,
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  EmailVerificationRequest,
  PasswordResetConfirm,
  AuthError,
} from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  profile: User | null;
  profileLoading: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  confirmPasswordReset: (data: PasswordResetConfirm) => Promise<void>;
  verifyEmail: (data: EmailVerificationRequest) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    profile: null,
    profileLoading: false,
  });

  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const clearError = () => {
    updateState({ error: null });
  };

  const setError = (error: AuthError) => {
    updateState({ error, isLoading: false });
  };

  const setLoading = (isLoading: boolean) => {
    updateState({ isLoading });
  };

  /**
   * Check if user is authenticated by verifying stored tokens
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      const [accessToken, userStr] = await AsyncStorage.multiGet([
        'access_token',
        'user_data',
      ]);
      
      const token = accessToken[1];
      const userData = userStr[1];
      
      if (token && userData) {
        const user = JSON.parse(userData);
        updateState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  /**
   * Store user data and tokens
   */
  const storeAuthData = async (user: User, access: string, refresh: string) => {
    await AsyncStorage.multiSet([
      ['access_token', access],
      ['refresh_token', refresh],
      ['user_data', JSON.stringify(user)],
    ]);
    
    updateState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  /**
   * Clear stored auth data
   */
  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
      'access_token',
      'refresh_token',
      'user_data',
    ]);
    
    updateState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await authService.login(credentials);
      
      // Check if user type matches selected role
      const savedRole = await AsyncStorage.getItem('selected_role');
      if (savedRole && savedRole !== response.user.user_type) {
        throw {
          message: `This account is registered as a ${response.user.user_type}.`,
          code: 'USER_TYPE_MISMATCH',
          user: response.user,
        };
      }
      
      await storeAuthData(response.user, response.access, response.refresh);
      
      // Navigate based on user type
      if (response.user.user_type === 'therapist') {
        router.push('../therapist/dashboard');
      } else {
        router.push('../patient/dashboard');
      }
    } catch (error) {
      setError(error as AuthError);
    }
  };

  /**
   * Register user
   */
  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      clearError();

      console.log('[useAuth] Register called with:', userData);

      await authService.register(userData);

      updateState({ isLoading: false });

      // Navigate to verification screen
      console.log('[useAuth] Registration successful, navigating to verify-email');
      router.push('./verify-email');
    } catch (error) {
      console.log('[useAuth] Registration error:', error);
      setError(error as AuthError);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      await authService.logout();
      await clearAuthData();
      
      router.push('../auth/login');
    } catch (error) {
      // Even if logout fails, clear local data
      await clearAuthData();
      router.push('../auth/login');
    }
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (data: PasswordResetRequest) => {
    try {
      setLoading(true);
      clearError();
      
      await authService.requestPasswordReset(data);
      
      updateState({ isLoading: false });
    } catch (error) {
      setError(error as AuthError);
    }
  };

  /**
   * Confirm password reset
   */
  const confirmPasswordReset = async (data: PasswordResetConfirm) => {
    try {
      setLoading(true);
      clearError();
      
      await authService.confirmPasswordReset(data);
      
      updateState({ isLoading: false });
      
      // Navigate to login after successful reset
      router.push('./login');
    } catch (error) {
      setError(error as AuthError);
    }
  };

  /**
   * Verify email
   */
  const verifyEmail = async (data: EmailVerificationRequest) => {
    try {
      setLoading(true);
      clearError();
      
      await authService.verifyEmail(data);
      
      updateState({ isLoading: false });
      
      // Navigate to login after successful verification
      router.push('./login');
    } catch (error) {
      setError(error as AuthError);
    }
  };

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    try {
      updateState({ profileLoading: true });
      
      const profile = await profileService.getProfile();
      
      
      updateState({ 
        profile, 
        user:profile,
        profileLoading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      updateState({ 
        profileLoading: false,
        error: error as AuthError 
      });
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      updateState({ profileLoading: true });
      
      const updatedProfile = await profileService.updateProfile(profileData);
      
      updateState({ 
        profile: updatedProfile,
        user: updatedProfile, // Also update the user state
        profileLoading: false,
        error: null 
      });
    } catch (error) {
      updateState({ 
        profileLoading: false,
        error: error as AuthError 
      });
    }
  };

  // Check auth status on hook initialization
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    verifyEmail,
    clearError,
    checkAuthStatus,
    fetchProfile,
    updateProfile,
  };
};