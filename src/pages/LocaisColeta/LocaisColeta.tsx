import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CollectionPointsList, 
  CollectionPointViewModal, 
  ConfirmDeleteModal 
} from '../../components/organisms';
import { DashboardTemplate } from '../../components/templates';
import { useAuth } from '../../contexts/AuthContext';
import { CollectionPointService } from '../../services';
import type { CollectionPoint } from '../../types';
import './LocaisColeta.css';

export const LocaisColeta: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCollectionPoints();
  }, []);

  const loadCollectionPoints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CollectionPointService.getAllCollectionPoints();
      setPoints(data);
    } catch (err) {
      console.error('Erro ao carregar pontos de coleta:', err);
      setError('Não foi possível carregar os pontos de coleta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/cadastro-local');
  };

  const handleView = (point: CollectionPoint) => {
    setSelectedPoint(point);
    setViewModalOpen(true);
  };

  const handleEdit = (point: CollectionPoint) => {
    navigate(`/cadastro-local/editar/${point.id}`);  
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
      await CollectionPointService.deleteCollectionPoint(point.id, user.id);
      
      setPoints(prevPoints => prevPoints.filter(p => p.id !== point.id));
      setDeleteModalOpen(false);
      setSelectedPoint(null);
      
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
    <DashboardTemplate>
      <div className="locais-coleta-page">
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
    </DashboardTemplate>
  );
};