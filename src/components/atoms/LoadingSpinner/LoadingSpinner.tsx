import React from 'react';
import { Typography } from '../';
import './LoadingSpinner.css';
import type { LoadingSpinnerProps } from '../../../types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  overlay = false,
  className = '',
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    overlay && 'loading-spinner--overlay',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className="loading-spinner__content">
      <div className="loading-spinner__icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="loading-spinner__svg"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>
      
      {message && (
        <Typography 
          variant="body2" 
          color="secondary" 
          className="loading-spinner__message"
        >
          {message}
        </Typography>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className={spinnerClasses}>
        <div className="loading-spinner__backdrop" />
        {content}
      </div>
    );
  }

  return <div className={spinnerClasses}>{content}</div>;
};