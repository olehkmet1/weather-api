import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  const mockWeatherService = {
    getWeatherByCity: jest.fn(),
    getWeatherSummary: jest.fn(),
    getForecastByCity: jest.fn(),
    getForecastByCoords: jest.fn(),
    getAirQualityByCity: jest.fn(),
    getAirQualityByCoords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    it('should return weather data for a city', async () => {
      const mockWeatherData = {
        city: 'London',
        temperature: 18,
        description: 'light rain',
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

      const result = await controller.getWeather({
        city: 'London',
        country: undefined,
        state: undefined,
      });

      expect(result).toEqual(mockWeatherData);
      expect(service.getWeatherByCity).toHaveBeenCalledWith('London', undefined, undefined);
    });

    it('should return weather data with country and state', async () => {
      const mockWeatherData = {
        city: 'Springfield',
        temperature: 22,
        description: 'clear sky',
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

      const result = await controller.getWeather({
        city: 'Springfield',
        country: 'US',
        state: 'IL',
      });

      expect(result).toEqual(mockWeatherData);
      expect(service.getWeatherByCity).toHaveBeenCalledWith('Springfield', 'US', 'IL');
    });
  });

  describe('getWeatherSummary', () => {
    it('should return weather summary for a city', async () => {
      const mockSummaryData = {
        city: 'London',
        temperature: 18,
        description: 'light rain',
        summary: "It's cool and light rain.",
        recommendation: 'Wear a warm jacket.',
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getWeatherSummary.mockResolvedValue(mockSummaryData);

      const result = await controller.getWeatherSummary({
        city: 'London',
        country: undefined,
        state: undefined,
      });

      expect(result).toEqual(mockSummaryData);
      expect(service.getWeatherSummary).toHaveBeenCalledWith('London', undefined, undefined);
    });

    it('should return weather summary with country and state', async () => {
      const mockSummaryData = {
        city: 'Dnipro',
        temperature: 25,
        description: 'clear sky',
        summary: "It's warm and clear sky.",
        recommendation: 'A light jacket should be enough.',
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getWeatherSummary.mockResolvedValue(mockSummaryData);

      const result = await controller.getWeatherSummary({
        city: 'Dnipro',
        country: 'UA',
        state: 'Dnipropetrovsk Oblast',
      });

      expect(result).toEqual(mockSummaryData);
      expect(service.getWeatherSummary).toHaveBeenCalledWith('Dnipro', 'UA', 'Dnipropetrovsk Oblast');
    });
  });

  describe('getForecast', () => {
    it('should return forecast data for a city', async () => {
      const mockForecastData = {
        city: 'London',
        coord: { lat: 51.5074, lon: -0.1278 },
        forecast: [{ dt: 1234567890, main: { temp: 18 } }],
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getForecastByCity.mockResolvedValue(mockForecastData);

      const result = await controller.getForecast({
        city: 'London',
        country: undefined,
        state: undefined,
        lat: undefined,
        lon: undefined,
        days: undefined,
      });

      expect(result).toEqual(mockForecastData);
      expect(service.getForecastByCity).toHaveBeenCalledWith('London', undefined, undefined);
    });

    it('should return forecast data for coordinates', async () => {
      const mockForecastData = {
        city: 'London',
        coord: { lat: 51.5074, lon: -0.1278 },
        forecast: [{ dt: 1234567890, main: { temp: 18 } }],
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getForecastByCoords.mockResolvedValue(mockForecastData);

      const result = await controller.getForecast({
        city: undefined,
        country: undefined,
        state: undefined,
        lat: 51.5074,
        lon: -0.1278,
        days: undefined,
      });

      expect(result).toEqual(mockForecastData);
      expect(service.getForecastByCoords).toHaveBeenCalledWith('51.5074', '-0.1278');
    });

    it('should throw error when neither city nor coordinates provided', async () => {
      await expect(
        controller.getForecast({
          city: undefined,
          country: undefined,
          state: undefined,
          lat: undefined,
          lon: undefined,
          days: undefined,
        })
      ).rejects.toThrow('Provide either city or both lat and lon');
    });
  });

  describe('getAirQuality', () => {
    it('should return air quality data for a city', async () => {
      const mockAirQualityData = {
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: 2,
        components: { co: 201.94, no2: 0.01 },
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getAirQualityByCity.mockResolvedValue(mockAirQualityData);

      const result = await controller.getAirQuality({
        city: 'London',
        country: undefined,
        state: undefined,
        lat: undefined,
        lon: undefined,
      });

      expect(result).toEqual(mockAirQualityData);
      expect(service.getAirQualityByCity).toHaveBeenCalledWith('London', undefined, undefined);
    });

    it('should return air quality data for coordinates', async () => {
      const mockAirQualityData = {
        coord: { lat: '51.5074', lon: '-0.1278' },
        aqi: 2,
        components: { co: 201.94, no2: 0.01 },
        source: 'OpenWeatherMap',
      };

      mockWeatherService.getAirQualityByCoords.mockResolvedValue(mockAirQualityData);

      const result = await controller.getAirQuality({
        city: undefined,
        country: undefined,
        state: undefined,
        lat: 51.5074,
        lon: -0.1278,
      });

      expect(result).toEqual(mockAirQualityData);
      expect(service.getAirQualityByCoords).toHaveBeenCalledWith('51.5074', '-0.1278');
    });

    it('should throw error when neither city nor coordinates provided', async () => {
      await expect(
        controller.getAirQuality({
          city: undefined,
          country: undefined,
          state: undefined,
          lat: undefined,
          lon: undefined,
        })
      ).rejects.toThrow('Provide either city or both lat and lon');
    });
  });
}); 