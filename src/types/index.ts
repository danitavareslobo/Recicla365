export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  gender: 'M' | 'F' | 'Outro';
  birthDate: string;
  password: string;
  address: Address;
  createdAt: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  uf: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  description: string;
  userId: string;
  address: Address;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  acceptedWastes: WasteType[];
  createdAt: string;
}

export type WasteType = 
  | 'Vidro'
  | 'Metal'
  | 'Papel'
  | 'Plástico'
  | 'Orgânico'
  | 'Baterias'
  | 'Eletrônicos'
  | 'Óleo';

export type Theme = 'light' | 'dark';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface CreateCollectionPointData {
  name: string;
  description: string;
  userId: string;
  address: Address;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  acceptedWastes: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ValidationErrors;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}

export interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

export interface CollectionPointFormData {
  name: string;
  description: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  acceptedWastes: WasteType[];
}

export interface WasteTypeOption {
  value: WasteType;
  label: string;
  color: string;
}

export interface FormProgress {
  percentage: number;
  completed: number;
  total: number;
  missingFields: string[];
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  isAuthenticated: boolean;
}

export * from './component';
export * from './form';