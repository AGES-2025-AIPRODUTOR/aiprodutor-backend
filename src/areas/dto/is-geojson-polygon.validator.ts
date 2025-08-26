import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import geojsonValidation from 'geojson-validation';

export function IsGeoJSONPolygon(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGeoJSONPolygon',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return geojsonValidation.isPolygon(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'O campo deve ser um GeoJSON Polygon válido.';
        },
      },
    });
  };
}
