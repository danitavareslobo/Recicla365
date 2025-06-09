import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Icon } from '../../atoms';
import { useAuth } from '../../../contexts/AuthContext';
import './Navigation.css';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle';
  requiresAuth?: boolean;
}

interface NavigationProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mobile';
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'recycle',
    requiresAuth: true,
  },
  {
    id: 'collection-points-list',
    label: 'Pontos de Coleta',
    path: '/collection-points',
    icon: 'location',
    requiresAuth: true,
  },
  {
    id: 'collection-points-create',
    label: 'Cadastrar Ponto',
    path: '/collection-points/create',
    icon: 'plus',
    requiresAuth: true,
  },
  {
    id: 'profile',
    label: 'Perfil',
    path: '/profile',
    icon: 'user',
    requiresAuth: true,
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  className = '',
  variant = 'horizontal',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const filteredItems = navigationItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navigationClasses = [
    'navigation',
    `navigation--${variant}`,
    isMobileMenuOpen && 'navigation--mobile-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={navigationClasses}>
      {variant === 'mobile' && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="navigation__mobile-toggle"
        >
          <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="sm" />
        </Button>
      )}

      <div className="navigation__container">
        <ul className="navigation__list">
          {filteredItems.map((item) => (
            <li key={item.id} className="navigation__item">
              <Button
                variant={isActive(item.path) ? 'primary' : 'outline'}
                size={variant === 'vertical' ? 'md' : 'sm'}
                fullWidth={variant === 'vertical'}
                onClick={() => handleNavigate(item.path)}
                className={`navigation__link ${isActive(item.path) ? 'navigation__link--active' : ''}`}
              >
                <Icon name={item.icon} size="sm" />
                <span className="navigation__label">{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};