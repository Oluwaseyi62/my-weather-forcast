import React from 'react';
import { Droplets, Wind, Thermometer, Star } from 'lucide-react';
import { getWeatherIcon } from '../utils/weatherIcons';
import { WeatherData, LocationData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  isFavorite?: (location: LocationData) => boolean;
  onToggleFavorite?: (location: LocationData) => void;
}

export default function CurrentWeather({ data, isFavorite, onToggleFavorite }: CurrentWeatherProps) {
  const { location, current } = data;
  const WeatherIcon = getWeatherIcon(current.weather.id);
  const formattedDate = new Date(current.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(location);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300 w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {location.name}, {location.country}
            </h2>
            {isFavorite && onToggleFavorite && (
              <button
                onClick={handleToggleFavorite}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={isFavorite(location) ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite(location) ? "Remove from favorites" : "Add to favorites"}
              >
                <Star 
                  className={`w-6 h-6 ${
                    isFavorite(location) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} 
                />
              </button>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <WeatherIcon className="w-24 h-24 text-blue-500 dark:text-blue-400" />
          <div className="ml-4">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">{current.temp}°C</div>
            <div className="text-gray-600 dark:text-gray-300 capitalize">
              {current.weather.description}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
            <Thermometer className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Feels Like</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">{current.feels_like}°C</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
            <Droplets className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Humidity</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">{current.humidity}%</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
            <Wind className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Wind</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">{current.wind_speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}