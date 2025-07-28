// app/components/auth/reset-confirm.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { validatePasswordField } from '../../utils/validation';
import { AUTH_MESSAGES } from '../../constants/messages';

export default function ResetConfirmScreen() {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const { confirmPasswordReset, isLoading, error, clearError } = useAuth();

  const handleReset = async () => {
    // Validate password
    const passwordValidation = validatePasswordField(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message || 'Invalid password');
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (!token || typeof token !== 'string') {
      Alert.alert('❌ Error', 'Invalid reset token');
      return;
    }

    try {
      await confirmPasswordReset({ 
        token: token, 
        new_password: password 
      });
      Alert.alert(
        '✅ Success',
        AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
        [{ text: 'OK', onPress: () => router.push('./login') }]
      );
    } catch (err) {
      Alert.alert('❌ Error', error?.message || 'Error resetting password');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(null);
    }
    if (error) {
      clearError();
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError(null);
    }
    if (error) {
      clearError();
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Reset Your Password</Text>
          
          <Image
            source={require('../../../assets/images/reset1.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Please choose a new secure password</Text>

          {(error || passwordError || confirmPasswordError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {passwordError || confirmPasswordError || error?.message}
              </Text>
            </View>
          )}

          <Text style={styles.inputLabel}>Enter new password</Text>
          <View style={[styles.inputBox, passwordError && styles.inputBoxError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#524f85" />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handlePasswordChange}
              value={password}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <Text style={styles.inputLabel}>Confirm new password</Text>
          <View style={[styles.inputBox, confirmPasswordError && styles.inputBoxError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#524f85" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handleConfirmPasswordChange}
              value={confirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]} 
            onPress={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('./login')}
            disabled={isLoading}
            style={styles.linkButton}
          >
            <Text style={[styles.linkText, isLoading && styles.linkTextDisabled]}>
              ← Back to Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#524f85',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    width: '100%',
    height: 50,
  },
  inputBoxError: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
    minHeight: 48,
  },
  resetButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#524f85',
    fontSize: 16,
  },
  linkTextDisabled: {
    color: '#9e9e9e',
  },
});
