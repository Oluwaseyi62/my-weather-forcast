import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import FavoritesList from './components/FavoritesList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { getWeatherData } from './services/weatherService';
import { ThemeProvider } from './context/ThemeContext';
import { useFavorites } from './hooks/useFavorites';
import { WeatherData, LocationData } from './types/weather';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();

  const fetchWeatherData = async (location: LocationData) => {
    setLoading(true);
    setError(null);
    setCurrentLocation(location);
    
    try {
      const data = await getWeatherData(location.lat, location.lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default location on first load (New York)
  useEffect(() => {
    fetchWeatherData({ name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 });
  }, []);

  const handleLocationSelect = (location: LocationData) => {
    fetchWeatherData(location);
  };

  const handleRetry = () => {
    if (currentLocation) {
      fetchWeatherData(currentLocation);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        
        <main className="container mx-auto py-6 px-4 max-w-4xl">
          <div className="mb-6 animate-fadeIn">
            <SearchBar 
              onLocationSelect={handleLocationSelect} 
              isLoading={loading}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              currentLocation={currentLocation}
            />
            
            <FavoritesList
              favorites={favorites}
              onLocationSelect={handleLocationSelect}
              onRemoveFavorite={removeFavorite}
              isLoading={loading}
            />
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry} 
            />
          ) : weatherData ? (
            <div className="space-y-6 animate-fadeIn">
              <CurrentWeather 
                data={weatherData} 
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
              <Forecast forecast={weatherData.forecast} />
            </div>
          ) : null}
        </main>
        
        <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          <p>WeatherView © {new Date().getFullYear()} | Powered by Dev oluwaseyi</p>
          
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;