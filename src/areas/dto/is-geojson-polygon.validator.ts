import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import geojsonValidation from 'geojson-validation';

function isValidCoordinate(coord: any): boolean {
  if (!Array.isArray(coord) || coord.length < 2) {
    return false;
  }
  
  const [longitude, latitude] = coord;
  
  // Verificar se são números
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return false;
  }
  
  // Verificar ranges geográficos válidos
  // Longitude: -180 a 180
  // Latitude: -90 a 90
  return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

function isValidLinearRing(ring: any): boolean {
  if (!Array.isArray(ring) || ring.length < 4) {
    return false;
  }
  
  // Verificar se todos os pontos são coordenadas válidas
  if (!ring.every(isValidCoordinate)) {
    return false;
  }
  
  // Verificar se o anel está fechado (primeiro e último pontos são iguais)
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}

export function IsGeoJSONPolygon(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGeoJSONPolygon',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          // Verificações básicas
          if (!value || typeof value !== 'object') {
            return false;
          }
          
          // Verificar tipo
          if (value.type !== 'Polygon') {
            return false;
          }
          
          // Verificar se coordinates existe e é um array
          if (!Array.isArray(value.coordinates)) {
            return false;
          }
          
          // Verificar se coordinates não está vazio
          if (value.coordinates.length === 0) {
            return false;
          }
          
          // Verificar se todos os anéis são válidos
          if (!value.coordinates.every(isValidLinearRing)) {
            return false;
          }
          
          // Usar a biblioteca geojson-validation como validação adicional
          // mas com proteção contra erros
          try {
            return geojsonValidation.isPolygon(value);
          } catch (error) {
            // Se a biblioteca quebrar, retornar false
            return false;
          }
        },
        defaultMessage(_args: ValidationArguments) {
          return 'O campo deve ser um GeoJSON Polygon válido.';
        },
      },
    });
  };
}
