import React from 'react';
import { Typography, Icon } from '../../atoms';
import './AuthTemplate.css';

interface AuthTemplateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBranding?: boolean;
  backgroundVariant?: 'default' | 'gradient' | 'pattern';
  className?: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = 'Bem-vindo ao Recicla365',
  subtitle = 'Faça parte da mudança que o mundo precisa',
  showBranding = true,
  backgroundVariant = 'gradient',
  className = '',
}) => {
  const templateClasses = [
    'auth-template',
    `auth-template--${backgroundVariant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={templateClasses}>
      <div className="auth-template__container">
        {showBranding && (
          <div className="auth-template__branding">
            <div className="auth-template__logo">
              <Icon name="recycle" size="xl" color="accent" />
              <Typography variant="h1" weight="bold" className="auth-template__brand-name">
                Recicla365
              </Typography>
            </div>
            
            <div className="auth-template__brand-content">
              <Typography variant="h2" align="center" className="auth-template__title">
                {title}
              </Typography>
              <Typography variant="body1" color="secondary" align="center" className="auth-template__subtitle">
                {subtitle}
              </Typography>
            </div>

            <div className="auth-template__features">
              <div className="auth-template__feature">
                <Icon name="location" size="md" color="accent" />
                <Typography variant="body2" color="secondary">
                  Encontre pontos de coleta próximos
                </Typography>
              </div>
              
              <div className="auth-template__feature">
                <Icon name="recycle" size="md" color="accent" />
                <Typography variant="body2" color="secondary">
                  Cadastre novos locais de reciclagem
                </Typography>
              </div>
              
              <div className="auth-template__feature">
                <Icon name="user" size="md" color="accent" />
                <Typography variant="body2" color="secondary">
                  Conecte-se com a comunidade verde
                </Typography>
              </div>
            </div>
          </div>
        )}

        <div className="auth-template__content">
          <div className="auth-template__form-container">
            {children}
          </div>
        </div>
      </div>

      <div className="auth-template__background-elements">
        <div className="auth-template__circle auth-template__circle--1"></div>
        <div className="auth-template__circle auth-template__circle--2"></div>
        <div className="auth-template__circle auth-template__circle--3"></div>
      </div>

      <footer className="auth-template__footer">
        <Typography variant="caption" color="secondary" align="center">
          © 2025 Recicla365. Construindo um futuro mais sustentável. Criado por <a href='https://www.linkedin.com/in/danitavareslobo/' target="_blank">Daniele Tavares Lobo</a>
        </Typography>
      </footer>
    </div>
  );
};