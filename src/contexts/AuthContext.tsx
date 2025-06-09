import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/index';
import { localStorage } from '../utils';
import { validateUserCredentials, getUserWithoutPassword } from '../data';

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

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getUser();
      if (storedUser) {
        setUser(storedUser as User);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const validatedUser = validateUserCredentials(email, password);
      
      if (validatedUser) {
        const userWithoutPassword = getUserWithoutPassword(validatedUser);
        
        localStorage.setUser(userWithoutPassword);
        localStorage.setToken(`token_${validatedUser.id}_${Date.now()}`);
        
        setUser(userWithoutPassword as User);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const userWithoutPassword = getUserWithoutPassword(newUser);
      localStorage.setUser(userWithoutPassword);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
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