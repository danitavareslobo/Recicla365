import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundTemplate.css';
import type { NotFoundTemplateProps } from '../../../types';

const NotFoundTemplate: React.FC<NotFoundTemplateProps> = ({
  title = "Página não encontrada",
  message = "A página que você está procurando não existe.",
  linkText = "Voltar ao Dashboard",
  linkTo = "/dashboard",
  showIcon = true
}) => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        {showIcon && (
          <div className="not-found__icon">
            🔍
          </div>
        )}
        
        <h1 className="not-found__title">
          {title}
        </h1>
        
        <p className="not-found__message">
          {message}
        </p>
        
        <Link 
          to={linkTo} 
          className="not-found__link"
        >
          <span>←</span>
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundTemplate;