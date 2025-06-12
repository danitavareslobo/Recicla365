import type { User } from './index';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  cpf: string;
  gender: 'M' | 'F' | 'Outro';
  birthDate: string;
  password: string;
  confirmPassword: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface RegistrationData extends Omit<RegisterFormData, 'confirmPassword'> {}

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormErrors;
  firstErrorField?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  cpf: string;
  gender: 'M' | 'F' | 'Outro';
  birthDate: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ProfileFormProps {
  onUpdateSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}