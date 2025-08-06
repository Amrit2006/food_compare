import React from 'react';
import { Restaurant, MenuItem } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { MenuItemCard } from './MenuItemCard';

interface SearchResultsProps {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  loading: boolean;
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  restaurants,
  menuItems,
  loading,
  searchQuery,
}) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Discover Great Food</h2>
          <p className="text-gray-500">Search for your favorite dishes and compare prices across platforms</p>
        </div>
      </div>
    );
  }

  const totalResults = restaurants.length + menuItems.length;

  if (totalResults === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Results Found</h2>
          <p className="text-gray-500">Try searching for something else or check your spelling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Search Results for "{searchQuery}"
        </h2>
        <p className="text-gray-600">{totalResults} results found</p>
      </div>

      {menuItems.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={`${item.id}-${item.platform}`} menuItem={item} />
            ))}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Restaurants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={`${restaurant.id}-${restaurant.platform}`} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};