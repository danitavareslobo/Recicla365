import React, { useState } from 'react';
import { Input, Button, Icon } from '../../atoms';
import './SearchBox.css';
import type { SearchBoxProps } from '../../../types';

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Buscar...',
  value,
  disabled = false,
  fullWidth = false,
  className = '',
  onSearch,
  onClear,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const searchBoxClasses = [
    'search-box',
    fullWidth && 'search-box--full-width',
    disabled && 'search-box--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={searchBoxClasses}>
      <div className="search-box__input-container">
        <div className="search-box__input-wrapper">
          <Icon 
            name="search" 
            size="sm" 
            color="secondary" 
            className="search-box__search-icon" 
          />
          
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            disabled={disabled}
            className="search-box__input"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          
          {searchTerm && !disabled && (
            <Icon
              name="close"
              size="sm"
              color="secondary"
              className="search-box__clear-icon"
              onClick={handleClear}
            />
          )}
        </div>
      </div>
      
      <Button
        variant="primary"
        disabled={disabled || !searchTerm.trim()}
        onClick={handleSearch}
        className="search-box__button"
      >
        <Icon name="search" size="sm" color="white" />
        Buscar
      </Button>
    </div>
  );
};