import React from 'react';
import './Input.css';
import type { InputProps } from '../../../types';

export const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  fullWidth = false,
  error = false,
  errorMessage,
  label,
  className = '',
  onChange,
  onBlur,
  onFocus,
}) => {
  const inputClasses = [
    'input',
    error && 'input--error',
    disabled && 'input--disabled',
    fullWidth && 'input--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};