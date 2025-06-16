import type { CollectionPointFormData, ValidationErrors } from '../types';

export class ValidationService {
  static validateCollectionPointForm(data: CollectionPointFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Nome do local é obrigatório';
    } else if (data.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (data.name.trim().length > 100) {
      errors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!data.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    } else if (data.description.trim().length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    } else if (data.description.trim().length > 500) {
      errors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    if (!data.cep.trim()) {
      errors.cep = 'CEP é obrigatório';
    } else if (!this.isValidCep(data.cep)) {
      errors.cep = 'CEP deve ter 8 dígitos';
    }

    if (!data.street.trim()) {
      errors.street = 'Rua é obrigatória';
    } else if (data.street.trim().length < 3) {
      errors.street = 'Rua deve ter pelo menos 3 caracteres';
    } else if (data.street.trim().length > 100) {
      errors.street = 'Rua deve ter no máximo 100 caracteres';
    }

    if (!data.number.trim()) {
      errors.number = 'Número é obrigatório';
    } else if (!/^\d+[a-zA-Z]?$/.test(data.number.trim())) {
      errors.number = 'Número deve conter apenas dígitos e opcionalmente uma letra';
    }

    if (!data.neighborhood.trim()) {
      errors.neighborhood = 'Bairro é obrigatório';
    } else if (data.neighborhood.trim().length < 2) {
      errors.neighborhood = 'Bairro deve ter pelo menos 2 caracteres';
    } else if (data.neighborhood.trim().length > 50) {
      errors.neighborhood = 'Bairro deve ter no máximo 50 caracteres';
    }

    if (!data.city.trim()) {
      errors.city = 'Cidade é obrigatória';
    } else if (data.city.trim().length < 2) {
      errors.city = 'Cidade deve ter pelo menos 2 caracteres';
    } else if (data.city.trim().length > 50) {
      errors.city = 'Cidade deve ter no máximo 50 caracteres';
    }

    if (!data.state.trim()) {
      errors.state = 'Estado é obrigatório';
    } else if (data.state.trim().length < 2) {
      errors.state = 'Estado deve ter pelo menos 2 caracteres';
    }

    if (!data.latitude.trim()) {
      errors.latitude = 'Latitude é obrigatória';
    } else {
      const lat = parseFloat(data.latitude);
      if (isNaN(lat)) {
        errors.latitude = 'Latitude deve ser um número válido';
      } else if (lat < -90 || lat > 90) {
        errors.latitude = 'Latitude deve estar entre -90 e 90';
      }
    }

    if (!data.longitude.trim()) {
      errors.longitude = 'Longitude é obrigatória';
    } else {
      const lng = parseFloat(data.longitude);
      if (isNaN(lng)) {
        errors.longitude = 'Longitude deve ser um número válido';
      } else if (lng < -180 || lng > 180) {
        errors.longitude = 'Longitude deve estar entre -180 e 180';
      }
    }

    if (data.acceptedWastes.length === 0) {
      errors.acceptedWastes = 'Selecione pelo menos um tipo de resíduo';
    } else if (data.acceptedWastes.length > 8) {
      errors.acceptedWastes = 'Máximo de 8 tipos de resíduos permitidos';
    }

    return errors;
  }

  static validateField(fieldName: keyof CollectionPointFormData, value: any, allData?: CollectionPointFormData): string | undefined {
    const tempData: CollectionPointFormData = {
      name: '',
      description: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      latitude: '',
      longitude: '',
      acceptedWastes: [],
      ...allData,
      [fieldName]: value,
    };

    const errors = this.validateCollectionPointForm(tempData);
    return errors[fieldName];
  }

  static isValidCep(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '');
    return /^\d{8}$/.test(cleanCep);
  }

  static isValidCoordinate(coord: string, type: 'latitude' | 'longitude'): boolean {
    const num = parseFloat(coord);
    if (isNaN(num)) return false;
    
    if (type === 'latitude') {
      return num >= -90 && num <= 90;
    } else {
      return num >= -180 && num <= 180;
    }
  }

  static sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  static formatNumber(number: string): string {
    return number.trim().replace(/[^0-9a-zA-Z]/g, '');
  }

  static getCoordinateHints(): { latitude: string; longitude: string } {
    return {
      latitude: 'Ex: -26.3044 (Sul: negativo, Norte: positivo)',
      longitude: 'Ex: -48.8487 (Oeste: negativo, Leste: positivo)',
    };
  }

  static getBrazilianStates(): Array<{ value: string; label: string; uf: string }> {
    return [
      { value: 'Acre', label: 'Acre', uf: 'AC' },
      { value: 'Alagoas', label: 'Alagoas', uf: 'AL' },
      { value: 'Amapá', label: 'Amapá', uf: 'AP' },
      { value: 'Amazonas', label: 'Amazonas', uf: 'AM' },
      { value: 'Bahia', label: 'Bahia', uf: 'BA' },
      { value: 'Ceará', label: 'Ceará', uf: 'CE' },
      { value: 'Distrito Federal', label: 'Distrito Federal', uf: 'DF' },
      { value: 'Espírito Santo', label: 'Espírito Santo', uf: 'ES' },
      { value: 'Goiás', label: 'Goiás', uf: 'GO' },
      { value: 'Maranhão', label: 'Maranhão', uf: 'MA' },
      { value: 'Mato Grosso', label: 'Mato Grosso', uf: 'MT' },
      { value: 'Mato Grosso do Sul', label: 'Mato Grosso do Sul', uf: 'MS' },
      { value: 'Minas Gerais', label: 'Minas Gerais', uf: 'MG' },
      { value: 'Pará', label: 'Pará', uf: 'PA' },
      { value: 'Paraíba', label: 'Paraíba', uf: 'PB' },
      { value: 'Paraná', label: 'Paraná', uf: 'PR' },
      { value: 'Pernambuco', label: 'Pernambuco', uf: 'PE' },
      { value: 'Piauí', label: 'Piauí', uf: 'PI' },
      { value: 'Rio de Janeiro', label: 'Rio de Janeiro', uf: 'RJ' },
      { value: 'Rio Grande do Norte', label: 'Rio Grande do Norte', uf: 'RN' },
      { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul', uf: 'RS' },
      { value: 'Rondônia', label: 'Rondônia', uf: 'RO' },
      { value: 'Roraima', label: 'Roraima', uf: 'RR' },
      { value: 'Santa Catarina', label: 'Santa Catarina', uf: 'SC' },
      { value: 'São Paulo', label: 'São Paulo', uf: 'SP' },
      { value: 'Sergipe', label: 'Sergipe', uf: 'SE' },
      { value: 'Tocantins', label: 'Tocantins', uf: 'TO' },
    ];
  }
}