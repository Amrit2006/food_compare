import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  selectedCuisines: string[];
  onCuisineChange: (cuisines: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPlatforms,
  onPlatformChange,
  selectedCuisines,
  onCuisineChange,
  sortBy,
  onSortChange,
}) => {
  const platforms = [
    { id: 'zomato', name: 'Zomato', color: 'bg-red-500' },
    { id: 'swiggy', name: 'Swiggy', color: 'bg-orange-500' },
    { id: 'ubereats', name: 'Uber Eats', color: 'bg-black' },
    { id: 'foodpanda', name: 'Foodpanda', color: 'bg-pink-500' },
  ];

  const cuisines = ['Italian', 'Indian', 'Chinese', 'Mexican', 'American', 'Thai'];

  const handlePlatformToggle = (platformId: string) => {
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    onPlatformChange(newPlatforms);
  };

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter(c => c !== cuisine)
      : [...selectedCuisines, cuisine];
    onCuisineChange(newCuisines);
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Platforms */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? `${platform.color} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Cuisines</h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedCuisines.includes(cuisine)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Sort by</h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="delivery-time">Fastest Delivery</option>
            </select>
          </div>

          {/* View Toggle */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">View</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">
                All Results
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200">
                Compare Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};