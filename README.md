# Weather API

A robust, developer-friendly weather and air quality API available on RapidAPI. Instantly fetch current weather, enriched summaries, forecasts, and air quality data by city or coordinates—no local installation required!

---

## Features
- **Current Weather:** Get temperature, humidity, wind, pressure, visibility, dew point, and more.
- **Enriched Summaries:** Human-friendly weather summaries and recommendations.
- **Forecasts:** 5-day/3-hour weather forecast by city or coordinates.
- **Air Quality:** Fetch air quality index and pollutant levels by city or coordinates.
- **City Disambiguation:** Use country and state/region for precise city lookups.
- **Interactive Docs:** Try endpoints directly on RapidAPI.

---

## Getting Started on RapidAPI

1. **Go to the [Weather API on RapidAPI](https://rapidapi.com/)**
2. **Subscribe to the API** (choose a free or paid plan as needed).
3. **Get your RapidAPI key** from your user dashboard.
4. **Use the API endpoints** directly from your app, website, or RapidAPI’s “Test Endpoint” feature.

---

## Authentication
- All requests require the `X-RapidAPI-Key` and `X-RapidAPI-Host` headers.
- Example (using `curl`):
  ```bash
  curl -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
       -H "X-RapidAPI-Host: your-rapidapi-host" \
       "https://your-rapidapi-host/weather?city=London"
  ```
- You can also use the code snippets provided by RapidAPI for Node.js, Python, JavaScript, etc.

---

## API Endpoints

### **Weather Data**
- `GET /weather?city=London`
- `GET /weather?city=Dnipro&country=UA&state=Dnipropetrovsk Oblast`
  - Returns raw weather data for a city, with optional country and state for disambiguation.
- `GET /weather/summary?city=London`
- `GET /weather/summary?city=Springfield&country=US&state=IL`
  - Returns weather data plus a human-friendly summary and recommendation, with optional country and state for disambiguation.

#### **Weather Data Fields**
- `city`, `temperature`, `description`, `humidity`, `windSpeed`, `pressure`, `visibility`, `dewPoint`, `source`
- `/summary` also returns: `summary`, `recommendation`

### **Forecast**
- `GET /weather/forecast?city=London`
- `GET /weather/forecast?city=Dnipro&country=UA&state=Dnipropetrovsk Oblast`
- `GET /weather/forecast?lat=51.51&lon=-0.13`
  - Returns 5-day/3-hour forecast for a city or coordinates.
  - Optional: `days` parameter (not used in free tier, default 5)

#### **Forecast Response Fields**
- `city`: City name
- `coord`: Coordinates
- `forecast`: Array of forecast objects (see [OpenWeatherMap forecast docs](https://openweathermap.org/forecast5#json))
- `source`: Data source

### **Air Quality**
- `GET /weather/air-quality?city=London`
- `GET /weather/air-quality?city=Dnipro&country=UA&state=Dnipropetrovsk Oblast`
- `GET /weather/air-quality?lat=51.51&lon=-0.13`
  - Returns air quality index and pollutant levels for a city or coordinates.

#### **Air Quality Fields**
- `coord`, `aqi`, `components`, `source`

---

## City Disambiguation
- Use `country` (ISO 3166 code) and `state` (region/province/oblast) to specify the exact city for all endpoints.
- Example: `city=Dnipro&country=UA&state=Dnipropetrovsk Oblast`
- `state` is most reliable for US, Canada, Australia, India, Russia, China, Germany, Ukraine, Brazil, Mexico, and others.

---

## Testing & Code Samples
- Use the “Test Endpoint” feature on RapidAPI to try out requests in your browser.
- RapidAPI provides ready-to-use code snippets for Node.js, Python, JavaScript, PHP, and more.

---

## Support & Questions
- Use the Q&A or contact form on RapidAPI to reach the API provider.
- For feature requests or bug reports, use the RapidAPI support tools.

---

## License
[MIT](LICENSE)
