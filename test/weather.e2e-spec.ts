import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Weather API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/weather (GET)', () => {
    it('should return weather data for a valid city', () => {
      return request(app.getHttpServer())
        .get('/weather')
        .query({ city: 'London' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('city', 'London');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
          expect(res.body).toHaveProperty('temperature');
          expect(res.body).toHaveProperty('description');
        });
    });

    it('should return weather data with country and state', () => {
      return request(app.getHttpServer())
        .get('/weather')
        .query({ city: 'Springfield', country: 'US', state: 'IL' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('city', 'Springfield');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });

    it('should return 400 for missing city', () => {
      return request(app.getHttpServer())
        .get('/weather')
        .expect(400);
    });

    it('should return 400 for empty city', () => {
      return request(app.getHttpServer())
        .get('/weather')
        .query({ city: '' })
        .expect(400);
    });
  });

  describe('/weather/summary (GET)', () => {
    it('should return weather summary with recommendations', () => {
      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ city: 'London' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('city', 'London');
          expect(res.body).toHaveProperty('summary');
          expect(res.body).toHaveProperty('recommendation');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });
  });

  describe('/weather/forecast (GET)', () => {
    it('should return forecast data for a city', () => {
      return request(app.getHttpServer())
        .get('/weather/forecast')
        .query({ city: 'London' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('city', 'London');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });

    it('should return forecast data for coordinates', () => {
      return request(app.getHttpServer())
        .get('/weather/forecast')
        .query({ lat: 51.5074, lon: -0.1278 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });

    it('should return 400 when neither city nor coordinates provided', () => {
      return request(app.getHttpServer())
        .get('/weather/forecast')
        .expect(400);
    });

    it('should return 400 when both city and coordinates provided', () => {
      return request(app.getHttpServer())
        .get('/weather/forecast')
        .query({ city: 'London', lat: 51.5074, lon: -0.1278 })
        .expect(400);
    });
  });

  describe('/weather/air-quality (GET)', () => {
    it('should return air quality data for a city', () => {
      return request(app.getHttpServer())
        .get('/weather/air-quality')
        .query({ city: 'London' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('coord');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });

    it('should return air quality data for coordinates', () => {
      return request(app.getHttpServer())
        .get('/weather/air-quality')
        .query({ lat: 51.5074, lon: -0.1278 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('coord');
          expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        });
    });
  });
}); 