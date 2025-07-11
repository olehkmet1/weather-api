import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherResponseDto } from './weather.service';
import { WeatherSummaryResponseDto } from './weather.service';
import { AirQualityResponseDto } from './weather.service';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiQuery({ name: 'city', required: true, description: 'City name to get weather for' })
  @ApiResponse({ status: 200, description: 'Weather data returned successfully.', type: WeatherResponseDto })
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeatherByCity(city);
  }

  @Get('summary')
  @ApiQuery({ name: 'city', required: true, description: 'City name to get weather summary for' })
  @ApiResponse({ status: 200, description: 'Weather summary and recommendations.', type: WeatherSummaryResponseDto })
  async getWeatherSummary(@Query('city') city: string) {
    return this.weatherService.getWeatherSummary(city);
  }

  @Get('air-quality')
  @ApiQuery({ name: 'city', required: false, description: 'City name for air quality data' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (ISO 3166) for city disambiguation' })
  @ApiQuery({ name: 'state', required: false, description: 'State code (for US cities) for city disambiguation' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude for air quality data' })
  @ApiQuery({ name: 'lon', required: false, description: 'Longitude for air quality data' })
  @ApiResponse({ status: 200, description: 'Air quality data for the given city or coordinates.', type: AirQualityResponseDto })
  async getAirQuality(
    @Query('city') city?: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    if (city) {
      return this.weatherService.getAirQualityByCity(city, country, state);
    } else if (lat && lon) {
      return this.weatherService.getAirQualityByCoords(lat, lon);
    } else {
      throw new Error('Provide either city or both lat and lon');
    }
  }
} 