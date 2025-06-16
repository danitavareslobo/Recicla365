import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '../../components/atoms';
import { LoginForm } from '../../components/organisms';
import { AuthTemplate } from '../../components/templates';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterClick = () => {
    navigate('/cadastro');
  };

  return (
    <>
      <div className="login-theme-toggle">
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
        title="EcoPontos"
        subtitle="Sistema de Gestão de Pontos de Coleta"
        backgroundVariant="gradient"
      >
        <LoginForm onRegisterClick={handleRegisterClick} />
      </AuthTemplate>
    </>
  );
};