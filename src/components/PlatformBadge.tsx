import React from 'react';

interface PlatformBadgeProps {
  platform: 'zomato' | 'swiggy' | 'ubereats' | 'foodpanda';
  size?: 'sm' | 'md' | 'lg';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, size = 'md' }) => {
  const platformConfig = {
    zomato: { name: 'Zomato', color: 'bg-red-500', textColor: 'text-white' },
    swiggy: { name: 'Swiggy', color: 'bg-orange-500', textColor: 'text-white' },
    ubereats: { name: 'Uber Eats', color: 'bg-black', textColor: 'text-white' },
    foodpanda: { name: 'Foodpanda', color: 'bg-pink-500', textColor: 'text-white' },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = platformConfig[platform];

  return (
    <span
      className={`
        ${config.color} ${config.textColor} 
        ${sizeClasses[size]} 
        rounded-full font-medium inline-block
      `}
    >
      {config.name}
    </span>
  );
};