import React from 'react';
import { MapPin, Clock, Filter, TrendingUp } from 'lucide-react';
import { Location } from '../types';

interface SearchResultsHeaderProps {
  searchQuery: string;
  currentLocation: Location;
  totalRestaurants: number;
  totalMenuItems: number;
  averageDeliveryTime: string;
  onFilterClick: () => void;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  searchQuery,
  currentLocation,
  totalRestaurants,
  totalMenuItems,
  averageDeliveryTime,
  onFilterClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Results for "{searchQuery}"
          </h2>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {currentLocation.neighborhood && `${currentLocation.neighborhood}, `}
                {currentLocation.city}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Avg delivery: {averageDeliveryTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {totalRestaurants} Restaurants
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {totalMenuItems} Menu Items
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Best matches first</span>
          </div>
        </div>
      </div>
    </div>
  );
};