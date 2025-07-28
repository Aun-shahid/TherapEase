// app/utils/validation.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateToken = (token: string): boolean => {
  return token.trim().length > 0;
};

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateEmailField = (email: string): ValidationResult => {
  if (!validateRequired(email)) {
    return { isValid: false, message: 'Email is required.' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
};

export const validatePasswordField = (password: string): ValidationResult => {
  if (!validateRequired(password)) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (!validatePassword(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  return { isValid: true };
};

export const validateTokenField = (token: string): ValidationResult => {
  if (!validateToken(token)) {
    return { isValid: false, message: 'Verification token is required.' };
  }
  return { isValid: true };
};

export const validateUsernameField = (username: string): ValidationResult => {
  if (!validateRequired(username)) {
    return { isValid: false, message: 'Username is required.' };
  }
  if (username.trim().length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long.' };
  }
  return { isValid: true };
};

export const validateNameField = (name: string, fieldName: string): ValidationResult => {
  if (!validateRequired(name)) {
    return { isValid: false, message: `${fieldName} is required.` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long.` };
  }
  return { isValid: true };
};

export const validatePhoneField = (phone: string): ValidationResult => {
  if (!validateRequired(phone)) {
    return { isValid: false, message: 'Phone number is required.' };
  }
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number.' };
  }
  return { isValid: true };
};

export const validateDateOfBirthField = (date: string): ValidationResult => {
  if (!validateRequired(date)) {
    return { isValid: false, message: 'Date of birth is required.' };
  }
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (age < 13) {
    return { isValid: false, message: 'You must be at least 13 years old to register.' };
  }
  return { isValid: true };
};

export const validatePasswordConfirmField = (password: string, confirmPassword: string): ValidationResult => {
  if (!validateRequired(confirmPassword)) {
    return { isValid: false, message: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match.' };
  }
  return { isValid: true };
};

export const validateLicenseField = (license: string, isTherapist: boolean): ValidationResult => {
  if (isTherapist && !validateRequired(license)) {
    return { isValid: false, message: 'License number is required for therapists.' };
  }
  return { isValid: true };
};

export const validateSpecializationField = (specialization: string, isTherapist: boolean): ValidationResult => {
  if (isTherapist && !validateRequired(specialization)) {
    return { isValid: false, message: 'Specialization is required for therapists.' };
  }
  return { isValid: true };
};

export interface FormValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  password_confirm?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  license_number?: string;
  specialization?: string;
}

export const validateRegisterForm = (form: any): { isValid: boolean; errors: FormValidationErrors } => {
  const errors: FormValidationErrors = {};
  
  // Username validation
  const usernameValidation = validateUsernameField(form.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message;
  }
  
  // Email validation
  const emailValidation = validateEmailField(form.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Password validation
  const passwordValidation = validatePasswordField(form.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Password confirmation validation
  const passwordConfirmValidation = validatePasswordConfirmField(form.password, form.password_confirm);
  if (!passwordConfirmValidation.isValid) {
    errors.password_confirm = passwordConfirmValidation.message;
  }
  
  // First name validation
  const firstNameValidation = validateNameField(form.first_name, 'First name');
  if (!firstNameValidation.isValid) {
    errors.first_name = firstNameValidation.message;
  }
  
  // Last name validation
  const lastNameValidation = validateNameField(form.last_name, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.last_name = lastNameValidation.message;
  }
  
  // Phone validation
  const phoneValidation = validatePhoneField(form.phone_number);
  if (!phoneValidation.isValid) {
    errors.phone_number = phoneValidation.message;
  }
  
  // Date of birth validation
  const dateValidation = validateDateOfBirthField(form.date_of_birth);
  if (!dateValidation.isValid) {
    errors.date_of_birth = dateValidation.message;
  }
  
  // Therapist-specific validations
  const isTherapist = form.user_type === 'therapist';
  
  const licenseValidation = validateLicenseField(form.license_number, isTherapist);
  if (!licenseValidation.isValid) {
    errors.license_number = licenseValidation.message;
  }
  
  const specializationValidation = validateSpecializationField(form.specialization, isTherapist);
  if (!specializationValidation.isValid) {
    errors.specialization = specializationValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
