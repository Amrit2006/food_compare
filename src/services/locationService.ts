export interface LocationServiceConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  fallbackToNetwork: boolean;
  requiredAccuracy: number; // meters
}

export interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export class LocationService {
  private config: LocationServiceConfig;
  private watchId: number | null = null;

  constructor(config: Partial<LocationServiceConfig> = {}) {
    this.config = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
      fallbackToNetwork: true,
      requiredAccuracy: 5, // 5 meters
      ...config
    };
  }

  /**
   * Get current location with high precision
   */
  async getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: GeolocationOptions = {
        enableHighAccuracy: this.config.enableHighAccuracy,
        timeout: this.config.timeout,
        maximumAge: this.config.maximumAge
      };

      // Try high-accuracy GPS first
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Check if accuracy meets requirements
          if (accuracy <= this.config.requiredAccuracy) {
            try {
              const location = await this.reverseGeocode(latitude, longitude);
              resolve({
                location: {
                  ...location,
                  coordinates: { lat: latitude, lng: longitude, accuracy }
                },
                accuracy,
                source: 'gps',
                timestamp: position.timestamp
              });
            } catch (error) {
              reject(error);
            }
          } else if (this.config.fallbackToNetwork) {
            // Try network-based location if GPS accuracy is poor
            this.getNetworkLocation().then(resolve).catch(reject);
          } else {
            reject(new Error(`GPS accuracy (${accuracy}m) exceeds required precision (${this.config.requiredAccuracy}m)`));
          }
        },
        (error) => {
          if (this.config.fallbackToNetwork) {
            this.getNetworkLocation().then(resolve).catch(reject);
          } else {
            reject(this.handleGeolocationError(error));
          }
        },
        options
      );
    });
  }

  /**
   * Get network-based location as fallback
   */
  private async getNetworkLocation(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      const options: GeolocationOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes for network location
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            const location = await this.reverseGeocode(latitude, longitude);
            resolve({
              location: {
                ...location,
                coordinates: { lat: latitude, lng: longitude, accuracy }
              },
              accuracy,
              source: 'network',
              timestamp: position.timestamp
            });
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(this.handleGeolocationError(error)),
        options
      );
    });
  }

  /**
   * Watch position for continuous tracking
   */
  watchPosition(callback: (result: GeolocationResult) => void, errorCallback: (error: Error) => void): number {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported'));
      return -1;
    }

    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds for watch
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          const location = await this.reverseGeocode(latitude, longitude);
          callback({
            location: {
              ...location,
              coordinates: { lat: latitude, lng: longitude, accuracy }
            },
            accuracy,
            source: accuracy <= 10 ? 'gps' : 'network',
            timestamp: position.timestamp
          });
        } catch (error) {
          errorCallback(error as Error);
        }
      },
      (error) => errorCallback(this.handleGeolocationError(error)),
      options
    );

    return this.watchId;
  }

  /**
   * Stop watching position
   */
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Reverse geocode coordinates to detailed address
   */
  private async reverseGeocode(lat: number, lng: number): Promise<Location> {
    // In a real implementation, you would use a service like Google Maps Geocoding API
    // For demo purposes, we'll simulate detailed address resolution
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock detailed address based on coordinates
      const mockAddress = this.generateMockAddress(lat, lng);
      return mockAddress;
    } catch (error) {
      throw new Error('Failed to resolve address from coordinates');
    }
  }

  /**
   * Generate mock detailed address (replace with real geocoding service)
   */
  private generateMockAddress(lat: number, lng: number): Location {
    const addresses = [
      {
        streetAddress: "123 MG Road, Block A",
        buildingName: "Phoenix Mall",
        neighborhood: "Connaught Place",
        district: "Central Delhi",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
        landmark: "Near Metro Station",
        formattedAddress: "123 MG Road, Block A, Phoenix Mall, Connaught Place, Central Delhi, New Delhi, Delhi 110001, India"
      },
      {
        streetAddress: "456 Brigade Road, 2nd Floor",
        buildingName: "UB City Mall",
        neighborhood: "Shivaji Nagar",
        district: "Bangalore Urban",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
        landmark: "Opposite Cubbon Park",
        formattedAddress: "456 Brigade Road, 2nd Floor, UB City Mall, Shivaji Nagar, Bangalore Urban, Bangalore, Karnataka 560001, India"
      },
      {
        streetAddress: "789 Marine Drive, Apartment 15B",
        buildingName: "Sea View Towers",
        neighborhood: "Nariman Point",
        district: "South Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400021",
        landmark: "Near Gateway of India",
        formattedAddress: "789 Marine Drive, Apartment 15B, Sea View Towers, Nariman Point, South Mumbai, Mumbai, Maharashtra 400021, India"
      }
    ];

    // Select address based on coordinates (simplified logic)
    const index = Math.floor(Math.abs(lat + lng) % addresses.length);
    return addresses[index];
  }

  /**
   * Handle geolocation errors
   */
  private handleGeolocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location access denied by user. Please enable location permissions.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information is unavailable. Please check your GPS settings.');
      case error.TIMEOUT:
        return new Error('Location request timed out. Please try again.');
      default:
        return new Error('An unknown error occurred while retrieving location.');
    }
  }

  /**
   * Validate address completeness
   */
  validateAddress(location: Location): { isValid: boolean; missingFields: string[] } {
    const requiredFields = ['city', 'state', 'postalCode'];
    const recommendedFields = ['streetAddress', 'neighborhood'];
    
    const missingRequired = requiredFields.filter(field => !location[field as keyof Location]);
    const missingRecommended = recommendedFields.filter(field => !location[field as keyof Location]);
    
    return {
      isValid: missingRequired.length === 0,
      missingFields: [...missingRequired, ...missingRecommended]
    };
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return distance in meters
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const locationService = new LocationService();