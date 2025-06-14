import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';
import { ForecastDay as ForecastDayType } from '../types/weather';

interface ForecastDayProps {
  day: ForecastDayType;
}

export default function ForecastDay({ day }: ForecastDayProps) {
  const WeatherIcon = getWeatherIcon(day.weather.id);
  const date = new Date(day.dt * 1000);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  
  return (
    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm 
                  border border-gray-100 dark:border-gray-700 transition-all duration-300
                  hover:shadow-md hover:scale-105">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dayName}</p>
      <WeatherIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 my-2" />
      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{day.weather.description}</p>
      <div className="flex justify-between w-full mt-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">{day.temp.max}°</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{day.temp.min}°</span>
      </div>
    </div>
  );
}