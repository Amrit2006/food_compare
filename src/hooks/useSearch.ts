import { useState, useEffect } from 'react';
import { Restaurant, MenuItem, PriceComparison, Location } from '../types';
import { mockRestaurants, mockMenuItems } from '../data/mockData';

export const useSearch = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentLocation, setCurrentLocation] = useState<Location>({
    city: 'Delhi',
    state: 'Delhi'
  });

  const search = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!query.trim()) {
      setRestaurants([]);
      setMenuItems([]);
      setLoading(false);
      return;
    }

    // Filter restaurants
    const filteredRestaurants = mockRestaurants.filter(restaurant => {
      const matchesQuery = restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()));
      
      const matchesPlatform = selectedPlatforms.length === 0 || 
        selectedPlatforms.includes(restaurant.platform);
      
      const matchesCuisine = selectedCuisines.length === 0 ||
        restaurant.cuisine.some(c => selectedCuisines.includes(c));

      return matchesQuery && matchesPlatform && matchesCuisine;
    });

    // Filter menu items
    const filteredMenuItems = mockMenuItems.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesPlatform = selectedPlatforms.length === 0 || 
        selectedPlatforms.includes(item.platform);
      
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesQuery && matchesPlatform && matchesPrice;
    });

    // Sort results
    const sortedRestaurants = sortResults(filteredRestaurants, sortBy);
    const sortedMenuItems = sortResults(filteredMenuItems, sortBy);

    setRestaurants(sortedRestaurants);
    setMenuItems(sortedMenuItems);
    setLoading(false);
  };

  const sortResults = <T extends Restaurant | MenuItem>(items: T[], sortType: string): T[] => {
    const sorted = [...items];
    
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = 'price' in a ? a.price : a.deliveryFee;
          const priceB = 'price' in b ? b.price : b.deliveryFee;
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = 'price' in a ? a.price : a.deliveryFee;
          const priceB = 'price' in b ? b.price : b.deliveryFee;
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'delivery-time':
        if ('deliveryTime' in sorted[0]) {
          return sorted.sort((a, b) => {
            const timeA = parseInt((a as Restaurant).deliveryTime.split('-')[0]);
            const timeB = parseInt((b as Restaurant).deliveryTime.split('-')[0]);
            return timeA - timeB;
          });
        }
        return sorted;
      default:
        return sorted;
    }
  };

  const generatePriceComparison = (itemName: string): PriceComparison | null => {
    const items = mockMenuItems.filter(item => 
      item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (items.length < 2) return null;

    const platforms = items.map(item => {
      const restaurant = mockRestaurants.find(r => r.id === item.restaurantId);
      return {
        platform: item.platform,
        price: item.price,
        restaurantName: restaurant?.name || 'Unknown',
        deliveryFee: restaurant?.deliveryFee || 0,
        totalCost: item.price + (restaurant?.deliveryFee || 0),
        deliveryTime: restaurant?.deliveryTime || '30-35 mins',
        rating: item.rating || restaurant?.rating || 4.0,
      };
    });

    const prices = platforms.map(p => p.totalCost);
    
    return {
      itemName,
      platforms,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    };
  };

  return {
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
  };
};