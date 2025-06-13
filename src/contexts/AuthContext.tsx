import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/index';
import { localStorage } from '../utils';
import { validateUserCredentials, getUserWithoutPassword, mockUsers } from '../data';
import { UserService } from '../services';

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
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await UserService.initializeWithMockData(mockUsers);
        
        const storedUser = localStorage.getUser();
        const storedToken = localStorage.getToken();
        
        if (storedUser && storedToken) {
          setUser(storedUser as User);
        } else {
          localStorage.clear();
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        localStorage.clear();
        setUser(null);
      } finally {
        setIsInitializing(false);
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
      }

      const registeredUsers = await UserService.getAllUsers();
      const registeredUser = registeredUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (registeredUser) {
        const userWithoutPassword = getUserWithoutPassword(registeredUser);
        
        localStorage.setUser(userWithoutPassword);
        localStorage.setToken(`token_${registeredUser.id}_${Date.now()}`);
        
        setUser(userWithoutPassword as User);
        return true;
      }

      return false;
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validation = await UserService.validateUniqueUser({
        cpf: userData.cpf,
        email: userData.email
      });

      if (!validation.isValid) {
        throw new Error(validation.message || 'Dados já cadastrados');
      }

      const mockUserExists = mockUsers.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase() || 
        user.cpf === userData.cpf
      );

      if (mockUserExists) {
      const emailExists = mockUsers.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      const cpfExists = mockUsers.some(user => user.cpf === userData.cpf);
      
      if (emailExists) {
        throw new Error('Email já cadastrado no sistema');
      }
      if (cpfExists) {
        throw new Error('CPF já cadastrado no sistema');
      }
    }

      const newUser = await UserService.createUser(userData);
      
      const userWithoutPassword = getUserWithoutPassword(newUser);
    localStorage.setUser(userWithoutPassword);
    localStorage.setToken(`token_${newUser.id}_${Date.now()}`);
    setUser(newUser);
    return true;
    
  } catch (error) {
    console.error('Erro no registro:', error);
    
    throw error;
  }
};

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
  if (!user?.id) {
    return false;
  }

  try {
    const updatedUser = await UserService.updateUser(user.id, userData);
    
    const userWithoutPassword = getUserWithoutPassword(updatedUser);
    localStorage.setUser(userWithoutPassword);
    setUser(updatedUser);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
};

  const isAuthenticated = !isInitializing && !!user;

  if (isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-primary, #f5f5f5)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'var(--text-primary, #333)' }}>Inicializando sistema...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateUser,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};