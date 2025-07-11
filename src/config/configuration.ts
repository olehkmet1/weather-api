export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  openWeatherMap: {
    apiKey: process.env.OPENWEATHERMAP_API_KEY,
    baseUrl: 'https://api.openweathermap.org',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10), // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per minute
  },
  swagger: {
    title: 'Weather API',
    description: 'A comprehensive weather data API',
    version: '1.0',
  },
}); 