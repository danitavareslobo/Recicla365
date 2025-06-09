import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Icon } from '../../components/atoms';
import { AuthTemplate } from '../../components/templates';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="register-theme-toggle">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="theme-toggle-button"
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
          {theme === 'light' ? 'Escuro' : 'Claro'}
        </Button>
      </div>
      
      <AuthTemplate
        title="Junte-se ao EcoPontos"
        subtitle="Crie sua conta e faça parte da mudança sustentável"
        backgroundVariant="gradient"
      >
        <div className="register-container">
          <div className="register-header">
            <Typography variant="h2" className="register-title">
              Criar Conta
            </Typography>
            <Typography variant="body1" className="register-subtitle">
              Preencha seus dados para começar sua jornada verde
            </Typography>
          </div>

          <div className="register-progress">
            <div className="register-step register-step--active">
              <span>1</span>
              <Typography variant="caption">Dados Pessoais</Typography>
            </div>
            <div className="register-step">
              <span>2</span>
              <Typography variant="caption">Endereço</Typography>
            </div>
          </div>

          <div className="register-form-placeholder">
            <Icon name="user" size="xl" color="accent" />
            <Typography variant="h3" align="center" style={{ marginTop: '1rem' }}>
              Formulário em Construção
            </Typography>
            <Typography variant="body2" color="secondary" align="center">
              Implementando sistema de cadastro com validações e integração ViaCEP
            </Typography>
          </div>

          <div className="register-actions">
            <Button
              onClick={handleBackToLogin}
              variant="outline"
              size="lg"
              fullWidth
            >
              Voltar ao Login
            </Button>
          </div>
        </div>
      </AuthTemplate>
    </>
  );
};