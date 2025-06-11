// src/pages/LocaisColeta/LocaisColeta.tsx - Corrigido
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CollectionPointsList, 
  CollectionPointViewModal, 
  ConfirmDeleteModal 
} from '../../components/organisms';
import { useAuth } from '../../contexts/AuthContext';
import { CollectionPointService } from '../../services';
import type { CollectionPoint } from '../../types';
import './LocaisColeta.css';

export const LocaisColeta: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados principais
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados dos modais
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar pontos de coleta
  useEffect(() => {
    loadCollectionPoints();
  }, []);

  const loadCollectionPoints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Usar o método correto do serviço existente
      const data = await CollectionPointService.getAllCollectionPoints();
      setPoints(data);
    } catch (err) {
      console.error('Erro ao carregar pontos de coleta:', err);
      setError('Não foi possível carregar os pontos de coleta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para ações
  const handleCreate = () => {
    navigate('/pontos-coleta/novo');
  };

  const handleView = (point: CollectionPoint) => {
    setSelectedPoint(point);
    setViewModalOpen(true);
  };

  const handleEdit = (point: CollectionPoint) => {
    navigate(`/pontos-coleta/editar/${point.id}`);
  };

  const handleDelete = (point: CollectionPoint) => {
    setSelectedPoint(point);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (point: CollectionPoint) => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setIsDeleting(true);
      // Usar o método correto com userId
      await CollectionPointService.deleteCollectionPoint(point.id, user.id);
      
      // Atualizar lista local
      setPoints(prevPoints => prevPoints.filter(p => p.id !== point.id));
      
      // Fechar modal
      setDeleteModalOpen(false);
      setSelectedPoint(null);
      
      // TODO: Adicionar toast de sucesso aqui
      console.log('Ponto de coleta excluído com sucesso');
      
    } catch (err) {
      console.error('Erro ao excluir ponto de coleta:', err);
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível excluir o ponto de coleta. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedPoint(null);
  };

  const handleEditFromModal = (point: CollectionPoint) => {
    setViewModalOpen(false);
    handleEdit(point);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setSelectedPoint(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    loadCollectionPoints();
  };

  return (
    <div className="locais-coleta-page">
      <div className="container">
        {error && (
          <div className="locais-coleta-page__error">
            <p>{error}</p>
            <button onClick={handleRetry}>Tentar Novamente</button>
          </div>
        )}

        <CollectionPointsList
          collectionPoints={points}
          isLoading={isLoading}
          searchable={true}
          showActions={true}
          onCreate={handleCreate}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="locais-coleta-page__list"
        />
      </div>

      <CollectionPointViewModal
        point={selectedPoint}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        onEdit={handleEditFromModal}
      />

      <ConfirmDeleteModal
        point={selectedPoint}
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};