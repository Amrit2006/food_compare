import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { PriceComparison } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface PriceComparisonTableProps {
  comparison: PriceComparison;
}

export const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ comparison }) => {
  const savings = comparison.highestPrice - comparison.lowestPrice;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{comparison.itemName}</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            <span>Best Price: ₹{comparison.lowestPrice}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Save up to: ₹{savings}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Platform</th>
                <th className="text-left py-3 px-2">Restaurant</th>
                <th className="text-right py-3 px-2">Item Price</th>
                <th className="text-right py-3 px-2">Delivery</th>
                <th className="text-right py-3 px-2">Total</th>
                <th className="text-right py-3 px-2">Time</th>
                <th className="text-right py-3 px-2">Rating</th>
                <th className="text-right py-3 px-2">Savings</th>
              </tr>
            </thead>
            <tbody>
              {comparison.platforms
                .sort((a, b) => a.totalCost - b.totalCost)
                .map((platform, index) => {
                  const isLowest = platform.totalCost === comparison.lowestPrice;
                  const savingsAmount = comparison.highestPrice - platform.totalCost;

                  return (
                    <tr
                      key={`${platform.platform}-${platform.restaurantName}`}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        isLowest ? 'bg-green-50 ring-2 ring-green-200' : ''
                      }`}
                    >
                      <td className="py-4 px-2">
                        <PlatformBadge platform={platform.platform as any} size="sm" />
                      </td>
                      <td className="py-4 px-2 font-medium">{platform.restaurantName}</td>
                      <td className="py-4 px-2 text-right font-semibold">₹{platform.price}</td>
                      <td className="py-4 px-2 text-right">₹{platform.deliveryFee}</td>
                      <td className="py-4 px-2 text-right font-bold text-lg">
                        ₹{platform.totalCost}
                      </td>
                      <td className="py-4 px-2 text-right text-sm">{platform.deliveryTime}</td>
                      <td className="py-4 px-2 text-right">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          {platform.rating}★
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {isLowest ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                            Best Price!
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">-₹{savingsAmount}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Price Analysis</h3>
              <p className="text-sm text-gray-600">Based on current offers and delivery fees</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average Price</p>
              <p className="text-lg font-bold text-gray-800">₹{comparison.averagePrice.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};