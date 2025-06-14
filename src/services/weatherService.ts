import { WeatherData, LocationData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function searchLocations(query: string): Promise<LocationData[]> {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch location data');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    // Get current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!currentResponse.ok) {
      const errorData = await currentResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch current weather data');
    }
    
    const currentData = await currentResponse.json();
    
    // Get forecast data
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch forecast data');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process and extract daily forecast (one forecast per day)
    const dailyForecasts = extractDailyForecasts(forecastData.list);
    
    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat,
        lon
      },
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        weather: currentData.weather[0],
        dt: currentData.dt
      },
      forecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Helper function to extract one forecast per day
function extractDailyForecasts(forecastList: any[]): any[] {
  const dailyData: { [key: string]: any } = {};
  
  // Group forecasts by day
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!dailyData[day]) {
      dailyData[day] = {
        dt: item.dt,
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max
        },
        weather: item.weather[0]
      };
    } else {
      // Update min/max temperatures
      dailyData[day].temp.min = Math.min(dailyData[day].temp.min, item.main.temp_min);
      dailyData[day].temp.max = Math.max(dailyData[day].temp.max, item.main.temp_max);
    }
  });
  
  // Convert to array and take only the next 7 days
  return Object.values(dailyData).slice(0, 7).map(day => ({
    ...day,
    temp: {
      min: Math.round(day.temp.min),
      max: Math.round(day.temp.max)
    }
  }));
}