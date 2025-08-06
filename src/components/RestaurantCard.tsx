import React from 'react';
import { Star, Clock, Truck } from 'lucide-react';
import { Restaurant } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <PlatformBadge platform={restaurant.platform} size="sm" />
        </div>
        {!restaurant.isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Currently Closed</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine.join(', ')}</p>
        <p className="text-gray-500 text-xs mb-3">{restaurant.address}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">₹{restaurant.deliveryFee} delivery</span>
            </div>
            <span className="text-gray-500">Min ₹{restaurant.minOrder}</span>
          </div>
        </div>
      </div>
    </div>
  );
};