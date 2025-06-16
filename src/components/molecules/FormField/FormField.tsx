import React from 'react';
import { Input, Typography, Icon } from '../../atoms';
import './FormField.css';
import type { FormFieldProps } from '../../../types';

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  fullWidth = true,
  error = false,
  errorMessage,
  helperText,
  icon,
  className = '',
  onChange,
  onBlur,
  onFocus,
}) => {
  const fieldClasses = [
    'form-field',
    fullWidth && 'form-field--full-width',
    error && 'form-field--error',
    disabled && 'form-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClasses}>
      <div className="form-field__label-container">
        <Typography 
          variant="body2" 
          weight="medium" 
          className="form-field__label"
          component="span"
        >
          {icon && (
            <Icon 
              name={icon} 
              size="sm" 
              className="form-field__label-icon" 
            />
          )}
          {label}
          {required && (
            <span className="form-field__required">*</span>
          )}
        </Typography>
      </div>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        error={error}
        className="form-field__input"
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {(error && errorMessage) && (
        <div className="form-field__error">
          <Icon name="close" size="sm" color="error" />
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        </div>
      )}

      {(!error && helperText) && (
        <Typography 
          variant="caption" 
          color="secondary" 
          className="form-field__helper"
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};