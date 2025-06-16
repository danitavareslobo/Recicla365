import { ValidationService } from '../services/validationService';
import { ViaCepService } from '../services/viaCepService';
import { FormUtils } from './formUtils';
import type { CollectionPointFormData, TestResult } from '../types/index';

export class FormTestHelper {
  static async runAllTests(): Promise<{
    overall: boolean;
    results: Record<string, TestResult>;
    summary: {
      total: number;
      passed: number;
      failed: number;
    };
  }> {
    console.log('🧪 Iniciando testes do formulário...');

    const tests = {
      validation: this.testValidationService(),
      viaCep: await this.testViaCepService(),
      formUtils: this.testFormUtils(),
      sampleData: this.testSampleData(),
      coordinates: this.testCoordinateValidation(),
      wasteTypes: this.testWasteTypeHandling(),
    };

    const results = Object.entries(tests).reduce((acc, [key, result]) => {
      acc[key] = result;
      return acc;
    }, {} as Record<string, TestResult>);

    const passed = Object.values(results).filter(r => r.passed).length;
    const total = Object.values(results).length;
    const failed = total - passed;

    const overall = failed === 0;

    console.log(`✅ Testes concluídos: ${passed}/${total} passaram`);

    return {
      overall,
      results,
      summary: { total, passed, failed },
    };
  }

  static testValidationService(): TestResult {
    try {
      const validData = FormUtils.generateSampleData();
      const errors = ValidationService.validateCollectionPointForm(validData);

      if (Object.keys(errors).length > 0) {
        return {
          passed: false,
          message: 'Dados válidos falharam na validação',
          details: errors,
        };
      }

      const invalidData: CollectionPointFormData = {
        ...validData,
        name: '', 
        latitude: '200', 
        acceptedWastes: [], 
      };

      const invalidErrors = ValidationService.validateCollectionPointForm(invalidData);
      const expectedErrors = ['name', 'latitude', 'acceptedWastes'];
      const hasExpectedErrors = expectedErrors.every(field => invalidErrors[field]);

      if (!hasExpectedErrors) {
        return {
          passed: false,
          message: 'Validação não detectou erros esperados',
          details: { expected: expectedErrors, actual: Object.keys(invalidErrors) },
        };
      }

      return {
        passed: true,
        message: 'Serviço de validação funcionando corretamente',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste de validação',
        details: error,
      };
    }
  }

  static async testViaCepService(): Promise<TestResult> {
    try {
      const validCep = '01310-100'; 
      const result = await ViaCepService.getAddressByCep(validCep);

      if (!result.logradouro || !result.localidade) {
        return {
          passed: false,
          message: 'ViaCEP não retornou dados esperados',
          details: result,
        };
      }

      const validCepTests = [
        { cep: '01310100', expected: true },
        { cep: '01310-100', expected: true },
        { cep: '12345678', expected: true },
        { cep: '1234567', expected: false },
        { cep: 'abc12345', expected: false },
        { cep: '', expected: false },
      ];

      for (const test of validCepTests) {
        const isValid = ViaCepService.isValidCep(test.cep);
        if (isValid !== test.expected) {
          return {
            passed: false,
            message: `Validação de CEP falhou para: ${test.cep}`,
            details: { cep: test.cep, expected: test.expected, actual: isValid },
          };
        }
      }

      const maskTests = [
        { input: '01310100', expected: '01310-100' },
        { input: '123456789', expected: '12345-678' },
        { input: '12345', expected: '12345' },
      ];

      for (const test of maskTests) {
        const masked = ViaCepService.maskCep(test.input);
        if (masked !== test.expected) {
          return {
            passed: false,
            message: `Máscara de CEP falhou para: ${test.input}`,
            details: { input: test.input, expected: test.expected, actual: masked },
          };
        }
      }

      return {
        passed: true,
        message: 'Serviço ViaCEP funcionando corretamente',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste do ViaCEP',
        details: error,
      };
    }
  }

  static testFormUtils(): TestResult {
    try {
      const sampleData = FormUtils.generateSampleData();
      
      const dirtyData: CollectionPointFormData = {
        ...sampleData,
        name: '  Nome com espaços  ',
        description: '  Descrição com espaços  ',
        cep: '12345-678',
      };

      const cleanData = FormUtils.cleanFormData(dirtyData);
      
      if (cleanData.name !== 'Nome com espaços' || cleanData.cep !== '12345678') {
        return {
          passed: false,
          message: 'Limpeza de dados falhou',
          details: { original: dirtyData, cleaned: cleanData },
        };
      }

      const isDirty = FormUtils.isFormDirty(dirtyData, sampleData);
      if (!isDirty) {
        return {
          passed: false,
          message: 'Detecção de mudanças falhou',
        };
      }

      const progress = FormUtils.calculateProgress(sampleData);
      if (progress.percentage !== 100) {
        return {
          passed: false,
          message: 'Cálculo de progresso falhou',
          details: progress,
        };
      }

      const wasteList = FormUtils.formatWasteList(['Papel', 'Plástico', 'Vidro']);
      if (!wasteList.includes('e')) {
        return {
          passed: false,
          message: 'Formatação de lista falhou',
          details: wasteList,
        };
      }

      return {
        passed: true,
        message: 'Utilitários do formulário funcionando corretamente',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste dos utilitários',
        details: error,
      };
    }
  }

  static testSampleData(): TestResult {
    try {
      const sampleData = FormUtils.generateSampleData();
      const errors = ValidationService.validateCollectionPointForm(sampleData);

      if (Object.keys(errors).length > 0) {
        return {
          passed: false,
          message: 'Dados de exemplo são inválidos',
          details: errors,
        };
      }

      const requiredFields = ['name', 'description', 'cep', 'street', 'number', 'neighborhood', 'city', 'state', 'latitude', 'longitude'];
      
      for (const field of requiredFields) {
        const value = sampleData[field as keyof CollectionPointFormData];
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return {
            passed: false,
            message: `Campo obrigatório vazio: ${field}`,
            details: sampleData,
          };
        }
      }

      if (sampleData.acceptedWastes.length === 0) {
        return {
          passed: false,
          message: 'Dados de exemplo sem tipos de resíduos',
        };
      }

      return {
        passed: true,
        message: 'Dados de exemplo válidos',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste de dados de exemplo',
        details: error,
      };
    }
  }

  static testCoordinateValidation(): TestResult {
    try {
      const tests = [
        { lat: '-26.3044', lng: '-48.8487', shouldPass: true },
        { lat: '0', lng: '0', shouldPass: true },
        { lat: '90', lng: '180', shouldPass: true },
        { lat: '-90', lng: '-180', shouldPass: true },
        { lat: '91', lng: '0', shouldPass: false },
        { lat: '0', lng: '181', shouldPass: false },
        { lat: 'abc', lng: '0', shouldPass: false },
        { lat: '0', lng: 'xyz', shouldPass: false },
      ];

      for (const test of tests) {
        const result = FormUtils.validateCoordinates(test.lat, test.lng);
        if (result.isValid !== test.shouldPass) {
          return {
            passed: false,
            message: `Validação de coordenadas falhou para lat:${test.lat}, lng:${test.lng}`,
            details: { test, result },
          };
        }
      }

      return {
        passed: true,
        message: 'Validação de coordenadas funcionando corretamente',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste de coordenadas',
        details: error,
      };
    }
  }

  static testWasteTypeHandling(): TestResult {
    try {
      const sampleData = FormUtils.generateSampleData();
      
      const validTypes = ['Vidro', 'Metal', 'Papel', 'Plástico', 'Orgânico', 'Baterias', 'Eletrônicos', 'Óleo'];
      
      for (const waste of sampleData.acceptedWastes) {
        if (!validTypes.includes(waste)) {
          return {
            passed: false,
            message: `Tipo de resíduo inválido: ${waste}`,
            details: { waste, validTypes },
          };
        }
      }

      const formatted = FormUtils.formatWasteList(sampleData.acceptedWastes);
      if (!formatted || formatted.length === 0) {
        return {
          passed: false,
          message: 'Formatação de lista de resíduos falhou',
        };
      }

      return {
        passed: true,
        message: 'Manipulação de tipos de resíduos funcionando corretamente',
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Erro no teste de tipos de resíduos',
        details: error,
      };
    }
  }

  static async quickIntegrationTest(): Promise<TestResult> {
    try {
      console.log('🚀 Executando teste rápido de integração...');

      const data = FormUtils.generateSampleData();
      
      const errors = ValidationService.validateCollectionPointForm(data);
      if (Object.keys(errors).length > 0) {
        throw new Error('Dados de exemplo falharam na validação');
      }

      const clean = FormUtils.cleanFormData(data);
      
      const progress = FormUtils.calculateProgress(clean);
      if (progress.percentage !== 100) {
        throw new Error('Progresso incorreto para dados completos');
      }

      console.log('✅ Teste de integração passou!');

      return {
        passed: true,
        message: 'Teste de integração executado com sucesso',
        details: { data, progress },
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Falha no teste de integração',
        details: error,
      };
    }
  }
}