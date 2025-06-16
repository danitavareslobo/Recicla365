import React from 'react';
import { Typography, Button, Icon } from '../../atoms';
import type { CollectionPoint, WasteType } from '../../../types';
import './CollectionPointViewModal.css';
import type { CollectionPointViewModalProps } from '../../../types';

const wasteTypeColors: Record<WasteType, string> = {
  'Vidro': '#22c55e',
  'Metal': '#6b7280',
  'Papel': '#3b82f6',
  'Plástico': '#f59e0b',
  'Orgânico': '#10b981',
  'Baterias': '#dc2626',
  'Eletrônicos': '#8b5cf6',
  'Óleo': '#f97316',
};

export const CollectionPointViewModal: React.FC<CollectionPointViewModalProps> = ({
  point,
  isOpen,
  onClose,
  onEdit,
  className = '',
}) => {
  if (!isOpen || !point) return null;

  const formatAddress = (address: CollectionPoint['address']) => {
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.uf}`;
  };

  const formatCoordinates = (coordinates: CollectionPoint['coordinates']) => {
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(point);
      onClose();
    }
  };

  const modalClasses = [
    'collection-point-view-modal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={modalClasses} onClick={handleBackdropClick}>
      <div className="collection-point-view-modal__content">
        <div className="collection-point-view-modal__header">
          <div className="collection-point-view-modal__title-section">
            <Icon name="location" size="lg" color="accent" />
            <div>
              <Typography variant="h3" className="collection-point-view-modal__title">
                {point.name}
              </Typography>
              <Typography variant="body2" color="secondary">
                Ponto de coleta seletiva
              </Typography>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="collection-point-view-modal__close"
          >
            <Icon name="close" size="md" />
          </Button>
        </div>

        <div className="collection-point-view-modal__body">
          <div className="collection-point-view-modal__section">
            <Typography variant="h4" className="collection-point-view-modal__section-title">
              <Icon name="search" size="sm" />
              Descrição
            </Typography>
            <Typography variant="body1" className="collection-point-view-modal__description">
              {point.description || 'Nenhuma descrição disponível.'}
            </Typography>
          </div>

          <div className="collection-point-view-modal__section">
            <Typography variant="h4" className="collection-point-view-modal__section-title">
              <Icon name="location" size="sm" />
              Endereço
            </Typography>
            <div className="collection-point-view-modal__address">
              <Typography variant="body1">
                {formatAddress(point.address)}
              </Typography>
              <Typography variant="body2" color="secondary">
                CEP: {point.address.cep}
              </Typography>
            </div>
          </div>

          <div className="collection-point-view-modal__section">
            <Typography variant="h4" className="collection-point-view-modal__section-title">
              <Icon name="location" size="sm" />
              Coordenadas
            </Typography>
            <Typography variant="body2" color="secondary" className="collection-point-view-modal__coordinates">
              {formatCoordinates(point.coordinates)}
            </Typography>
          </div>

          <div className="collection-point-view-modal__section">
            <Typography variant="h4" className="collection-point-view-modal__section-title">
              <Icon name="recycle" size="sm" />
              Tipos de Resíduos Aceitos
            </Typography>
            <div className="collection-point-view-modal__waste-types">
              {point.acceptedWastes.map((waste) => (
                <div
                  key={waste}
                  className="collection-point-view-modal__waste-type"
                  style={{
                    '--waste-color': wasteTypeColors[waste],
                  } as React.CSSProperties}
                >
                  <div className="collection-point-view-modal__waste-color"></div>
                  <Typography variant="body2">{waste}</Typography>
                </div>
              ))}
            </div>
          </div>

          <div className="collection-point-view-modal__section">
            <Typography variant="h4" className="collection-point-view-modal__section-title">
              <Icon name="user" size="sm" />
              Informações do Cadastro
            </Typography>
            <div className="collection-point-view-modal__meta">
              <Typography variant="body2" color="secondary">
                Cadastrado em: {formatDate(point.createdAt)}
              </Typography>
              <Typography variant="body2" color="secondary">
                ID: {point.id}
              </Typography>
            </div>
          </div>
        </div>

        <div className="collection-point-view-modal__footer">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {onEdit && (
            <Button variant="primary" onClick={handleEditClick}>
              <Icon name="edit" size="sm" />
              Editar Ponto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};