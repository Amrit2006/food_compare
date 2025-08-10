import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Location } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  currentLocation: Location;
  onLocationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  currentLocation,
  onLocationClick
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">FoodCompare</h1>
          <p className="text-lg opacity-90">
            Compare prices across all food delivery platforms
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Location Button */}
              <button
                onClick={onLocationClick}
                className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors min-w-0"
              >
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <div className="text-left min-w-0 flex-1">
                  <div className="text-gray-800 font-medium truncate">
                    {currentLocation.neighborhood || currentLocation.city}
                  </div>
                  <div className="text-gray-500 text-sm truncate">
                    {currentLocation.neighborhood ? `${currentLocation.city}, ${currentLocation.state}` : currentLocation.state}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </button>

              {/* Search Bar */}
              <div className="flex flex-1 items-center px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for food items, restaurants..."
                  className="flex-1 outline-none text-gray-800"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Search Button */}
              <button
                onClick={onSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
