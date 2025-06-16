import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Icon } from '../../atoms';
import { FormField } from '../../molecules';
import { useAuth } from '../../../contexts/AuthContext';
import type { LoginFormProps, LoginFormData, FormErrors } from '../../../types';
import './LoginForm.css';

export const LoginForm: React.FC<LoginFormProps> = ({
  onRegisterClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({
          general: 'Email ou senha incorretos. Tente novamente.',
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erro ao fazer login. Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formClasses = [
    'login-form',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={formClasses}>
      <div className="login-form__header">
        <div className="login-form__icon">
          <Icon name="user" size="xl" color="accent" />
        </div>
        <Typography variant="h2" align="center" className="login-form__title">
          Entrar no Recicla365
        </Typography>
        <Typography variant="body1" color="secondary" align="center" className="login-form__subtitle">
          Faça login para acessar sua conta
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="login-form__form">
        {errors.general && (
          <div className="login-form__error-banner">
            <Icon name="close" size="sm" color="error" />
            <Typography variant="body2" color="error">
              {errors.general}
            </Typography>
          </div>
        )}

        <div className="login-form__fields">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            errorMessage={errors.email}
            icon="email"
            required
            disabled={isLoading}
            fullWidth
          />

          <FormField
            id="password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            errorMessage={errors.password}
            icon="password"
            required
            disabled={isLoading}
            fullWidth
          />
        </div>

        <div className="login-form__actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            className="login-form__submit"
          >
            {isLoading ? (
              <>
                <Icon name="search" size="sm" />
                Entrando...
              </>
            ) : (
              <>
                <Icon name="user" size="sm" />
                Entrar
              </>
            )}
          </Button>

          {onRegisterClick && (
            <div className="login-form__register">
              <Typography variant="body2" color="secondary" align="center">
                Não tem uma conta?
              </Typography>
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={onRegisterClick}
                disabled={isLoading}
                className="login-form__register-button"
              >
                <Icon name="plus" size="sm" />
                Criar conta
              </Button>
            </div>
          )}
        </div>
      </form>

      <div className="login-form__demo">
        <Typography variant="caption" color="secondary" align="center">
          <strong>Para testar:</strong>  
          <br />Use o email: pedro@joinville.com <br /> e a senha: pedro123
        </Typography>
      </div>
    </div>
  );
};