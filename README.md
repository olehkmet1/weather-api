# Weather API

A comprehensive weather and air quality API built with Nest.js that provides current weather data, forecasts, and air quality information. Perfect for developers building weather apps, travel platforms, or any application that needs reliable weather data.

## 🌤️ What This API Does

### Current Weather
Get detailed current weather information for any city:
- Temperature, humidity, wind speed, pressure, visibility, and dew point
- Human-readable weather descriptions
- Support for city disambiguation using country and state/region

### Weather Summaries & Recommendations
Get weather data with added intelligence:
- Plain-English weather summaries (e.g., "It's cool and light rain")
- Smart recommendations (e.g., "Wear a warm jacket")
- All the raw weather data plus actionable insights

### 5-Day Weather Forecasts
Plan ahead with detailed forecasts:
- 3-hour interval forecasts for the next 5 days
- Temperature, weather conditions, and atmospheric data
- Available by city name or coordinates

### Air Quality Data
Monitor environmental conditions:
- Air Quality Index (AQI) from 1 (Good) to 5 (Very Poor)
- Detailed pollutant breakdown (CO, NO2, O3, PM2.5, PM10, etc.)
- Available by city or exact coordinates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weather-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```
   
   This will:
   - Start the server on `http://localhost:3000`
   - Automatically open Swagger docs at `http://localhost:3000/api`
   - Enable hot reload for development

### Testing the API

Once running, you can test the endpoints:

- **Current Weather:** `GET http://localhost:3000/weather?city=London`
- **Weather Summary:** `GET http://localhost:3000/weather/summary?city=London`
- **Forecast:** `GET http://localhost:3000/weather/forecast?city=London`
- **Air Quality:** `GET http://localhost:3000/weather/air-quality?city=London`

### Interactive Documentation

Visit `http://localhost:3000/api` to see the interactive Swagger documentation where you can:
- Test all endpoints directly in your browser
- See request/response schemas
- Try different parameters and see examples

## 🌍 City Disambiguation

For cities with common names, use country and state/region parameters:

```bash
# Get weather for Springfield, Illinois, USA
GET /weather?city=Springfield&country=US&state=IL

# Get weather for Dnipro, Ukraine
GET /weather?city=Dnipro&country=UA&state=Dnipropetrovsk Oblast
```

## 📊 API Response Examples

### Current Weather
```json
{
  "city": "London",
  "temperature": 18,
  "description": "light rain",
  "humidity": 80,
  "windSpeed": 3.5,
  "pressure": 1012,
  "visibility": 10000,
  "dewPoint": 14.2,
  "source": "OpenWeatherMap"
}
```

### Weather Summary
```json
{
  "city": "London",
  "temperature": 18,
  "description": "light rain",
  "summary": "It's cool and light rain.",
  "recommendation": "Wear a warm jacket.",
  "source": "OpenWeatherMap"
}
```

## 🛠️ Development

### Project Structure
```
src/
├── weather/
│   ├── dto/
│   │   └── weather.dto.ts      # Validation DTOs
│   ├── weather.controller.ts   # API endpoints
│   ├── weather.service.ts      # Business logic
│   └── weather.module.ts       # Module configuration
├── app.controller.ts           # Health check endpoint
├── app.module.ts              # Main application module
└── main.ts                    # Application bootstrap
```

### Available Scripts
- `npm run start:dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🔧 Configuration

The API uses environment variables for configuration:
- `OPENWEATHERMAP_API_KEY` - Your OpenWeatherMap API key
- `PORT` - Server port (default: 3000)

## 📝 License

[MIT](LICENSE)
