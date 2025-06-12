import type { User, UserStats, UserValidation } from '../types';

export class UserService {
  private static readonly STORAGE_KEY = '@ecopontos:registered_users';

  static async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.getFromStorage();
  }

  static async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const users = this.getFromStorage();
    return users.find(user => user.id === id) || null;
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUsers = this.getFromStorage();
    
    const cpfExists = existingUsers.some(user => user.cpf === userData.cpf);
    if (cpfExists) {
      throw new Error('CPF já cadastrado no sistema');
    }

    const emailExists = existingUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      throw new Error('Email já cadastrado no sistema');
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    this.saveToStorage(newUser);
    return newUser;
  }

  static async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = this.getFromStorage();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    if (userData.cpf) {
      const cpfExists = users.some(user => user.id !== id && user.cpf === userData.cpf);
      if (cpfExists) {
        throw new Error('CPF já cadastrado no sistema');
      }
    }

    if (userData.email) {
      const emailExists = users.some(user => 
        user.id !== id && user.email.toLowerCase() === userData.email!.toLowerCase()
      );
      if (emailExists) {
        throw new Error('Email já cadastrado no sistema');
      }
    }

    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    
    this.saveAllToStorage(users);
    return updatedUser;
  }

  static async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const users = this.getFromStorage();
    const filteredUsers = users.filter(user => user.id !== id);

    if (filteredUsers.length === users.length) {
      throw new Error('Usuário não encontrado');
    }

    this.saveAllToStorage(filteredUsers);
  }

  static async searchUsers(query: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = this.getFromStorage();
    const lowercaseQuery = query.toLowerCase().trim();

    if (!lowercaseQuery) {
      return users;
    }

    return users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.cpf.includes(query.replace(/\D/g, '')) ||
      user.address.city.toLowerCase().includes(lowercaseQuery)
    );
  }

  static async getUsersByCity(city: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 250));

    const users = this.getFromStorage();
    return users.filter(user => 
      user.address.city.toLowerCase() === city.toLowerCase()
    );
  }

  static async getRecentUsers(limit: number = 10): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const users = this.getFromStorage();
    return users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  static async getUserStats(): Promise<UserStats> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = this.getFromStorage();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate >= thirtyDaysAgo;
    });

    const uniqueCities = new Set(users.map(user => user.address.city));
    
    const genderDistribution = users.reduce((acc, user) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: users.length,
      recentCount: recentUsers.length,
      citiesCount: uniqueCities.size,
      genderDistribution,
      mockUsersCount: 0,
      registeredUsersCount: users.length,
    };
  }

  private static getFromStorage(): User[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler usuários do localStorage:', error);
      return [];
    }
  }

  private static saveToStorage(user: User): void {
    try {
      const existing = this.getFromStorage();
      existing.push(user);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Erro ao salvar usuário no localStorage:', error);
      throw new Error('Erro ao salvar dados. Verifique o espaço disponível.');
    }
  }

  private static saveAllToStorage(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuários no localStorage:', error);
      throw new Error('Erro ao salvar dados. Verifique o espaço disponível.');
    }
  }

  private static generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `user_${timestamp}_${random}`;
  }

  static async validateUniqueUser(
    userData: { cpf: string; email: string }, 
    excludeId?: string
  ): Promise<UserValidation> {
    const users = this.getFromStorage();
    
    const cpfDuplicate = users.find(user => {
      return user.cpf === userData.cpf && (!excludeId || user.id !== excludeId);
    });

    if (cpfDuplicate) {
      return {
        isValid: false,
        message: 'CPF já cadastrado no sistema',
        field: 'cpf'
      };
    }

    const emailDuplicate = users.find(user => {
      return user.email.toLowerCase() === userData.email.toLowerCase() && 
             (!excludeId || user.id !== excludeId);
    });

    if (emailDuplicate) {
      return {
        isValid: false,
        message: 'Email já cadastrado no sistema',
        field: 'email'
      };
    }

    return { isValid: true };
  }

  static async initializeWithMockData(mockUsers: User[]): Promise<void> {
    const existingUsers = this.getFromStorage();
    
    if (existingUsers.length === 0) {
      console.log('Inicializando sistema com dados mock...');
    } else {
      console.log(`Sistema já possui ${existingUsers.length} usuários cadastrados`);
    }
  }

  static async getRegisteredUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getFromStorage();
  }

  static async getTotalUsersCount(mockUsersCount: number): Promise<number> {
    const registeredUsers = await this.getRegisteredUsers();
    return mockUsersCount + registeredUsers.length;
  }
}