import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService, WeatherResponseDto, WeatherSummaryResponseDto, AirQualityResponseDto } from './weather.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsString, IsOptional, IsLatitude, IsLongitude, Length, ValidateIf, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationPipe } from '@nestjs/common';
import { CityQueryDto, AirQualityQueryDto, ForecastQueryDto } from './dto/weather.dto';

@ValidatorConstraint({ name: 'CityOrCoords', async: false })
class CityOrCoordsConstraint implements ValidatorConstraintInterface {
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

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiQuery({ name: 'city', required: true, description: 'City name to get weather for' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (ISO 3166) for city disambiguation' })
  @ApiQuery({ name: 'state', required: false, description: 'State/region/oblast for city disambiguation' })
  @ApiResponse({ status: 200, description: 'Weather data returned successfully.', type: WeatherResponseDto })
  async getWeather(
    @Query(new ValidationPipe({ transform: true })) query: CityQueryDto,
  ) {
    return this.weatherService.getWeatherByCity(query.city, query.country, query.state);
  }

  @Get('summary')
  @ApiQuery({ name: 'city', required: true, description: 'City name to get weather summary for' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (ISO 3166) for city disambiguation' })
  @ApiQuery({ name: 'state', required: false, description: 'State/region/oblast for city disambiguation' })
  @ApiResponse({ status: 200, description: 'Weather summary and recommendations.', type: WeatherSummaryResponseDto })
  async getWeatherSummary(
    @Query(new ValidationPipe({ transform: true })) query: CityQueryDto,
  ) {
    return this.weatherService.getWeatherSummary(query.city, query.country, query.state);
  }

  @Get('air-quality')
  @ApiQuery({ name: 'city', required: false, description: 'City name for air quality data' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (ISO 3166) for city disambiguation' })
  @ApiQuery({ name: 'state', required: false, description: 'State code (for US cities) for city disambiguation' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude for air quality data' })
  @ApiQuery({ name: 'lon', required: false, description: 'Longitude for air quality data' })
  @ApiResponse({ status: 200, description: 'Air quality data for the given city or coordinates.', type: AirQualityResponseDto })
  async getAirQuality(
    @Query(new ValidationPipe({ transform: true })) query: AirQualityQueryDto,
  ) {
    if (query.city) {
      return this.weatherService.getAirQualityByCity(query.city, query.country, query.state);
    } else if (query.lat !== undefined && query.lon !== undefined) {
      return this.weatherService.getAirQualityByCoords(query.lat.toString(), query.lon.toString());
    } else {
      throw new Error('Provide either city or both lat and lon');
    }
  }

  @Get('forecast')
  @ApiQuery({ name: 'city', required: false, description: 'City name for forecast data' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (ISO 3166) for city disambiguation' })
  @ApiQuery({ name: 'state', required: false, description: 'State/region/oblast for city disambiguation' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude for forecast data' })
  @ApiQuery({ name: 'lon', required: false, description: 'Longitude for forecast data' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days for forecast (not used in free tier, default 5)' })
  @ApiResponse({ status: 200, description: 'Weather forecast data for the given city or coordinates.' })
  async getForecast(
    @Query(new ValidationPipe({ transform: true })) query: ForecastQueryDto,
  ) {
    if (query.city) {
      return this.weatherService.getForecastByCity(query.city, query.country, query.state);
    } else if (query.lat !== undefined && query.lon !== undefined) {
      return this.weatherService.getForecastByCoords(query.lat.toString(), query.lon.toString());
    } else {
      throw new Error('Provide either city or both lat and lon');
    }
  }
} 