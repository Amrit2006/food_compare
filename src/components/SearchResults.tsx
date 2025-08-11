import React from 'react';
import { Restaurant, MenuItem } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { MenuItemCard } from './MenuItemCard';
import { SearchResultsHeader } from './SearchResultsHeader';

interface SearchResultsProps {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  loading: boolean;
  searchQuery: string;
  currentLocation: any;
  onFilterClick?: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  restaurants,
  menuItems,
  loading,
  searchQuery,
  currentLocation,
  onFilterClick = () => {},
}) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Searching restaurants and menu items...</p>
          <p className="text-sm text-gray-500 mt-1">Finding the best options in your area</p>
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
          <p className="text-gray-500 mb-4">Try searching for something else or check your spelling</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Try searching for popular items like "pizza", "burger", "biryani", or "chinese"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average delivery time
  const avgDeliveryTime = restaurants.length > 0 
    ? Math.round(restaurants.reduce((sum, r) => {
        const time = parseInt(r.deliveryTime.split('-')[0]);
        return sum + time;
      }, 0) / restaurants.length)
    : 25;
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchResultsHeader
        searchQuery={searchQuery}
        currentLocation={currentLocation}
        totalRestaurants={restaurants.length}
        totalMenuItems={menuItems.length}
        averageDeliveryTime={`${avgDeliveryTime}-${avgDeliveryTime + 5} mins`}
        onFilterClick={onFilterClick}
      />

      {menuItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Menu Items ({menuItems.length})</h3>
            <p className="text-sm text-gray-500">Sorted by relevance and price</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={`${item.id}-${item.platform}`} menuItem={item} />
            ))}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Restaurants ({restaurants.length})</h3>
            <p className="text-sm text-gray-500">Available for delivery in your area</p>
          </div>
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