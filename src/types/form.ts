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