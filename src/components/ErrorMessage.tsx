import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4 max-w-md mx-auto">
      <div className="flex items-center">
        <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 mr-2" />
        <span className="text-red-700 dark:text-red-300">{message}</span>
      </div>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-3 w-full py-2 bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-800 
                   text-red-600 dark:text-red-300 font-medium rounded-md transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}