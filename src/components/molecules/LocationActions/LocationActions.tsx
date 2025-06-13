import React, { useState } from 'react';
import { Button, Typography, Icon } from '../../atoms';
import { GeolocationService } from '../../../services';
import type { GeolocationPosition, LocationActionsProps } from '../../../types';
import './LocationActions.css';

export const LocationActions: React.FC<LocationActionsProps> = ({
  latitude,
  longitude,
  onLocationUpdate,
  disabled = false,
  className = '',
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetCurrentLocation = async () => {
    if (!GeolocationService.isGeolocationSupported()) {
      setLocationError('Geolocalização não suportada neste navegador');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await GeolocationService.getCurrentPosition();
      onLocationUpdate(position);
      
      setLocationError(null);
    } catch (error: any) {
      setLocationError(error.message || 'Erro ao obter localização');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleOpenInGoogleMaps = () => {
    try {
      const url = GeolocationService.buildGoogleMapsUrl(latitude, longitude);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setLocationError('Coordenadas inválidas para abrir no Google Maps');
    }
  };

  const canOpenMaps = latitude && longitude && 
    GeolocationService.validateCoordinates(latitude, longitude).isValid;

  const componentClasses = [
    'location-actions',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={componentClasses}>
      <div className="location-actions__buttons">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={disabled || isGettingLocation}
          className="location-actions__button location-actions__button--location"
        >
          {isGettingLocation ? (
            <>
              <Icon name="recycle" size="sm" />
              Obtendo...
            </>
          ) : (
            <>
              <Icon name="location-crosshairs" size="sm" />
              Usar minha localização atual
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleOpenInGoogleMaps}
          disabled={disabled || !canOpenMaps}
          className="location-actions__button location-actions__button--maps"
        >
          <Icon name="external-link" size="sm" />
          Ver no Google Maps
        </Button>
      </div>

      {locationError && (
        <div className="location-actions__error">
          <Icon name="close" size="sm" color="error" />
          <Typography variant="caption" color="error">
            {locationError}
          </Typography>
        </div>
      )}

      {canOpenMaps && (
        <div className="location-actions__coordinates">
          <Icon name="location" size="sm" color="accent" />
          <Typography variant="caption" color="secondary">
            Coordenadas: {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
          </Typography>
        </div>
      )}
    </div>
  );
};