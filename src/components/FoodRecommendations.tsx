import React from 'react';
import { TrendingUp, Star, Clock } from 'lucide-react';
import { FoodRecommendation } from '../types';
import { foodRecommendations } from '../data/mockData';

interface FoodRecommendationsProps {
  searchQuery: string;
  onRecommendationClick: (foodName: string) => void;
}

export const FoodRecommendations: React.FC<FoodRecommendationsProps> = ({
  searchQuery,
  onRecommendationClick,
}) => {
  // Filter recommendations based on search query
  const getRecommendations = (): FoodRecommendation[] => {
    if (!searchQuery.trim()) {
      return foodRecommendations.slice(0, 6); // Show top 6 when no search
    }

    const query = searchQuery.toLowerCase();
    
    // Find exact matches first
    const exactMatches = foodRecommendations.filter(food =>
      food.name.toLowerCase().includes(query) ||
      food.category.toLowerCase().includes(query) ||
      food.tags.some(tag => tag.toLowerCase().includes(query))
    );

    // If we have exact matches, return them
    if (exactMatches.length > 0) {
      return exactMatches.slice(0, 4);
    }

    // Otherwise, show popular recommendations
    return foodRecommendations
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  const title = searchQuery.trim() 
    ? `Recommendations for "${searchQuery}"`
    : 'Popular Food Items';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((food) => (
          <div
            key={food.id}
            onClick={() => onRecommendationClick(food.name)}
            className="group cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all hover:shadow-md"
          >
            <div className="relative mb-3">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{(food.popularity / 20).toFixed(1)}</span>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
              {food.name}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{food.category}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{food.description}</p>

            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-600">₹{food.avgPrice}</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>25-30 min</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {food.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {searchQuery.trim() && (
        <div className="mt-4 text-center">
          <button
            onClick={() => onRecommendationClick(searchQuery)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Search for "{searchQuery}" →
          </button>
        </div>
      )}
    </div>
  );
};