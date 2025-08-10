import { Location, SavedAddress } from '../types';

export class AddressService {
  private readonly STORAGE_KEY = 'foodapp_saved_addresses';
  private readonly MAX_ADDRESSES = 10;

  /**
   * Save address to local storage
   */
  saveAddress(address: Location, label?: string, isDefault: boolean = false): SavedAddress {
    const savedAddresses = this.getSavedAddresses();
    
    // If setting as default, remove default from others
    if (isDefault) {
      savedAddresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress: SavedAddress = {
      ...address,
      id: this.generateId(),
      label: label || this.generateLabel(address),
      isDefault,
      createdAt: new Date(),
      lastUsed: new Date()
    };

    savedAddresses.unshift(newAddress);

    // Keep only the most recent addresses
    if (savedAddresses.length > this.MAX_ADDRESSES) {
      savedAddresses.splice(this.MAX_ADDRESSES);
    }

    this.storeSavedAddresses(savedAddresses);
    return newAddress;
  }

  /**
   * Get all saved addresses
   */
  getSavedAddresses(): SavedAddress[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const addresses = JSON.parse(stored);
      return addresses.map((addr: any) => ({
        ...addr,
        createdAt: new Date(addr.createdAt),
        lastUsed: addr.lastUsed ? new Date(addr.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      return [];
    }
  }

  /**
   * Get default address
   */
  getDefaultAddress(): SavedAddress | null {
    const addresses = this.getSavedAddresses();
    return addresses.find(addr => addr.isDefault) || null;
  }

  /**
   * Update address usage
   */
  markAddressAsUsed(addressId: string): void {
    const addresses = this.getSavedAddresses();
    const address = addresses.find(addr => addr.id === addressId);
    
    if (address) {
      address.lastUsed = new Date();
      this.storeSavedAddresses(addresses);
    }
  }

  /**
   * Delete saved address
   */
  deleteAddress(addressId: string): void {
    const addresses = this.getSavedAddresses();
    const filteredAddresses = addresses.filter(addr => addr.id !== addressId);
    this.storeSavedAddresses(filteredAddresses);
  }

  /**
   * Set address as default
   */
  setAsDefault(addressId: string): void {
    const addresses = this.getSavedAddresses();
    
    addresses.forEach(addr => {
      addr.isDefault = addr.id === addressId;
    });
    
    this.storeSavedAddresses(addresses);
  }

  /**
   * Search addresses by query
   */
  searchAddresses(query: string): SavedAddress[] {
    const addresses = this.getSavedAddresses();
    const lowercaseQuery = query.toLowerCase();
    
    return addresses.filter(addr => 
      addr.label?.toLowerCase().includes(lowercaseQuery) ||
      addr.formattedAddress?.toLowerCase().includes(lowercaseQuery) ||
      addr.streetAddress?.toLowerCase().includes(lowercaseQuery) ||
      addr.neighborhood?.toLowerCase().includes(lowercaseQuery) ||
      addr.city.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get address suggestions based on partial input
   */
  getAddressSuggestions(input: string): string[] {
    const addresses = this.getSavedAddresses();
    const suggestions = new Set<string>();

    addresses.forEach(addr => {
      if (addr.streetAddress && addr.streetAddress.toLowerCase().includes(input.toLowerCase())) {
        suggestions.add(addr.streetAddress);
      }
      if (addr.neighborhood && addr.neighborhood.toLowerCase().includes(input.toLowerCase())) {
        suggestions.add(addr.neighborhood);
      }
      if (addr.landmark && addr.landmark.toLowerCase().includes(input.toLowerCase())) {
        suggestions.add(addr.landmark);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Validate address format
   */
  validateAddressFormat(address: Location): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.city || address.city.trim().length < 2) {
      errors.push('City is required and must be at least 2 characters');
    }

    if (!address.state || address.state.trim().length < 2) {
      errors.push('State is required and must be at least 2 characters');
    }

    if (address.postalCode && !/^\d{6}$/.test(address.postalCode)) {
      errors.push('Postal code must be 6 digits');
    }

    if (address.coordinates) {
      const { lat, lng } = address.coordinates;
      if (lat < -90 || lat > 90) {
        errors.push('Invalid latitude');
      }
      if (lng < -180 || lng > 180) {
        errors.push('Invalid longitude');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format address for display
   */
  formatAddressForDisplay(address: Location, includeCoordinates: boolean = false): string {
    const parts: string[] = [];

    if (address.streetAddress) parts.push(address.streetAddress);
    if (address.buildingName) parts.push(address.buildingName);
    if (address.neighborhood) parts.push(address.neighborhood);
    if (address.district && address.district !== address.city) parts.push(address.district);
    
    parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);

    let formatted = parts.join(', ');

    if (address.landmark) {
      formatted += ` (Near ${address.landmark})`;
    }

    if (includeCoordinates && address.coordinates) {
      formatted += ` [${address.coordinates.lat.toFixed(6)}, ${address.coordinates.lng.toFixed(6)}]`;
    }

    return formatted;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateLabel(address: Location): string {
    if (address.buildingName) return address.buildingName;
    if (address.neighborhood) return address.neighborhood;
    if (address.landmark) return `Near ${address.landmark}`;
    return `${address.city}, ${address.state}`;
  }

  private storeSavedAddresses(addresses: SavedAddress[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  }
}

export const addressService = new AddressService();