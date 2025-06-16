import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardTemplate } from '../../components/templates';
import { ProfileForm } from '../../components/organisms';
import { Typography, Icon } from '../../components/atoms';
import { useAuth } from '../../contexts/AuthContext';
import './Perfil.css';

export const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('success');

  const handleUpdateSuccess = () => {
    setFeedbackMessage('Perfil atualizado com sucesso!');
    setFeedbackType('success');
    
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleCloseFeedback = () => {
    setFeedbackMessage(null);
  };

  if (!user) {
    return (
      <DashboardTemplate>
        <div className="profile-page__loading">
          <div className="profile-page__loading-content">
            <Icon name="search" size="lg" color="accent" />
            <Typography variant="h3">Carregando perfil...</Typography>
            <Typography variant="body1" color="secondary">
              Aguarde enquanto carregamos suas informações
            </Typography>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate>
      <div className="profile-page">
        {feedbackMessage && (
          <div className={`profile-page__feedback profile-page__feedback--${feedbackType}`}>
            <Icon 
              name={feedbackType === 'success' ? 'check' : feedbackType === 'error' ? 'close' : 'info'} 
              size="sm" 
              color={feedbackType === 'success' ? 'success' : feedbackType === 'error' ? 'error' : 'info'} 
            />
            <Typography variant="body2" color={feedbackType === 'success' ? 'success' : feedbackType === 'error' ? 'error' : 'primary'}>
              {feedbackMessage}
            </Typography>
            <button 
              onClick={handleCloseFeedback}
              className="profile-page__feedback-close"
            >
              <Icon name="close" size="sm" />
            </button>
          </div>
        )}

        <div className="profile-page__header">
          <div className="profile-page__user-badge">
            <div className="profile-page__avatar">
              <Icon name="user" size="lg" color="white" />
            </div>
            <div className="profile-page__user-info">
              <Typography variant="h4" weight="medium">
                {user.name}
              </Typography>
              <Typography variant="body2" color="secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="secondary">
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography>
            </div>
          </div>
        </div>

        <div className="profile-page__content">
          <ProfileForm 
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={handleCancel}
            className="profile-page__form"
          />
        </div>

        <div className="profile-page__tips">
          <div className="profile-page__tip-card">
            <Icon name="info" size="md" color="accent" />
            <div className="profile-page__tip-content">
              <Typography variant="body2" weight="medium">
                Dica de Segurança
              </Typography>
              <Typography variant="caption" color="secondary">
                Mantenha seus dados sempre atualizados para uma melhor experiência na plataforma.
              </Typography>
            </div>
          </div>

          <div className="profile-page__tip-card">
            <Icon name="recycle" size="md" color="accent" />
            <div className="profile-page__tip-content">
              <Typography variant="body2" weight="medium">
                Impacto Ambiental
              </Typography>
              <Typography variant="caption" color="secondary">
                Seus dados ajudam a conectar você com pontos de coleta próximos e relevantes.
              </Typography>
            </div>
          </div>

          <div className="profile-page__tip-card">
            <Icon name="location" size="md" color="accent" />
            <div className="profile-page__tip-content">
              <Typography variant="body2" weight="medium">
                Localização
              </Typography>
              <Typography variant="caption" color="secondary">
                Seu endereço é usado apenas para sugerir pontos de coleta próximos.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};