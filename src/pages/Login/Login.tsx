import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Typography, Icon } from '../../components/atoms';
import { AuthTemplate } from '../../components/templates';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    if (loginError) setLoginError('');
    if (loginSuccess) setLoginSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setLoginSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setLoginError('Email ou senha incorretos.');
      }
    } catch (error) {
      setLoginError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
        <div className="login-form-container">
          <div className="login-form-header">
            <Typography variant="h2" className="login-title">
              Entrar no Sistema
            </Typography>
            <Typography variant="body1" className="login-subtitle">
              Faça login para acessar o painel de controle
            </Typography>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                errorMessage={errors.email}
                disabled={isLoading}
                fullWidth
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                errorMessage={errors.password}
                disabled={isLoading}
                fullWidth
              />
            </div>

            {loginError && (
              <div className="login-error-message">
                <Icon name="close" size="sm" />
                {loginError}
              </div>
            )}

            {loginSuccess && (
              <div className="login-success-message">
                <Icon name="recycle" size="sm" />
                {loginSuccess}
              </div>
            )}

            <div className="login-form-actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="login-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem', 
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)',
                marginTop: '1rem'
              }}>
                <Typography variant="body2" color="secondary" align="center">
                  Não tem uma conta?
                </Typography>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => navigate('/cadastro')}
                  disabled={isLoading}
                >
                  Criar conta
                </Button>
              </div>
            </div>
          </form>

          <div className="login-demo-info">
            <Typography variant="h6">Dados para Teste</Typography>
            <ul>
              <li><strong>Admin:</strong> <code>admin@ecopontos.com</code> / <code>admin123</code></li>
              <li><strong>Usuário:</strong> <code>usuario@teste.com</code> / <code>user123</code></li>
              <li><strong>Gestor:</strong> <code>gestor@ecopontos.com</code> / <code>gestor123</code></li>
              <li><strong>Pedro (JV):</strong> <code>pedro@joinville.com</code> / <code>pedro123</code></li>
              <li><strong>Sabrina (JV):</strong> <code>sabrina@ecopontos.com</code> / <code>sabrina123</code></li>
            </ul>
          </div>
        </div>
      </AuthTemplate>
    </>
  );
};