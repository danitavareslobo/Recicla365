import React, { useEffect, useState } from 'react';
import { Typography, Icon } from '../';
import './SuccessNotification.css';

interface SuccessNotificationProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  message,
  duration = 5000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const notificationClasses = [
    'success-notification',
    !isVisible && 'success-notification--hiding',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={notificationClasses}>
      <div className="success-notification__content">
        <Icon name="recycle" size="sm" color="success" />
        <Typography variant="body2" color="success" weight="medium">
          {message}
        </Typography>
      </div>
      
      <button
        onClick={handleClose}
        className="success-notification__close"
        aria-label="Fechar notificação"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
};