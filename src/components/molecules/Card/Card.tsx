import React from 'react';
import { Typography, Icon } from '../../atoms';
import './Card.css';

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle';
  variant?: 'default' | 'highlight' | 'stats';
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  clickable = false,
  className = '',
  onClick,
}) => {
  const classes = [
    'card',
    `card--${variant}`,
    clickable && 'card--clickable',
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {(icon || title || subtitle) && (
        <div className="card__header">
          {icon && (
            <div className="card__icon">
              <Icon name={icon} size="lg" color="accent" />
            </div>
          )}
          <div className="card__title-section">
            {title && (
              <Typography variant="h4" className="card__title">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="secondary" className="card__subtitle">
                {subtitle}
              </Typography>
            )}
          </div>
        </div>
      )}
      
      {children && (
        <div className="card__content">
          {children}
        </div>
      )}
    </div>
  );
};