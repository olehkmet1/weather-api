import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.OPENWEATHERMAP_API_KEY;
  });

  describe('getWeatherByCity', () => {
    it('should return weather data for a valid city', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockGeocodingResponse = {
        data: [{ lat: 51.5074, lon: -0.1278 }]
      };
      
      const mockWeatherResponse = {
        data: {
          name: 'London',
          main: {
            temp: 18,
            humidity: 80,
            pressure: 1012,
          },
          weather: [{ description: 'light rain' }],
          wind: { speed: 3.5 },
          visibility: 10000,
        }
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockGeocodingResponse)
        .mockResolvedValueOnce(mockWeatherResponse);

      const result = await service.getWeatherByCity('London');

      expect(result).toEqual({
        city: 'London',
        temperature: 18,
        description: 'light rain',
        source: 'OpenWeatherMap',
        humidity: 80,
        windSpeed: 3.5,
        pressure: 1012,
        visibility: 10000,
        dewPoint: expect.any(Number),
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getWeatherByCity('London');

      expect(result).toEqual({
        city: 'London',
        temperature: null,
        description: 'API key missing (scaffold)',
        source: 'OpenWeatherMap',
        humidity: null,
        windSpeed: null,
        pressure: null,
        visibility: null,
        dewPoint: null,
      });
    });

    it('should handle geocoding errors', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404, data: { message: 'City not found' } }
      });

      await expect(service.getWeatherByCity('InvalidCity')).rejects.toThrow(HttpException);
    });
  });

  describe('getWeatherSummary', () => {
    it('should return weather summary with recommendations', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockGeocodingResponse = {
        data: [{ lat: 51.5074, lon: -0.1278 }]
      };
      
      const mockWeatherResponse = {
        data: {
          name: 'London',
          main: {
            temp: 18,
            humidity: 80,
            pressure: 1012,
          },
          weather: [{ description: 'light rain' }],
          wind: { speed: 3.5 },
          visibility: 10000,
        }
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockGeocodingResponse)
        .mockResolvedValueOnce(mockWeatherResponse);

      const result = await service.getWeatherSummary('London');

      expect(result).toEqual({
        city: 'London',
        temperature: 18,
        description: 'light rain',
        humidity: 80,
        windSpeed: 3.5,
        pressure: 1012,
        visibility: 10000,
        dewPoint: expect.any(Number),
        summary: expect.any(String),
        recommendation: expect.any(String),
        source: 'OpenWeatherMap',
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getWeatherSummary('London');

      expect(result).toEqual({
        city: 'London',
        temperature: null,
        description: 'API key missing (scaffold)',
        humidity: null,
        windSpeed: null,
        pressure: null,
        visibility: null,
        dewPoint: null,
        summary: null,
        recommendation: null,
        source: 'OpenWeatherMap',
      });
    });
  });

  describe('getForecastByCity', () => {
    it('should return forecast data for a valid city', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockGeocodingResponse = {
        data: [{ lat: 51.5074, lon: -0.1278 }]
      };
      
      const mockForecastResponse = {
        data: {
          city: { name: 'London', coord: { lat: 51.5074, lon: -0.1278 } },
          list: [{ dt: 1234567890, main: { temp: 18 }, weather: [{ description: 'light rain' }] }]
        }
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockGeocodingResponse)
        .mockResolvedValueOnce(mockForecastResponse);

      const result = await service.getForecastByCity('London');

      expect(result).toEqual({
        city: 'London',
        coord: { lat: 51.5074, lon: -0.1278 },
        forecast: [{ dt: 1234567890, main: { temp: 18 }, weather: [{ description: 'light rain' }] }],
        source: 'OpenWeatherMap',
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getForecastByCity('London');

      expect(result).toEqual({
        city: 'London',
        forecast: null,
        description: 'API key missing (scaffold)',
        source: 'OpenWeatherMap',
      });
    });
  });

  describe('getForecastByCoords', () => {
    it('should return forecast data for valid coordinates', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockForecastResponse = {
        data: {
          city: { name: 'London', coord: { lat: 51.5074, lon: -0.1278 } },
          list: [{ dt: 1234567890, main: { temp: 18 }, weather: [{ description: 'light rain' }] }]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockForecastResponse);

      const result = await service.getForecastByCoords('51.5074', '-0.1278');

      expect(result).toEqual({
        city: 'London',
        coord: { lat: 51.5074, lon: -0.1278 },
        forecast: [{ dt: 1234567890, main: { temp: 18 }, weather: [{ description: 'light rain' }] }],
        source: 'OpenWeatherMap',
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getForecastByCoords('51.5074', '-0.1278');

      expect(result).toEqual({
        coord: { lat: '51.5074', lon: '-0.1278' },
        forecast: null,
        description: 'API key missing (scaffold)',
        source: 'OpenWeatherMap',
      });
    });

    it('should handle forecast API errors', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Internal server error' } }
      });

      await expect(service.getForecastByCoords('51.5074', '-0.1278')).rejects.toThrow(HttpException);
    });
  });

  describe('getAirQualityByCity', () => {
    it('should return air quality data for a valid city', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockGeocodingResponse = {
        data: [{ lat: 51.5074, lon: -0.1278 }]
      };
      
      const mockAirQualityResponse = {
        data: {
          list: [{
            main: { aqi: 2 },
            components: { co: 201.94, no2: 0.01, o3: 68.66, pm2_5: 0.5, pm10: 0.54 }
          }]
        }
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockGeocodingResponse)
        .mockResolvedValueOnce(mockAirQualityResponse);

      const result = await service.getAirQualityByCity('London');

      expect(result).toEqual({
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: 2,
        components: { co: 201.94, no2: 0.01, o3: 68.66, pm2_5: 0.5, pm10: 0.54 },
        source: 'OpenWeatherMap',
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getAirQualityByCity('London');

      expect(result).toEqual({
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: null,
        components: {},
        source: 'OpenWeatherMap',
        description: 'API key missing (scaffold)',
      });
    });
  });

  describe('getAirQualityByCoords', () => {
    it('should return air quality data for valid coordinates', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      const mockAirQualityResponse = {
        data: {
          list: [{
            main: { aqi: 2 },
            components: { co: 201.94, no2: 0.01, o3: 68.66, pm2_5: 0.5, pm10: 0.54 }
          }]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockAirQualityResponse);

      const result = await service.getAirQualityByCoords('51.5074', '-0.1278');

      expect(result).toEqual({
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: 2,
        components: { co: 201.94, no2: 0.01, o3: 68.66, pm2_5: 0.5, pm10: 0.54 },
        source: 'OpenWeatherMap',
      });
    });

    it('should return scaffolded response when API key is missing', async () => {
      const result = await service.getAirQualityByCoords('51.5074', '-0.1278');

      expect(result).toEqual({
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: null,
        components: {},
        source: 'OpenWeatherMap',
        description: 'API key missing (scaffold)',
      });
    });

    it('should handle air quality API errors', async () => {
      process.env.OPENWEATHERMAP_API_KEY = 'test-key';
      
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 400, data: { message: 'Invalid coordinates' } }
      });

      await expect(service.getAirQualityByCoords('invalid', 'invalid')).rejects.toThrow(HttpException);
    });
  });

  describe('generateSummary', () => {
    it('should generate hot weather summary', () => {
      const weather = { temperature: 30, description: 'sunny' };
      const summary = (service as any).generateSummary(weather);
      expect(summary).toBe("It's hot and sunny.");
    });

    it('should generate warm weather summary', () => {
      const weather = { temperature: 20, description: 'partly cloudy' };
      const summary = (service as any).generateSummary(weather);
      expect(summary).toBe("It's warm and partly cloudy.");
    });

    it('should generate cool weather summary', () => {
      const weather = { temperature: 10, description: 'rainy' };
      const summary = (service as any).generateSummary(weather);
      expect(summary).toBe("It's cool and rainy.");
    });

    it('should generate cold weather summary', () => {
      const weather = { temperature: -5, description: 'snowy' };
      const summary = (service as any).generateSummary(weather);
      expect(summary).toBe("It's cold and snowy.");
    });
  });

  describe('generateRecommendation', () => {
    it('should generate hot weather recommendation', () => {
      const weather = { temperature: 30 };
      const recommendation = (service as any).generateRecommendation(weather);
      expect(recommendation).toBe('Stay hydrated and wear light clothing.');
    });

    it('should generate warm weather recommendation', () => {
      const weather = { temperature: 20 };
      const recommendation = (service as any).generateRecommendation(weather);
      expect(recommendation).toBe('A light jacket should be enough.');
    });

    it('should generate cool weather recommendation', () => {
      const weather = { temperature: 10 };
      const recommendation = (service as any).generateRecommendation(weather);
      expect(recommendation).toBe('Wear a warm jacket.');
    });

    it('should generate cold weather recommendation', () => {
      const weather = { temperature: -5 };
      const recommendation = (service as any).generateRecommendation(weather);
      expect(recommendation).toBe("Bundle up! It’s very cold.");
    });
  });

  describe('calculateDewPoint', () => {
    it('should calculate dew point correctly', () => {
      const dewPoint = (service as any).calculateDewPoint(20, 60);
      expect(dewPoint).toBeCloseTo(12.0, 1);
    });

    it('should handle high humidity', () => {
      const dewPoint = (service as any).calculateDewPoint(25, 90);
      expect(dewPoint).toBeCloseTo(23.24, 1);
    });

    it('should handle low humidity', () => {
      const dewPoint = (service as any).calculateDewPoint(15, 30);
      expect(dewPoint).toBeCloseTo(-2.44, 1);
    });
  });
}); 