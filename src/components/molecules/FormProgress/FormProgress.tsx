import React from 'react';
import { Typography } from '../../atoms';
import './FormProgress.css';

interface FormProgressProps {
  percentage: number;
  completed: number;
  total: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  percentage,
  completed,
  total,
  showDetails = true,
  size = 'md',
  className = '',
}) => {
  const progressClasses = [
    'form-progress',
    `form-progress--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getProgressColor = () => {
    if (percentage >= 90) return '#22c55e'; 
    if (percentage >= 70) return '#f59e0b'; 
    if (percentage >= 50) return '#3b82f6'; 
    return '#6b7280'; 
  };

  const getProgressMessage = () => {
    if (percentage === 100) return 'Formulário completo!';
    if (percentage >= 80) return 'Quase pronto!';
    if (percentage >= 50) return 'Progresso bom!';
    if (percentage >= 25) return 'Continue preenchendo...';
    return 'Vamos começar!';
  };

  return (
    <div className={progressClasses}>
      <div className="form-progress__header">
        <Typography variant="body2" weight="medium" className="form-progress__title">
          Progresso do Formulário
        </Typography>
        
        <Typography variant="body2" color="secondary" className="form-progress__percentage">
          {percentage}%
        </Typography>
      </div>

      <div className="form-progress__bar-container">
        <div 
          className="form-progress__bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getProgressColor(),
          }}
        />
        <div className="form-progress__track" />
      </div>

      {showDetails && (
        <div className="form-progress__details">
          <Typography variant="caption" color="secondary">
            {completed} de {total} campos preenchidos
          </Typography>
          
          <Typography variant="caption" className="form-progress__message">
            {getProgressMessage()}
          </Typography>
        </div>
      )}
    </div>
  );
};