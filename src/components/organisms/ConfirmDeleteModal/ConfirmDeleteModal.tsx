import React, { useState } from 'react';
import { Typography, Button, Icon } from '../../atoms';
import type { CollectionPoint } from '../../../types';
import './ConfirmDeleteModal.css';

interface ConfirmDeleteModalProps {
  point: CollectionPoint | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (point: CollectionPoint) => void | Promise<void>;
  isDeleting?: boolean;
  className?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  point,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  className = '',
}) => {
  const [localDeleting, setLocalDeleting] = useState(false);

  if (!isOpen || !point) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting && !localDeleting) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      setLocalDeleting(true);
      await onConfirm(point);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir ponto de coleta:', error);
    } finally {
      setLocalDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting && !localDeleting) {
      onClose();
    }
  };

  const formatAddress = (address: CollectionPoint['address']) => {
    return `${address.street}, ${address.number} - ${address.neighborhood}`;
  };

  const isProcessing = isDeleting || localDeleting;

  const modalClasses = [
    'confirm-delete-modal',
    isProcessing ? 'confirm-delete-modal--processing' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={modalClasses} onClick={handleBackdropClick}>
      <div className="confirm-delete-modal__content">
        <div className="confirm-delete-modal__header">
          <div className="confirm-delete-modal__icon">
            <Icon name="trash" size="xl" color="error" />
          </div>
          
          <Typography variant="h3" className="confirm-delete-modal__title">
            Confirmar Exclusão
          </Typography>
          
          <Typography variant="body1" color="secondary" className="confirm-delete-modal__subtitle">
            Esta ação não pode ser desfeita
          </Typography>
        </div>

        <div className="confirm-delete-modal__body">
          <div className="confirm-delete-modal__warning">
            <Icon name="trash" size="md" color="error" />
            <div>
              <Typography variant="body1" className="confirm-delete-modal__warning-text">
                Você está prestes a excluir permanentemente o ponto de coleta:
              </Typography>
              <Typography variant="h4" color="primary" className="confirm-delete-modal__point-name">
                "{point.name}"
              </Typography>
            </div>
          </div>

          <div className="confirm-delete-modal__details">
            <Typography variant="body2" color="secondary">
              <strong>Localização:</strong> {formatAddress(point.address)}
            </Typography>
            <Typography variant="body2" color="secondary">
              <strong>Tipos de resíduo:</strong> {point.acceptedWastes.join(', ')}
            </Typography>
          </div>

          <div className="confirm-delete-modal__consequences">
            <Typography variant="body2" color="error" className="confirm-delete-modal__consequences-title">
              Consequências da exclusão:
            </Typography>
            <ul className="confirm-delete-modal__consequences-list">
              <li>
                <Typography variant="body2" color="secondary">
                  O ponto não aparecerá mais nas buscas
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="secondary">
                  Usuários não poderão mais acessar este local
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="secondary">
                  Todos os dados serão removidos permanentemente
                </Typography>
              </li>
            </ul>
          </div>
        </div>

        <div className="confirm-delete-modal__footer">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="confirm-delete-modal__cancel"
          >
            Cancelar
          </Button>
          
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="confirm-delete-modal__confirm"
          >
            <Icon name="trash" size="sm" />
            {isProcessing ? 'Excluindo...' : 'Sim, Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
};