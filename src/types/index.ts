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

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
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

export type Theme = 'light' | 'dark';

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