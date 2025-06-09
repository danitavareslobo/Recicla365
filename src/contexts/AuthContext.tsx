import React, { createContext, useContext, useState } from 'react';
import type { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'João da Silva',
        email: email,
        cpf: '123.456.789-00',
        gender: 'M',
        birthDate: '1990-01-01',
        password: '',
        address: {
          cep: '88000-000',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Florianópolis',
          state: 'Santa Catarina',
          uf: 'SC',
        },
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};