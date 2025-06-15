import { useState, useEffect } from 'react';
import { FavoriteLocation, LocationData } from '../types/weather';

const FAVORITES_KEY = 'weather-app-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (location: LocationData) => {
    const favoriteLocation: FavoriteLocation = {
      ...location,
      id: `${location.lat}-${location.lon}`,
      addedAt: Date.now()
    };

    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === favoriteLocation.id)) {
        return prev;
      }
      return [...prev, favoriteLocation];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (location: LocationData): boolean => {
    const id = `${location.lat}-${location.lon}`;
    return favorites.some(fav => fav.id === id);
  };

  const toggleFavorite = (location: LocationData) => {
    const id = `${location.lat}-${location.lon}`;
    if (isFavorite(location)) {
      removeFavorite(id);
    } else {
      addFavorite(location);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
}