import React from 'react';
import { Typography, Icon } from '../../atoms';
import './Card.css';

export interface CardAction {
  id: string;
  label: string;
  icon: 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle';
  variant?: 'default' | 'highlight' | 'stats';
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
  actions?: CardAction[];
  showActionsOnHover?: boolean;
  description?: string;
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
  actions = [],
  showActionsOnHover = true,
  description,
}) => {
  const classes = [
    'card',
    `card--${variant}`,
    (clickable || onClick) && !actions.length && 'card--clickable', 
    actions.length > 0 && 'card--with-actions',
    showActionsOnHover && actions.length > 0 && 'card--hover-actions',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleCardClick = () => {
    if ((clickable || onClick) && actions.length === 0 && onClick) {
      onClick();
    }
  };

  const handleActionClick = (action: CardAction, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!action.disabled) {
      action.onClick();
    }
  };

  return (
    <div className={classes} onClick={handleCardClick}>
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
      
      {description && !children && (
        <div className="card__description">
          <Typography variant="body2" color="secondary">
            {description}
          </Typography>
        </div>
      )}
      
      {children && (
        <div className="card__content">
          {children}
        </div>
      )}

      {actions.length > 0 && (
        <div className="card__actions">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`card__action-button card__action-button--${action.variant || 'outline'}`}
              onClick={(e) => handleActionClick(action, e)}
              disabled={action.disabled}
              title={action.label}
            >
              <Icon name={action.icon} size="sm" color="primary" />
              <span className="card__action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};