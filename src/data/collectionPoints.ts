import type { CollectionPoint, WasteType } from '../types';

export const mockCollectionPoints: CollectionPoint[] = [
  {
    id: '1',
    name: 'EcoPonto Centro Joinville',
    description: 'Ponto de coleta principal no centro da cidade, especializado em eletrônicos e baterias.',
    userId: '6',
    address: {
      cep: '89201-000',
      street: 'Rua do Príncipe',
      number: '1234',
      complement: 'Próximo ao Terminal Central',
      neighborhood: 'Centro',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.3044,
      longitude: -48.8487,
    },
    acceptedWastes: ['Eletrônicos', 'Baterias', 'Metal', 'Plástico'],
    createdAt: '2024-03-01T08:30:00Z',
  },
  {
    id: '2',
    name: 'Recicla Norte',
    description: 'Ponto de coleta voltado para materiais orgânicos e papel na região norte.',
    userId: '7',
    address: {
      cep: '89202-000',
      street: 'Rua XV de Novembro',
      number: '567',
      neighborhood: 'América',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.2874,
      longitude: -48.8370,
    },
    acceptedWastes: ['Orgânico', 'Papel', 'Vidro'],
    createdAt: '2024-03-05T11:20:00Z',
  },
  {
    id: '3',
    name: 'EcoStation Bucarein',
    description: 'Estação completa de reciclagem com coleta de todos os tipos de materiais.',
    userId: '8',
    address: {
      cep: '89203-000',
      street: 'Rua Visconde de Taunay',
      number: '890',
      neighborhood: 'Bucarein',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.3125,
      longitude: -48.8692,
    },
    acceptedWastes: ['Vidro', 'Metal', 'Papel', 'Plástico', 'Orgânico', 'Baterias', 'Eletrônicos', 'Óleo'],
    createdAt: '2024-03-08T14:15:00Z',
  },
  {
    id: '4',
    name: 'Verde Vila Nova',
    description: 'Pequeno ponto de coleta comunitário focado em vidro e metal.',
    userId: '9',
    address: {
      cep: '89204-000',
      street: 'Rua Ottokar Doerffel',
      number: '432',
      neighborhood: 'Vila Nova',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.2956,
      longitude: -48.8544,
    },
    acceptedWastes: ['Vidro', 'Metal'],
    createdAt: '2024-03-12T09:45:00Z',
  },
  {
    id: '5',
    name: 'EcoCentauro',
    description: 'Ponto especializado em óleo de cozinha e materiais plásticos.',
    userId: '10',
    address: {
      cep: '89205-000',
      street: 'Rua Ministro Calógeras',
      number: '678',
      neighborhood: 'Centauro',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.3183,
      longitude: -48.8761,
    },
    acceptedWastes: ['Óleo', 'Plástico'],
    createdAt: '2024-03-15T16:30:00Z',
  },
  {
    id: '6',
    name: 'Recicla Glória',
    description: 'Centro de coleta comunitário com foco em papel e papelão.',
    userId: '11',
    address: {
      cep: '89206-000',
      street: 'Rua Blumenau',
      number: '345',
      neighborhood: 'Glória',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.2798,
      longitude: -48.8429,
    },
    acceptedWastes: ['Papel'],
    createdAt: '2024-03-18T13:10:00Z',
  },
  {
    id: '7',
    name: 'EcoPonto Saguaçu',
    description: 'Ponto de coleta especializado em eletrônicos e baterias da região sul.',
    userId: '12',
    address: {
      cep: '89207-000',
      street: 'Rua Nove de Março',
      number: '912',
      neighborhood: 'Saguaçu',
      city: 'Joinville',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -26.3401,
      longitude: -48.8918,
    },
    acceptedWastes: ['Eletrônicos', 'Baterias', 'Metal'],
    createdAt: '2024-03-22T10:25:00Z',
  },
  {
    id: '8',
    name: 'Verde Centro Floripa',
    description: 'Principal ponto de coleta do centro de Florianópolis.',
    userId: '1',
    address: {
      cep: '88010-000',
      street: 'Rua Felipe Schmidt',
      number: '123',
      neighborhood: 'Centro',
      city: 'Florianópolis',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -27.5954,
      longitude: -48.5480,
    },
    acceptedWastes: ['Vidro', 'Metal', 'Papel', 'Plástico'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    name: 'EcoTrindade',
    description: 'Ponto universitário para coleta de materiais recicláveis.',
    userId: '2',
    address: {
      cep: '88040-000',
      street: 'Rua Lauro Linhares',
      number: '456',
      neighborhood: 'Trindade',
      city: 'Florianópolis',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -27.6014,
      longitude: -48.5205,
    },
    acceptedWastes: ['Papel', 'Plástico', 'Orgânico'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '10',
    name: 'Recicla Santa Mônica',
    description: 'Ponto comunitário focado em materiais domésticos.',
    userId: '3',
    address: {
      cep: '88050-000',
      street: 'Avenida Madre Benvenuta',
      number: '789',
      neighborhood: 'Santa Mônica',
      city: 'Florianópolis',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -27.5707,
      longitude: -48.5073,
    },
    acceptedWastes: ['Vidro', 'Metal', 'Óleo'],
    createdAt: '2024-02-01T14:20:00Z',
  },
  {
    id: '11',
    name: 'EcoPonto Agronômica',
    description: 'Estação de reciclagem com coleta completa de materiais.',
    userId: '4',
    address: {
      cep: '88060-000',
      street: 'Rua Delminda Silveira',
      number: '321',
      neighborhood: 'Agronômica',
      city: 'Florianópolis',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -27.5845,
      longitude: -48.5186,
    },
    acceptedWastes: ['Eletrônicos', 'Baterias', 'Metal', 'Plástico'],
    createdAt: '2024-02-10T09:15:00Z',
  },
  {
    id: '12',
    name: 'Recicla Centro Bocaiuva',
    description: 'Ponto central especializado em vidro e materiais domésticos.',
    userId: '5',
    address: {
      cep: '88070-000',
      street: 'Rua Bocaiúva',
      number: '654',
      neighborhood: 'Centro',
      city: 'Florianópolis',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    coordinates: {
      latitude: -27.5945,
      longitude: -48.5477,
    },
    acceptedWastes: ['Vidro', 'Metal', 'Papel'],
    createdAt: '2024-02-20T16:45:00Z',
  },
];

export const getCollectionPointById = (id: string): CollectionPoint | undefined => {
  return mockCollectionPoints.find(point => point.id === id);
};

export const getCollectionPointsByUserId = (userId: string): CollectionPoint[] => {
  return mockCollectionPoints.filter(point => point.userId === userId);
};

export const getCollectionPointsByWasteType = (wasteType: WasteType): CollectionPoint[] => {
  return mockCollectionPoints.filter(point => 
    point.acceptedWastes.includes(wasteType)
  );
};

export const getCollectionPointsByCity = (city: string): CollectionPoint[] => {
  return mockCollectionPoints.filter(point => 
    point.address.city.toLowerCase() === city.toLowerCase()
  );
};

export const getRecentCollectionPoints = (limit: number = 6): CollectionPoint[] => {
  return mockCollectionPoints
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};