export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  platform: 'zomato' | 'swiggy' | 'ubereats' | 'foodpanda';
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  isVeg: boolean;
  rating?: number;
  restaurantId: string;
  platform: 'zomato' | 'swiggy' | 'ubereats' | 'foodpanda';
}

export interface SearchResult {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  totalResults: number;
}

export interface PriceComparison {
  itemName: string;
  platforms: {
    platform: string;
    price: number;
    restaurantName: string;
    deliveryFee: number;
    totalCost: number;
    deliveryTime: string;
    rating: number;
  }[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

export interface Location {
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FoodRecommendation {
  id: string;
  name: string;
  image: string;
  category: string;
  popularity: number;
  avgPrice: number;
  description: string;
  tags: string[];
}