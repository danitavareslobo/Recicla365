import type { CollectionPoint, CollectionPointFormData, Address } from '../types';

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

export class CollectionPointService {
  private static readonly STORAGE_KEY = '@recicla365:collection-points';

  static async createCollectionPoint(
    formData: CollectionPointFormData, 
    userId: string
  ): Promise<CollectionPoint> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newCollectionPoint: CollectionPoint = {
      id: this.generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      userId,
      address: {
        cep: formData.cep,
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement?.trim() || undefined,
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        uf: this.extractUfFromState(formData.state),
      },
      coordinates: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      acceptedWastes: formData.acceptedWastes,
      createdAt: new Date().toISOString(),
    };

    this.saveToStorage(newCollectionPoint);

    return newCollectionPoint;
  }

  static async updateCollectionPoint(
    id: string,
    formData: CollectionPointFormData,
    userId: string
  ): Promise<CollectionPoint> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existingPoints = this.getFromStorage();
    const pointIndex = existingPoints.findIndex(point => point.id === id);

    if (pointIndex === -1) {
      throw new Error('Ponto de coleta não encontrado');
    }

    const existingPoint = existingPoints[pointIndex];

    if (existingPoint.userId !== userId) {
      throw new Error('Você não tem permissão para editar este ponto de coleta');
    }

    const updatedPoint: CollectionPoint = {
      ...existingPoint,
      name: formData.name.trim(),
      description: formData.description.trim(),
      address: {
        cep: formData.cep,
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement?.trim() || undefined,
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        uf: this.extractUfFromState(formData.state),
      },
      coordinates: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      acceptedWastes: formData.acceptedWastes,
    };

    existingPoints[pointIndex] = updatedPoint;
    this.saveAllToStorage(existingPoints);

    return updatedPoint;
  }

  static async getCollectionPointById(id: string): Promise<CollectionPoint | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const points = this.getFromStorage();
    return points.find(point => point.id === id) || null;
  }

  static async getUserCollectionPoints(userId: string): Promise<CollectionPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const points = this.getFromStorage();
    return points.filter(point => point.userId === userId);
  }

  static async getAllCollectionPoints(): Promise<CollectionPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return this.getFromStorage();
  }

  static async deleteCollectionPoint(id: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const points = this.getFromStorage();
    const pointIndex = points.findIndex(point => point.id === id);

    if (pointIndex === -1) {
      throw new Error('Ponto de coleta não encontrado');
    }

    const point = points[pointIndex];

    if (point.userId !== userId) {
      throw new Error('Você não tem permissão para deletar este ponto de coleta');
    }

    points.splice(pointIndex, 1);
    this.saveAllToStorage(points);
  }

  static async searchCollectionPoints(query: string): Promise<CollectionPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const points = this.getFromStorage();
    const lowercaseQuery = query.toLowerCase().trim();

    if (!lowercaseQuery) {
      return points;
    }

    return points.filter(point =>
      point.name.toLowerCase().includes(lowercaseQuery) ||
      point.description.toLowerCase().includes(lowercaseQuery) ||
      point.address.neighborhood.toLowerCase().includes(lowercaseQuery) ||
      point.address.city.toLowerCase().includes(lowercaseQuery) ||
      point.acceptedWastes.some(waste => 
        waste.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  private static getFromStorage(): CollectionPoint[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler pontos de coleta do localStorage:', error);
      return [];
    }
  }

  private static saveToStorage(point: CollectionPoint): void {
    try {
      const existing = this.getFromStorage();
      existing.push(point);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Erro ao salvar ponto de coleta no localStorage:', error);
      throw new Error('Erro ao salvar dados. Verifique o espaço disponível.');
    }
  }

  private static saveAllToStorage(points: CollectionPoint[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
    } catch (error) {
      console.error('Erro ao salvar pontos de coleta no localStorage:', error);
      throw new Error('Erro ao salvar dados. Verifique o espaço disponível.');
    }
  }

  private static generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `cp_${timestamp}_${random}`;
  }

  private static extractUfFromState(state: string): string {
    const match = state.match(/\b([A-Z]{2})\b$/);
    if (match) {
      return match[1];
    }

    const stateMap: Record<string, string> = {
      'Santa Catarina': 'SC',
      'São Paulo': 'SP',
      'Rio de Janeiro': 'RJ',
      'Minas Gerais': 'MG',
      'Paraná': 'PR',
      'Rio Grande do Sul': 'RS',
      'Bahia': 'BA',
      'Goiás': 'GO',
      'Espírito Santo': 'ES',
      'Mato Grosso': 'MT',
      'Mato Grosso do Sul': 'MS',
      'Distrito Federal': 'DF',
      'Ceará': 'CE',
      'Pernambuco': 'PE',
      'Pará': 'PA',
      'Amazonas': 'AM',
      'Maranhão': 'MA',
      'Paraíba': 'PB',
      'Alagoas': 'AL',
      'Sergipe': 'SE',
      'Rio Grande do Norte': 'RN',
      'Piauí': 'PI',
      'Rondônia': 'RO',
      'Acre': 'AC',
      'Amapá': 'AP',
      'Roraima': 'RR',
      'Tocantins': 'TO',
    };

    return stateMap[state.trim()] || 'SC';
  }

  static async validateUniquePoint(
    formData: CollectionPointFormData,
    excludeId?: string
  ): Promise<{ isValid: boolean; message?: string }> {
    const points = this.getFromStorage();
    
    const duplicate = points.find(point => {
      if (excludeId && point.id === excludeId) {
        return false; 
      }

      const nameMatch = point.name.toLowerCase() === formData.name.toLowerCase().trim();
      
      const addressMatch = 
        point.address.cep === formData.cep &&
        point.address.street.toLowerCase() === formData.street.toLowerCase().trim() &&
        point.address.number === formData.number.trim();

      return nameMatch || addressMatch;
    });

    if (duplicate) {
      const isDuplicateName = duplicate.name.toLowerCase() === formData.name.toLowerCase().trim();
      const message = isDuplicateName 
        ? 'Já existe um ponto de coleta com este nome'
        : 'Já existe um ponto de coleta neste endereço';
      
      return { isValid: false, message };
    }

    return { isValid: true };
  }

  static getStatistics(): {
    total: number;
    byWasteType: Record<string, number>;
    byCity: Record<string, number>;
    recent: number;
  } {
    const points = this.getFromStorage();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byWasteType: Record<string, number> = {};
    const byCity: Record<string, number> = {};

    points.forEach(point => {
      point.acceptedWastes.forEach(waste => {
        byWasteType[waste] = (byWasteType[waste] || 0) + 1;
      });

      byCity[point.address.city] = (byCity[point.address.city] || 0) + 1;
    });

    const recent = points.filter(point => 
      new Date(point.createdAt) >= sevenDaysAgo
    ).length;

    return {
      total: points.length,
      byWasteType,
      byCity,
      recent,
    };
  }
}