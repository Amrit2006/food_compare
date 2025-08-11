import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { Location } from '../types';

interface LocationConfirmationProps {
  currentLocation: Location;
  onLocationConfirmed: () => void;
  onLocationChange: () => void;
  isVisible: boolean;
}

export const LocationConfirmation: React.FC<LocationConfirmationProps> = ({
  currentLocation,
  onLocationConfirmed,
  onLocationChange,
  isVisible,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onLocationConfirmed();
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isConfirmed ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-blue-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">
            {isConfirmed ? 'Location Confirmed!' : 'Please Confirm Your Location'}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              {currentLocation.neighborhood && `${currentLocation.neighborhood}, `}
              {currentLocation.city}, {currentLocation.state}
            </span>
          </div>

          {currentLocation.streetAddress && (
            <p className="text-sm text-gray-600 mb-3">
              {currentLocation.streetAddress}
              {currentLocation.landmark && ` (Near ${currentLocation.landmark})`}
            </p>
          )}

          {!isConfirmed ? (
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Yes, this is correct
              </button>
              
              <button
                onClick={onLocationChange}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Change Location
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Searching restaurants in your area...</span>
            </div>
          )}
        </div>
      </div>

      {!isConfirmed && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Confirming your exact location helps us show you the most accurate delivery options, 
            times, and fees from restaurants in your area.
          </p>
        </div>
      )}
    </div>
  );
};