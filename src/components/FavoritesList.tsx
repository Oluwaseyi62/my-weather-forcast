import React from 'react';
import { Star, MapPin, Trash2 } from 'lucide-react';
import { FavoriteLocation, LocationData } from '../types/weather';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  onLocationSelect: (location: LocationData) => void;
  onRemoveFavorite: (id: string) => void;
  isLoading: boolean;
}

export default function FavoritesList({ 
  favorites, 
  onLocationSelect, 
  onRemoveFavorite, 
  isLoading 
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
          <Star className="w-5 h-5 mr-2" />
          <span className="text-sm">No favorite cities yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-1">
        Favorite Cities
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
          >
            <button
              onClick={() => onLocationSelect(favorite)}
              disabled={isLoading}
              className="flex items-center space-x-2 flex-1 text-left disabled:opacity-50"
            >
              <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 text-sm">
                {favorite.name}, {favorite.country}
              </span>
            </button>
            
            <button
              onClick={() => onRemoveFavorite(favorite.id)}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors duration-150 disabled:opacity-50"
              aria-label={`Remove ${favorite.name} from favorites`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}