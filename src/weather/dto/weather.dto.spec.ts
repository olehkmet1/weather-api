import { validate } from 'class-validator';
import { CityQueryDto, AirQualityQueryDto, ForecastQueryDto, CityOrCoordsConstraint } from './weather.dto';

describe('Weather DTOs', () => {
  describe('CityQueryDto', () => {
    it('should validate with valid city', async () => {
      const dto = new CityQueryDto();
      dto.city = 'London';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with city, country, and state', async () => {
      const dto = new CityQueryDto();
      dto.city = 'Springfield';
      dto.country = 'US';
      dto.state = 'IL';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty city', async () => {
      const dto = new CityQueryDto();
      dto.city = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
    });

    it('should fail validation with city too long', async () => {
      const dto = new CityQueryDto();
      dto.city = 'A'.repeat(101); // 101 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
    });

    it('should fail validation with invalid country code', async () => {
      const dto = new CityQueryDto();
      dto.city = 'London';
      dto.country = 'INVALID'; // Too long

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
    });

    it('should fail validation with state too long', async () => {
      const dto = new CityQueryDto();
      dto.city = 'London';
      dto.state = 'A'.repeat(101); // 101 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toBeDefined();
    });
  });

  describe('AirQualityQueryDto', () => {
    it('should validate with city only', async () => {
      const dto = new AirQualityQueryDto();
      dto.city = 'London';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with coordinates only', async () => {
      const dto = new AirQualityQueryDto();
      dto.lat = 51.5074;
      dto.lon = -0.1278;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with city, country, and state', async () => {
      const dto = new AirQualityQueryDto();
      dto.city = 'Dnipro';
      dto.country = 'UA';
      dto.state = 'Dnipropetrovsk Oblast';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with both city and coordinates', async () => {
      const dto = new AirQualityQueryDto();
      dto.city = 'London';
      dto.lat = 51.5074;
      dto.lon = -0.1278;

      const errors = await validate(dto);
      expect(errors).toHaveLength(3); // 3 validation errors for the constraint
    });

    it('should fail validation with neither city nor coordinates', async () => {
      const dto = new AirQualityQueryDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0); // No validation errors, but constraint will fail
    });

    it('should fail validation with invalid latitude', async () => {
      const dto = new AirQualityQueryDto();
      dto.lat = 100; // Invalid latitude
      dto.lon = -0.1278;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isLatitude).toBeDefined();
    });

    it('should fail validation with invalid longitude', async () => {
      const dto = new AirQualityQueryDto();
      dto.lat = 51.5074;
      dto.lon = 200; // Invalid longitude

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isLongitude).toBeDefined();
    });
  });

  describe('ForecastQueryDto', () => {
    it('should validate with city only', async () => {
      const dto = new ForecastQueryDto();
      dto.city = 'London';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with coordinates only', async () => {
      const dto = new ForecastQueryDto();
      dto.lat = 51.5074;
      dto.lon = -0.1278;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with city and days parameter', async () => {
      const dto = new ForecastQueryDto();
      dto.city = 'London';
      dto.days = 5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with both city and coordinates', async () => {
      const dto = new ForecastQueryDto();
      dto.city = 'London';
      dto.lat = 51.5074;
      dto.lon = -0.1278;

      const errors = await validate(dto);
      expect(errors).toHaveLength(3); // 3 validation errors for the constraint
    });
  });

  describe('CityOrCoordsConstraint', () => {
    let constraint: CityOrCoordsConstraint;

    beforeEach(() => {
      constraint = new CityOrCoordsConstraint();
    });

    it('should validate when only city is provided', () => {
      const obj = { city: 'London', lat: undefined, lon: undefined };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(true);
    });

    it('should validate when only coordinates are provided', () => {
      const obj = { city: undefined, lat: 51.5074, lon: -0.1278 };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(true);
    });

    it('should fail when both city and coordinates are provided', () => {
      const obj = { city: 'London', lat: 51.5074, lon: -0.1278 };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(false);
    });

    it('should fail when neither city nor coordinates are provided', () => {
      const obj = { city: undefined, lat: undefined, lon: undefined };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(false);
    });

    it('should fail when only lat is provided', () => {
      const obj = { city: undefined, lat: 51.5074, lon: undefined };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(false);
    });

    it('should fail when only lon is provided', () => {
      const obj = { city: undefined, lat: undefined, lon: -0.1278 };
      const result = constraint.validate(null, { object: obj } as any);
      expect(result).toBe(false);
    });

    it('should return correct error message', () => {
      const message = constraint.defaultMessage({} as any);
      expect(message).toBe('Provide either city or both lat and lon, but not both.');
    });
  });
}); 