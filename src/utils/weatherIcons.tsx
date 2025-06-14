import React from 'react';
import { 
  Cloud, 
  CloudDrizzle, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudFog,
  CloudSun
} from 'lucide-react';

export function getWeatherIcon(weatherId: number) {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return CloudLightning;
  }
  
  // Drizzle
  if (weatherId >= 300 && weatherId < 400) {
    return CloudDrizzle;
  }
  
  // Rain
  if (weatherId >= 500 && weatherId < 600) {
    return CloudRain;
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return CloudSnow;
  }
  
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return CloudFog;
  }
  
  // Clear
  if (weatherId === 800) {
    return Sun;
  }
  
  // Clouds
  if (weatherId === 801) {
    return CloudSun;
  }
  
  // More cloudy
  if (weatherId > 801 && weatherId < 900) {
    return Cloud;
  }
  
  // Default
  return Cloud;
}