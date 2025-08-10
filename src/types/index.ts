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
  country?: string;
  postalCode?: string;
  district?: string;
  neighborhood?: string;
  streetAddress?: string;
  buildingName?: string;
  landmark?: string;
  addressType?: 'home' | 'work' | 'other';
  label?: string;
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  formattedAddress?: string;
  placeId?: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeolocationResult {
  location: Location;
  accuracy: number;
  source: 'gps' | 'network' | 'wifi' | 'manual';
  timestamp: number;
}

export interface SavedAddress extends Location {
  id: string;
  isDefault: boolean;
  createdAt: Date;
  lastUsed?: Date;
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