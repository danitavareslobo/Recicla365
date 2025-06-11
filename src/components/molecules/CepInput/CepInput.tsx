import React, { useState } from 'react';
import { Input, Typography, Icon } from '../../atoms';
import { ViaCepService } from '../../../services';
import type { ViaCepResponse } from '../../../types';
import './CepInput.css';

interface CepInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  onAddressFound?: (address: ViaCepResponse) => void;
  onCepChange?: (cep: string) => void;
  onError?: (error: string) => void;
}

export const CepInput: React.FC<CepInputProps> = ({
  id,
  value = '',
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  className = '',
  onAddressFound,
  onCepChange,
  onError,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = ViaCepService.maskCep(e.target.value);
    setInternalValue(maskedValue);
    onCepChange?.(maskedValue);
  };

  const handleBlur = async () => {
    const cleanCep = ViaCepService.cleanCep(internalValue);
    
    if (cleanCep.length === 0) return;
    
    if (!ViaCepService.isValidCep(cleanCep)) {
      onError?.('CEP deve ter 8 dígitos');
      return;
    }

    setIsLoading(true);
    
    try {
      const address = await ViaCepService.getAddressByCep(cleanCep);
      const formattedCep = ViaCepService.formatCep(cleanCep);
      setInternalValue(formattedCep);
      onCepChange?.(formattedCep);
      onAddressFound?.(address);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar CEP';
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = [
    'cep-input',
    isLoading && 'cep-input--loading',
    error && 'cep-input--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={inputClasses}>
      <div className="cep-input__label-container">
        <Typography 
          variant="body2" 
          weight="medium" 
          className="cep-input__label"
        >
          <Icon name="location" size="sm" className="cep-input__icon" />
          CEP
          {required && <span className="cep-input__required">*</span>}
        </Typography>
      </div>

      <div className="cep-input__field-container">
        <Input
          id={id}
          type="text"
          placeholder="00000-000"
          value={internalValue}
          disabled={disabled || isLoading}
          required={required}
          error={error}
          onChange={handleChange}
          onBlur={handleBlur}
          className="cep-input__field"
          fullWidth
        />
        
        {isLoading && (
          <div className="cep-input__loading">
            <Icon name="recycle" size="sm" className="cep-input__loading-icon" />
          </div>
        )}
      </div>

      {isLoading && (
        <Typography variant="caption" color="secondary" className="cep-input__helper">
          Buscando endereço...
        </Typography>
      )}

      {!isLoading && !error && (
        <Typography variant="caption" color="secondary" className="cep-input__helper">
          Digite o CEP para preencher automaticamente
        </Typography>
      )}

      {error && errorMessage && (
        <div className="cep-input__error">
          <Icon name="close" size="sm" color="error" />
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};