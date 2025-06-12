import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Header, Navigation } from '../../components/organisms';
import { CollectionPointForm } from '../../components/organisms';
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
      <>
        <Header />
        <Navigation variant="horizontal" />
        <div className="cadastro-local">
          <div className="cadastro-local__container">
            <div className="cadastro-local__error">
              <div className="cadastro-local__error-icon">
                <Icon name="close" size="xl" color="error" />
              </div>
              <Typography variant="h2" align="center" color="error">
                Erro ao carregar
              </Typography>
              <Typography variant="body1" align="center" color="secondary">
                {error}
              </Typography>
              <div className="cadastro-local__error-actions">
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
        </div>
      </>
    );
  }

  if (isEditing && isLoading) {
    return (
      <>
        <Header />
        <Navigation variant="horizontal" />
        <div className="cadastro-local">
          <div className="cadastro-local__container">
            <div className="cadastro-local__loading">
              <div className="cadastro-local__loading-icon">
                <Icon name="recycle" size="xl" color="accent" />
              </div>
              <Typography variant="h3" align="center">
                Carregando dados...
              </Typography>
              <Typography variant="body1" align="center" color="secondary">
                Aguarde enquanto carregamos as informações do ponto de coleta
              </Typography>
              <div className="cadastro-local__loading-spinner">
                <div className="cadastro-local__spinner"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isEditing && !collectionPoint) {
    return (
      <>
        <Header />
        <Navigation variant="horizontal" />
        <div className="cadastro-local">
          <div className="cadastro-local__container">
            <div className="cadastro-local__loading">
              <Typography variant="h3" align="center">
                Preparando edição...
              </Typography>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Navigation variant="horizontal" />
      <div className="cadastro-local">
        <div className="cadastro-local__container">
          {locationMessage && (
            <div className={`cadastro-local__message cadastro-local__message--${locationMessageType || 'info'}`}>
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
      </div>
    </>
  );
};