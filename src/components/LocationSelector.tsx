import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X, Home, Briefcase, Plus, Edit3, Trash2, Star, Clock, Crosshair } from 'lucide-react';
import { Location } from '../types';
import { indianCities } from '../data/mockData';
import { locationService, GeolocationResult } from '../services/locationService';
import { addressService, AddressService } from '../services/addressService';
import { SavedAddress } from '../types';

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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<GeolocationResult | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Location>>({});
  const [activeTab, setActiveTab] = useState<'detect' | 'saved' | 'search'>('detect');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedAddresses(addressService.getSavedAddresses());
    }
  }, [isOpen]);

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
    setLocationAccuracy(null);
    
    try {
      const result = await locationService.getCurrentLocation();
      setDetectedLocation(result);
      setLocationAccuracy(result.accuracy);
      
      // Auto-select if accuracy is good
      if (result.accuracy <= 10) {
        onLocationChange(result.location);
        onClose();
      }
    } catch (error) {
      console.error('Location detection error:', error);
      alert((error as Error).message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSavedAddressSelect = (address: SavedAddress) => {
    addressService.markAddressAsUsed(address.id);
    onLocationChange(address);
    onClose();
  };

  const handleAddressFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressForm.city || !addressForm.state) {
      alert('City and State are required');
      return;
    }

    const validation = addressService.validateAddressFormat(addressForm as Location);
    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'));
      return;
    }

    const savedAddress = addressService.saveAddress(
      addressForm as Location,
      addressForm.label,
      savedAddresses.length === 0 // Set as default if it's the first address
    );

    setSavedAddresses(addressService.getSavedAddresses());
    onLocationChange(savedAddress);
    setShowAddressForm(false);
    setAddressForm({});
    onClose();
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      addressService.deleteAddress(addressId);
      setSavedAddresses(addressService.getSavedAddresses());
    }
  };

  const handleSetDefault = (addressId: string) => {
    addressService.setAsDefault(addressId);
    setSavedAddresses(addressService.getSavedAddresses());
  };

  const startEditingAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressForm(true);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return 'text-green-600';
    if (accuracy <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return 'Excellent';
    if (accuracy <= 15) return 'Good';
    return 'Fair';
  };

  if (showAddressForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
                setAddressForm({});
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddressFormSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (Home, Work, etc.)
              </label>
              <input
                type="text"
                value={addressForm.label || ''}
                onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Home, Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={addressForm.streetAddress || ''}
                onChange={(e) => setAddressForm({...addressForm, streetAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="House/Flat/Office No, Street Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  value={addressForm.buildingName || ''}
                  onChange={(e) => setAddressForm({...addressForm, buildingName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Building/Society"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={addressForm.landmark || ''}
                  onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Near landmark"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Neighborhood/Area
              </label>
              <input
                type="text"
                value={addressForm.neighborhood || ''}
                onChange={(e) => setAddressForm({...addressForm, neighborhood: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Area/Locality"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={addressForm.city || ''}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={addressForm.state || ''}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={addressForm.postalCode || ''}
                onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setAddressForm({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingAddress ? 'Update' : 'Save'} Address
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleCitySelect = (city: Location) => {
    onLocationChange(city);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden">
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
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('detect')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'detect'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Crosshair className="w-4 h-4 inline mr-1" />
              Detect
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Saved ({savedAddresses.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="w-4 h-4 inline mr-1" />
              Search
            </button>
          </div>

          {/* GPS Detection Tab */}
          {activeTab === 'detect' && (
            <div className="space-y-4">
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
              >
                <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
                {isDetecting ? 'Detecting Location...' : 'Use Current Location'}
              </button>

              {detectedLocation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Location Detected</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getAccuracyColor(detectedLocation.accuracy)}`}>
                        {getAccuracyText(detectedLocation.accuracy)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ±{detectedLocation.accuracy}m accuracy
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    {addressService.formatAddressForDisplay(detectedLocation.location)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLocationChange(detectedLocation.location);
                        onClose();
                      }}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Use This Location
                    </button>
                    <button
                      onClick={() => {
                        setAddressForm(detectedLocation.location);
                        setShowAddressForm(true);
                      }}
                      className="px-3 py-2 border border-green-600 text-green-600 rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                    >
                      Edit & Save
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500">
                <p>We'll detect your precise location using GPS</p>
                <p>Accuracy: Within 3-5 meters for best delivery experience</p>
              </div>
            </div>
          )}

          {/* Saved Addresses Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Your Addresses</span>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => handleSavedAddressSelect(address)}>
                          <div className="flex items-center gap-2 mb-1">
                            {address.addressType === 'home' ? (
                              <Home className="w-4 h-4 text-blue-500" />
                            ) : address.addressType === 'work' ? (
                              <Briefcase className="w-4 h-4 text-green-500" />
                            ) : (
                              <MapPin className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="font-medium text-gray-800">{address.label}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {addressService.formatAddressForDisplay(address)}
                          </p>
                          {address.lastUsed && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Last used {new Date(address.lastUsed).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => startEditingAddress(address)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit address"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="mb-2">No saved addresses yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first address
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Cities Tab */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
          )}
        </div>
      </div>
    </div>
  );
};