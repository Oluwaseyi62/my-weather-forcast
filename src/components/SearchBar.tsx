import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, AlertCircle, Star } from 'lucide-react';
import { searchLocations } from '../services/weatherService';
import { LocationData } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
  isLoading: boolean;
  isFavorite?: (location: LocationData) => boolean;
  onToggleFavorite?: (location: LocationData) => void;
  currentLocation?: LocationData | null;
}

export default function SearchBar({ 
  onLocationSelect, 
  isLoading, 
  isFavorite, 
  onToggleFavorite,
  currentLocation 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search query
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 3) {
        setSearchLoading(true);
        setError(null);
        try {
          const results = await searchLocations(query);
          setLocations(results);
          setShowResults(true);
          if (results.length === 0) {
            setError('No locations found. Please try a different search term.');
          }
        } catch (error) {
          console.error('Error searching locations:', error);
          setError(error instanceof Error ? error.message : 'Failed to search locations. Please try again later.');
          setLocations([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setLocations([]);
        setShowResults(false);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: LocationData = {
            name: 'Current Location',
            country: '',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          onLocationSelect(currentLocation);
          setShowResults(false);
          setQuery('');
          setError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location. Please enable location services or search manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please search for a location manually.');
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setQuery(`${location.name}, ${location.country}`);
    setShowResults(false);
    setError(null);
  };

  const handleToggleFavorite = (e: React.MouseEvent, location: LocationData) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(location);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowResults(true)}
          className="w-full p-3 pl-10 pr-20 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all duration-200"
          disabled={isLoading}
        />
        <Search className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
        
        {/* Add to favorites button for current location */}
        {currentLocation && isFavorite && onToggleFavorite && (
          <button
            onClick={(e) => handleToggleFavorite(e, currentLocation)}
            disabled={isLoading}
            className="absolute right-12 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isFavorite(currentLocation) ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite(currentLocation) ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={`w-5 h-5 ${
                isFavorite(currentLocation) 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} 
            />
          </button>
        )}
        
        <button 
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="absolute right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Get current location"
          title="Use current location"
        >
          <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && locations.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
        >
          {locations.map((location, index) => (
            <div
              key={`${location.name}-${location.lat}-${location.lon}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <button
                className="flex items-center space-x-2 flex-1 text-left text-gray-800 dark:text-gray-200"
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span>{location.name}, {location.country}</span>
              </button>
              
              {isFavorite && onToggleFavorite && (
                <button
                  onClick={(e) => handleToggleFavorite(e, location)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                  aria-label={isFavorite(location) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      isFavorite(location) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} 
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator for search */}
      {searchLoading && (
        <div className="absolute right-12 top-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
}