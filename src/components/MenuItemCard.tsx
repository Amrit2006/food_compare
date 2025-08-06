import React from 'react';
import { Star, Leaf } from 'lucide-react';
import { MenuItem } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem }) => {
  const discountPercent = menuItem.originalPrice
    ? Math.round(((menuItem.originalPrice - menuItem.price) / menuItem.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <div className="relative">
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <PlatformBadge platform={menuItem.platform} size="sm" />
        </div>
        {menuItem.isVeg && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Leaf className="w-3 h-3 text-white" />
          </div>
        )}
        {discountPercent > 0 && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{menuItem.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{menuItem.description}</p>
        <p className="text-xs text-gray-500 mb-3">{menuItem.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-800">₹{menuItem.price}</span>
            {menuItem.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{menuItem.originalPrice}
              </span>
            )}
          </div>
          {menuItem.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{menuItem.rating}</span>
            </div>
          )}
        </div>

        <button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};