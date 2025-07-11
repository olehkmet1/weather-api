import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty()
  city: string;

  @ApiProperty()
  temperature: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  humidity: number;

  @ApiProperty()
  windSpeed: number;

  @ApiProperty()
  pressure: number;

  @ApiProperty({ description: 'Visibility in meters' })
  visibility: number;

  @ApiProperty({ description: 'Dew point in Celsius' })
  dewPoint: number;
}

export class WeatherSummaryResponseDto extends WeatherResponseDto {
  @ApiProperty()
  summary: string;

  @ApiProperty()
  recommendation: string;
}

export class AirQualityResponseDto {
  @ApiProperty({ example: { lat: 51.51, lon: -0.13 } })
  coord: { lat: string; lon: string };

  @ApiProperty({ description: 'Air Quality Index (1=Good, 5=Very Poor)' })
  aqi: number;

  @ApiProperty({ example: { co: 201.94, no: 0.01, no2: 0.01, o3: 68.66, so2: 0.64, pm2_5: 0.5, pm10: 0.54, nh3: 0.12 } })
  components: Record<string, number>;

  @ApiProperty()
  source: string;
}

@Injectable()
export class WeatherService {
  async getWeatherByCity(city: string): Promise<WeatherResponseDto> {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log('OPENWEATHERMAP_API_KEY:', apiKey ? apiKey.substring(0, 4) + '...' : 'NOT SET');
    if (!apiKey) {
      throw new HttpException('OpenWeatherMap API key not set', 500);
    }
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
          },
        },
      );
      const data = response.data;
      // Calculate dew point if not provided
      const dewPoint = this.calculateDewPoint(data.main.temp, data.main.humidity);
      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        source: 'OpenWeatherMap',
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility,
        dewPoint,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch weather data',
        error.response?.status || 500,
      );
    }
  }

  private calculateDewPoint(temp: number, humidity: number): number {
    // Magnus formula
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return parseFloat(((b * alpha) / (a - alpha)).toFixed(2));
  }

  async getWeatherSummary(city: string): Promise<any> {
    const weather = await this.getWeatherByCity(city);
    const summary = this.generateSummary(weather);
    const recommendation = this.generateRecommendation(weather);
    return {
      city: weather.city,
      temperature: weather.temperature,
      description: weather.description,
      summary,
      recommendation,
      source: weather.source,
    };
  }

  private generateSummary(weather: WeatherResponseDto): string {
    if (weather.temperature > 25) {
      return `It's hot and ${weather.description}.`;
    } else if (weather.temperature > 15) {
      return `It's warm and ${weather.description}.`;
    } else if (weather.temperature > 5) {
      return `It's cool and ${weather.description}.`;
    } else {
      return `It's cold and ${weather.description}.`;
    }
  }

  private generateRecommendation(weather: WeatherResponseDto): string {
    if (weather.temperature > 25) {
      return 'Stay hydrated and wear light clothing.';
    } else if (weather.temperature > 15) {
      return 'A light jacket should be enough.';
    } else if (weather.temperature > 5) {
      return 'Wear a warm jacket.';
    } else {
      return 'Bundle up! It’s very cold.';
    }
  }

  async getAirQualityByCoords(lat: string, lon: string): Promise<any> {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw new HttpException('OpenWeatherMap API key not set', 500);
    }
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/air_pollution',
        {
          params: {
            lat,
            lon,
            appid: apiKey,
          },
        },
      );
      const data = response.data;
      return {
        coord: { lat, lon },
        aqi: data.list[0].main.aqi,
        components: data.list[0].components,
        source: 'OpenWeatherMap',
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch air quality data',
        error.response?.status || 500,
      );
    }
  }

  async getAirQualityByCity(city: string, country?: string, state?: string): Promise<any> {
    const { lat, lon } = await this.getCoordsByCity(city, country, state);
    return this.getAirQualityByCoords(lat, lon);
  }

  private async getCoordsByCity(city: string, country?: string, state?: string): Promise<{ lat: string; lon: string }> {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw new HttpException('OpenWeatherMap API key not set', 500);
    }
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: city,
            country,
            state,
            appid: apiKey,
            limit: 1,
          },
        },
      );
      const data = response.data;
      if (!data.length) {
        throw new HttpException('City not found', 404);
      }
      return { lat: data[0].lat.toString(), lon: data[0].lon.toString() };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to resolve city coordinates',
        error.response?.status || 500,
      );
    }
  }
} 