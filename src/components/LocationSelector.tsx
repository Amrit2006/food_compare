import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { Location } from '../types';
import { indianCities } from '../data/mockData';

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationChange,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<Location[]>(indianCities);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = indianCities.filter(
        city =>
          city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(indianCities);
    }
  }, [searchQuery]);

  const detectLocation = async () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, you would use a reverse geocoding service
          // For demo purposes, we'll simulate finding a nearby city
          const nearbyCity = indianCities[Math.floor(Math.random() * 10)]; // Random city for demo
          
          const detectedLocation: Location = {
            ...nearbyCity,
            coordinates: { lat: latitude, lng: longitude }
          };
          
          onLocationChange(detectedLocation);
          onClose();
        } catch (error) {
          console.error('Error detecting location:', error);
          alert('Could not detect your location. Please select manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Could not access your location. Please select manually.');
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleCitySelect = (city: Location) => {
    onLocationChange(city);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* GPS Detection */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium mb-4 transition-colors"
          >
            <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
            {isDetecting ? 'Detecting Location...' : 'Use Current Location'}
          </button>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cities List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCities.length > 0 ? (
              <div className="space-y-1">
                {filteredCities.slice(0, 50).map((city) => (
                  <button
                    key={`${city.city}-${city.state}`}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                      currentLocation.city === city.city && currentLocation.state === city.state
                        ? 'bg-blue-50 border border-blue-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800">{city.city}</div>
                        <div className="text-sm text-gray-500">{city.state}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No cities found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};