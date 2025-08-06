import React, { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SearchResults } from './components/SearchResults';
import { PriceComparisonTable } from './components/PriceComparisonTable';
import { LocationSelector } from './components/LocationSelector';
import { FoodRecommendations } from './components/FoodRecommendations';
import { useSearch } from './hooks/useSearch';

function App() {
  const {
    restaurants,
    menuItems,
    loading,
    searchQuery,
    selectedPlatforms,
    selectedCuisines,
    priceRange,
    sortBy,
    currentLocation,
    search,
    setSelectedPlatforms,
    setSelectedCuisines,
    setPriceRange,
    setSortBy,
    setCurrentLocation,
    generatePriceComparison,
  } = useSearch();

  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleSearch = () => {
    search(currentSearchQuery);
    setShowComparison(false);
  };

  const handleComparisonView = () => {
    setShowComparison(true);
  };

  const handleRecommendationClick = (foodName: string) => {
    setCurrentSearchQuery(foodName);
    search(foodName);
    setShowComparison(false);
  };
  const priceComparison = showComparison && searchQuery 
    ? generatePriceComparison(searchQuery)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={currentSearchQuery}
        onSearchChange={setCurrentSearchQuery}
        onSearch={handleSearch}
        currentLocation={currentLocation}
        onLocationClick={() => setShowLocationSelector(true)}
      />
      
      <LocationSelector
        currentLocation={currentLocation}
        onLocationChange={setCurrentLocation}
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
      />
      
      {searchQuery && (
        <FilterBar
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={setSelectedPlatforms}
          selectedCuisines={selectedCuisines}
          onCuisineChange={setSelectedCuisines}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {showComparison && priceComparison ? (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <button
              onClick={() => setShowComparison(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Results
            </button>
          </div>
          <PriceComparisonTable comparison={priceComparison} />
        </div>
      ) : (
        <div>
          {/* Food Recommendations */}
          {(searchQuery || currentSearchQuery) && (
            <div className="container mx-auto px-4 py-6">
              <FoodRecommendations
                searchQuery={currentSearchQuery || searchQuery}
                onRecommendationClick={handleRecommendationClick}
              />
            </div>
          )}
          
          <SearchResults
            restaurants={restaurants}
            menuItems={menuItems}
            loading={loading}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Floating comparison button */}
      {searchQuery && !showComparison && menuItems.length > 1 && (
        <button
          onClick={handleComparisonView}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
        >
          Compare Prices
        </button>
      )}

      {/* Popular searches section */}
      {!searchQuery && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Searches</h2>
            <p className="text-gray-600">Try these trending food items</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {[
              'Pizza', 'Burger', 'Biryani', 'Chinese', 'Pasta', 'Ice Cream',
              'Sushi', 'Tacos', 'Sandwich', 'Noodles', 'Desserts', 'Healthy'
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setCurrentSearchQuery(term);
                  search(term);
                }}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-center group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">
                    {term.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;