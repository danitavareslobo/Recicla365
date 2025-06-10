import type { User } from '../types';

export const testRegistrationData = {
  validUser: {
    name: 'João da Silva',
    email: 'joao.teste@email.com',
    cpf: '123.456.789-00',
    gender: 'M' as const,
    birthDate: '1990-05-15',
    password: 'senha123456',
    confirmPassword: 'senha123456',
    cep: '89201-000',
    street: 'Rua do Príncipe',
    number: '123',
    complement: 'Apartamento 45',
    neighborhood: 'Centro',
    city: 'Joinville',
    state: 'Santa Catarina',
  },
  
  validUser2: {
    name: 'Maria Fernanda Santos',
    email: 'maria.teste@email.com',
    cpf: '987.654.321-11',
    gender: 'F' as const,
    birthDate: '1985-12-03',
    password: 'minhasenha123',
    confirmPassword: 'minhasenha123',
    cep: '88010-000',
    street: 'Rua Felipe Schmidt',
    number: '456',
    complement: '',
    neighborhood: 'Centro',
    city: 'Florianópolis',
    state: 'Santa Catarina',
  },

  invalidCpfs: [
    '111.111.111-11', 
    '000.000.000-00', 
    '123.456.789-99', 
    '12345678901',    
    '123.456.78',     
  ],

  invalidEmails: [
    'email@',
    '@domain.com',
    'email.domain.com',
    'email@domain',
    'email @domain.com',
  ],

  testCeps: {
    joinville: {
      valid: [
        '89201-000', 
        '89202-000', 
        '89203-000',
        '89204-000', 
      ],
      invalid: [
        '00000-000', 
        '12345-999', 
      ]
    },
    florianopolis: {
      valid: [
        '88010-000', 
        '88040-000', 
        '88050-000', 
        '88060-000', 
      ]
    }
  }
};

export const mockRegistrationResponses = {
  viaCepSuccess: {
    '89201-000': {
      cep: '89201-000',
      logradouro: 'Rua do Príncipe',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Joinville',
      uf: 'SC',
    },
    '88010-000': {
      cep: '88010-000',
      logradouro: 'Rua Felipe Schmidt',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Florianópolis',
      uf: 'SC',
    }
  },
  viaCepError: {
    cep: '00000-000',
    erro: true
  }
};

export const registrationTestCases = [
  {
    description: 'Cadastro com dados válidos completos',
    userData: testRegistrationData.validUser,
    shouldSucceed: true
  },
  {
    description: 'Cadastro sem campo obrigatório (nome)',
    userData: { ...testRegistrationData.validUser, name: '' },
    shouldSucceed: false,
    expectedError: 'Nome é obrigatório'
  },
  {
    description: 'Cadastro com email inválido',
    userData: { ...testRegistrationData.validUser, email: 'email@' },
    shouldSucceed: false,
    expectedError: 'Email inválido'
  },
  {
    description: 'Cadastro com CPF inválido',
    userData: { ...testRegistrationData.validUser, cpf: '111.111.111-11' },
    shouldSucceed: false,
    expectedError: 'CPF inválido'
  },
  {
    description: 'Cadastro com senhas diferentes',
    userData: { 
      ...testRegistrationData.validUser, 
      password: 'senha123',
      confirmPassword: 'senha456'
    },
    shouldSucceed: false,
    expectedError: 'Senhas não coincidem'
  }
];