import { IsString, IsOptional, IsLatitude, IsLongitude, Length, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'CityOrCoords', async: false })
export class CityOrCoordsConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    const hasCity = !!obj.city;
    const hasCoords = obj.lat !== undefined && obj.lon !== undefined;
    return (hasCity && !hasCoords) || (!hasCity && hasCoords);
  }
  defaultMessage(args: ValidationArguments) {
    return 'Provide either city or both lat and lon, but not both.';
  }
}

export class CityQueryDto {
  @IsString({ message: 'City must be a string.' })
  @Length(1, 100, { message: 'City name must be between 1 and 100 characters.' })
  city: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string.' })
  @Length(2, 3, { message: 'Country code must be 2 or 3 characters (ISO 3166).' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string.' })
  @Length(1, 100, { message: 'State/region/oblast must be between 1 and 100 characters.' })
  state?: string;
}

export class AirQualityQueryDto {
  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  @Length(1, 100, { message: 'City name must be between 1 and 100 characters.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string.' })
  @Length(2, 3, { message: 'Country code must be 2 or 3 characters (ISO 3166).' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string.' })
  @Length(1, 100, { message: 'State/region/oblast must be between 1 and 100 characters.' })
  state?: string;

  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @Type(() => Number)
  @IsLatitude({ message: 'Latitude must be a valid coordinate (-90 to 90).' })
  lat?: number;

  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @Type(() => Number)
  @IsLongitude({ message: 'Longitude must be a valid coordinate (-180 to 180).' })
  lon?: number;
}

export class ForecastQueryDto {
  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  @Length(1, 100, { message: 'City name must be between 1 and 100 characters.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string.' })
  @Length(2, 3, { message: 'Country code must be 2 or 3 characters (ISO 3166).' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string.' })
  @Length(1, 100, { message: 'State/region/oblast must be between 1 and 100 characters.' })
  state?: string;

  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @Type(() => Number)
  @IsLatitude({ message: 'Latitude must be a valid coordinate (-90 to 90).' })
  lat?: number;

  @Validate(CityOrCoordsConstraint)
  @IsOptional()
  @Type(() => Number)
  @IsLongitude({ message: 'Longitude must be a valid coordinate (-180 to 180).' })
  lon?: number;

  @IsOptional()
  @Type(() => Number)
  days?: number; // For future extension, not used in OWM free tier
} 