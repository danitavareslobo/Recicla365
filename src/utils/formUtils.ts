import type { CollectionPointFormData, WasteType } from '../types';

export class FormUtils {
  static cleanFormData(data: CollectionPointFormData): CollectionPointFormData {
    return {
      name: data.name.trim(),
      description: data.description.trim(),
      cep: data.cep.replace(/\D/g, ''),
      street: data.street.trim(),
      number: data.number.trim(),
      complement: data.complement?.trim() || '',
      neighborhood: data.neighborhood.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      latitude: data.latitude.trim(),
      longitude: data.longitude.trim(),
      acceptedWastes: [...data.acceptedWastes], 
    };
  }

  static isFormDirty(
    current: CollectionPointFormData,
    initial: CollectionPointFormData
  ): boolean {
    const currentClean = this.cleanFormData(current);
    const initialClean = this.cleanFormData(initial);

    return JSON.stringify(currentClean) !== JSON.stringify(initialClean);
  }

  static generateSampleData(): CollectionPointFormData {
    return {
      name: 'EcoPonto Exemplo',
      description: 'Ponto de coleta de exemplo para testes do sistema. Aceita diversos tipos de materiais recicláveis.',
      cep: '89201-000',
      street: 'Rua do Príncipe',
      number: '1234',
      complement: 'Próximo ao terminal',
      neighborhood: 'Centro',
      city: 'Joinville',
      state: 'Santa Catarina - SC',
      latitude: '-26.3044',
      longitude: '-48.8487',
      acceptedWastes: ['Papel', 'Plástico', 'Vidro', 'Metal'],
    };
  }

  static validateCoordinates(lat: string, lng: string): {
    isValid: boolean;
    errors: { latitude?: string; longitude?: string };
  } {
    const errors: { latitude?: string; longitude?: string } = {};
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = 'Latitude deve estar entre -90 e 90';
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = 'Longitude deve estar entre -180 e 180';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static formatWasteList(wastes: WasteType[]): string {
    if (wastes.length === 0) return 'Nenhum tipo selecionado';
    if (wastes.length === 1) return wastes[0];
    if (wastes.length === 2) return `${wastes[0]} e ${wastes[1]}`;
    
    const last = wastes[wastes.length - 1];
    const others = wastes.slice(0, -1);
    return `${others.join(', ')} e ${last}`;
  }

  static calculateProgress(data: CollectionPointFormData): {
    percentage: number;
    completed: number;
    total: number;
  } {
    const requiredFields = [
      'name', 'description', 'cep', 'street', 'number',
      'neighborhood', 'city', 'state', 'latitude', 'longitude'
    ];

    const completed = requiredFields.filter(field => {
      const value = data[field as keyof CollectionPointFormData];
      return typeof value === 'string' && value.trim().length > 0;
    }).length + (data.acceptedWastes.length > 0 ? 1 : 0);

    const total = requiredFields.length + 1; 

    return {
      percentage: Math.round((completed / total) * 100),
      completed,
      total,
    };
  }

  static detectRegionByCep(cep: string): {
    region: string;
    state: string;
    timeZone: string;
  } {
    const cleanCep = cep.replace(/\D/g, '');
    const firstDigit = parseInt(cleanCep.charAt(0));

    const regions = {
      0: { region: 'São Paulo (SP)', state: 'SP', timeZone: 'America/Sao_Paulo' },
      1: { region: 'São Paulo (SP)', state: 'SP', timeZone: 'America/Sao_Paulo' },
      2: { region: 'Rio de Janeiro e Espírito Santo', state: 'RJ', timeZone: 'America/Sao_Paulo' },
      3: { region: 'Minas Gerais', state: 'MG', timeZone: 'America/Sao_Paulo' },
      4: { region: 'Bahia e Sergipe', state: 'BA', timeZone: 'America/Bahia' },
      5: { region: 'Paraná', state: 'PR', timeZone: 'America/Sao_Paulo' },
      6: { region: 'Pernambuco, Paraíba, Rio Grande do Norte e Alagoas', state: 'PE', timeZone: 'America/Recife' },
      7: { region: 'Ceará e Piauí', state: 'CE', timeZone: 'America/Fortaleza' },
      8: { region: 'Rio Grande do Sul', state: 'RS', timeZone: 'America/Sao_Paulo' },
      9: { region: 'Goiás, Tocantins, Maranhão, Pará, Amazonas, Roraima, Amapá e Acre', state: 'GO', timeZone: 'America/Sao_Paulo' },
    };

    return regions[firstDigit as keyof typeof regions] || 
           { region: 'Região não identificada', state: 'BR', timeZone: 'America/Sao_Paulo' };
  }

  static generateNameSuggestions(city: string, neighborhood: string): string[] {
    const suggestions: string[] = [];
    
    if (city) {
      suggestions.push(`EcoPonto ${city}`);
      suggestions.push(`Recicla ${city}`);
      suggestions.push(`Coleta ${city}`);
    }

    if (neighborhood) {
      suggestions.push(`EcoPonto ${neighborhood}`);
      suggestions.push(`Recicla ${neighborhood}`);
      suggestions.push(`Verde ${neighborhood}`);
    }

    if (city && neighborhood) {
      suggestions.push(`EcoPonto ${neighborhood} - ${city}`);
      suggestions.push(`${neighborhood} Recicla`);
    }

    return [...new Set(suggestions)];
  }

  static validateName(name: string): {
    isValid: boolean;
    suggestions: string[];
    issues: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (name.length < 3) {
      issues.push('Nome muito curto');
    }

    if (name.length > 100) {
      issues.push('Nome muito longo');
    }

    if (!/^[a-zA-ZÀ-ÿ0-9\s\-_]+$/.test(name)) {
      issues.push('Contém caracteres especiais não permitidos');
    }

    if (name.toLowerCase().includes('teste') || name.toLowerCase().includes('exemplo')) {
      issues.push('Evite usar palavras como "teste" ou "exemplo"');
      suggestions.push('Use um nome descritivo e real');
    }

    if (!name.toLowerCase().includes('eco') && !name.toLowerCase().includes('recicla') && !name.toLowerCase().includes('verde')) {
      suggestions.push('Considere usar palavras como "EcoPonto", "Recicla" ou "Verde"');
    }

    return {
      isValid: issues.length === 0,
      suggestions,
      issues,
    };
  }
}