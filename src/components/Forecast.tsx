import React from 'react';
import ForecastDay from './ForecastDay';
import { ForecastDay as ForecastDayType } from '../types/weather';

interface ForecastProps {
  forecast: ForecastDayType[];
}

export default function Forecast({ forecast }: ForecastProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-4">7-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 px-4">
        {forecast.map((day, index) => (
          <ForecastDay key={day.dt} day={day} />
        ))}
      </div>
    </div>
  );
}