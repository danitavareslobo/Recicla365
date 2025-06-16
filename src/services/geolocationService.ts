import type { GeolocationPosition, GeolocationError } from "../types";

export class GeolocationService {
  private static readonly TIMEOUT_MS = 15000;
  private static readonly MAX_AGE_MS = 60000;

  static isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  static async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject({
          code: 0,
          message: 'Geolocalização não suportada neste navegador',
        });
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: this.TIMEOUT_MS,
        maximumAge: this.MAX_AGE_MS,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Permissão de localização negada. Verifique as configurações do navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Localização indisponível. Verifique sua conexão GPS.';
              break;
            case error.TIMEOUT:
              message = 'Tempo limite excedido. Tente novamente.';
              break;
            default:
              message = 'Erro desconhecido ao obter localização.';
              break;
          }

          reject({
            code: error.code,
            message,
          });
        },
        options
      );
    });
  }

  static formatCoordinates(position: GeolocationPosition): {
    latitude: string;
    longitude: string;
  } {
    return {
      latitude: position.latitude.toFixed(6),
      longitude: position.longitude.toFixed(6),
    };
  }

  static buildGoogleMapsUrl(latitude: string | number, longitude: string | number): string {
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
    
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Coordenadas inválidas');
    }

    return `https://www.google.com/maps?q=${lat},${lng}&z=15`;
  }

  static validateCoordinates(latitude: string, longitude: string): {
    isValid: boolean;
    errors: { latitude?: string; longitude?: string };
  } {
    const errors: { latitude?: string; longitude?: string } = {};
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!latitude || isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude deve estar entre -90 e 90';
    }

    if (!longitude || isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude deve estar entre -180 e 180';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}