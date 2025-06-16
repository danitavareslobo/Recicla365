import type { ViaCepResponse } from '../types';

export class ViaCepService {
  private static readonly BASE_URL = 'https://viacep.com.br/ws';

  static async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    const cleanCep = this.cleanCep(cep);
    
    if (!this.isValidCep(cleanCep)) {
      throw new Error('CEP inválido');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP');
      }

      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar CEP');
    }
  }

  static cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  static isValidCep(cep: string): boolean {
    const cleanCep = this.cleanCep(cep);
    return /^\d{8}$/.test(cleanCep);
  }

  static formatCep(cep: string): string {
    const cleanCep = this.cleanCep(cep);
    if (cleanCep.length === 8) {
      return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    }
    return cep;
  }

  static maskCep(value: string): string {
    const cleanValue = this.cleanCep(value);
    
    if (cleanValue.length <= 5) {
      return cleanValue;
    }
    
    return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`;
  }
}