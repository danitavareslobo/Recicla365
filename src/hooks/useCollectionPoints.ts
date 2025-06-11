import { useState, useEffect } from 'react';
import { CollectionPointService } from '../services';
import type { CollectionPoint } from '../types';

export interface UseCollectionPointsReturn {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getUserPoints: (userId: string) => Promise<void>;
  searchPoints: (query: string) => Promise<void>;
  statistics: {
    total: number;
    byWasteType: Record<string, number>;
    byCity: Record<string, number>;
    recent: number;
  };
}

export const useCollectionPoints = (): UseCollectionPointsReturn => {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    byWasteType: {},
    byCity: {},
    recent: 0,
  });

  const loadAllPoints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const points = await CollectionPointService.getAllCollectionPoints();
      setCollectionPoints(points);
      
      const stats = CollectionPointService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pontos de coleta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPoints = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const points = await CollectionPointService.getUserCollectionPoints(userId);
      setCollectionPoints(points);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar seus pontos de coleta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPoints = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const points = await CollectionPointService.searchCollectionPoints(query);
      setCollectionPoints(points);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pontos de coleta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadAllPoints();
  };

  useEffect(() => {
    loadAllPoints();
  }, []);

  return {
    collectionPoints,
    isLoading,
    error,
    refresh,
    getUserPoints,
    searchPoints,
    statistics,
  };
};

export interface UseCollectionPointReturn {
  collectionPoint: CollectionPoint | null;
  isLoading: boolean;
  error: string | null;
  load: (id: string) => Promise<void>;
  delete: (id: string, userId: string) => Promise<void>;
}

export const useCollectionPoint = (): UseCollectionPointReturn => {
  const [collectionPoint, setCollectionPoint] = useState<CollectionPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const point = await CollectionPointService.getCollectionPointById(id);
      setCollectionPoint(point);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar ponto de coleta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoint = async (id: string, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await CollectionPointService.deleteCollectionPoint(id, userId);
      setCollectionPoint(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar ponto de coleta';
      setError(errorMessage);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  return {
    collectionPoint,
    isLoading,
    error,
    load,
    delete: deletePoint,
  };
};