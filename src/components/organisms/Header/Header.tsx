import React from 'react';
import { Button, Typography, Icon } from '../../atoms';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import './Header.css';
import type { HeaderProps } from '../../../types';

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const headerClasses = [
    'header',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses}>
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo">
            <Icon name="recycle" size="lg" color="accent" />
          </div>
          <Typography variant="h4" weight="bold" className="header__title">
            Recicla365
          </Typography>
        </div>

        <div className="header__actions">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="header__theme-toggle"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
          </Button>

          {user && (
            <div className="header__user-section">
              <div className="header__user-info">
                <Typography variant="body2" color="secondary">
                  Olá,
                </Typography>
                <Typography variant="body2" weight="medium">
                  {user.name.split(' ')[0]}
                </Typography>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="header__logout"
              >
                <Icon name="close" size="sm" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};