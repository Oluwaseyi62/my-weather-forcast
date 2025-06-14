import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading weather data...</p>
    </div>
  );
}