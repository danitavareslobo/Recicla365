import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CollectionPointForm } from '../../components/organisms';
import { DashboardTemplate } from '../../components/templates';
import { Typography, Icon, Button } from '../../components/atoms';
import { useAuth } from '../../contexts/AuthContext';
import { CollectionPointService } from '../../services';
import type { CollectionPoint } from '../../types';
import './CadastroLocal.css';

export const CadastroLocal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [collectionPoint, setCollectionPoint] = useState<CollectionPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = Boolean(id);

  const locationMessage = location.state?.message;
  const locationMessageType = location.state?.type;

  useEffect(() => {
    if (isEditing && id) {
      loadCollectionPoint(id);
    }
  }, [isEditing, id]);

  useEffect(() => {
    if (locationMessage) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationMessage, navigate, location.pathname]);

  const loadCollectionPoint = async (pointId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const point = await CollectionPointService.getCollectionPointById(pointId);
      
      if (!point) {
        setError('Ponto de coleta não encontrado');
        return;
      }

      if (point.userId !== user?.id) {
        setError('Você não tem permissão para editar este ponto de coleta');
        return;
      }

      setCollectionPoint(point);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao carregar dados do ponto de coleta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (id) {
      loadCollectionPoint(id);
    }
  };

  const handleGoBack = () => {
    navigate('/locais-coleta');
  };

  if (error) {
    return (
      <DashboardTemplate>
        <div className="cadastro-local-error">
          <div className="cadastro-local-error__content">
            <div className="cadastro-local-error__icon">
              <Icon name="close" size="xl" color="error" />
            </div>
            <Typography variant="h2" align="center" color="error">
              Erro ao carregar
            </Typography>
            <Typography variant="body1" align="center" color="secondary">
              {error}
            </Typography>
            <div className="cadastro-local-error__actions">
              {id && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="refresh" size="sm" />
                  Tentar Novamente
                </Button>
              )}
              <Button
                onClick={handleGoBack}
                variant="primary"
                size="sm"
              >
                <Icon name="arrow-left" size="sm" />
                Voltar aos Locais
              </Button>
            </div>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  if (isEditing && isLoading) {
    return (
      <DashboardTemplate>
        <div className="cadastro-local-loading">
          <div className="cadastro-local-loading__content">
            <div className="cadastro-local-loading__icon">
              <Icon name="recycle" size="xl" color="accent" />
            </div>
            <Typography variant="h3" align="center">
              Carregando dados...
            </Typography>
            <Typography variant="body1" align="center" color="secondary">
              Aguarde enquanto carregamos as informações do ponto de coleta
            </Typography>
            <div className="cadastro-local-loading__spinner">
              <div className="cadastro-local__spinner"></div>
            </div>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  if (isEditing && !collectionPoint) {
    return (
      <DashboardTemplate>
        <div className="cadastro-local-loading">
          <div className="cadastro-local-loading__content">
            <Typography variant="h3" align="center">
              Preparando edição...
            </Typography>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate>
      <div className="cadastro-local-page">
        {locationMessage && (
          <div className={`cadastro-local-page__message cadastro-local-page__message--${locationMessageType || 'info'}`}>
            <Icon 
              name={locationMessageType === 'success' ? 'check' : 'info'} 
              size="sm" 
              color={locationMessageType === 'success' ? 'success' : 'info'} 
            />
            <Typography variant="body2" color={locationMessageType === 'success' ? 'success' : 'primary'}>
              {locationMessage}
            </Typography>
          </div>
        )}

        <CollectionPointForm 
          initialData={isEditing ? collectionPoint || undefined : undefined}
          isEditing={isEditing}
        />
      </div>
    </DashboardTemplate>
  );
};