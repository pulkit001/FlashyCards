'use client';

import { useState, useEffect } from 'react';

export interface GeoLocation {
  country: string | null;
  isIndia: boolean;
  isLoading: boolean;
}

export function useGeoLocation(): GeoLocation {
  const [geoData, setGeoData] = useState<GeoLocation>({
    country: null,
    isIndia: false,
    isLoading: true,
  });

  useEffect(() => {
    async function detectLocation() {
      try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const country = data.country_code || data.country;
        const isIndia = country === 'IN';

        setGeoData({
          country,
          isIndia,
          isLoading: false,
        });
      } catch (error) {
        console.error('Geo-detection failed:', error);
        // Fallback: assume non-India if detection fails
        setGeoData({
          country: null,
          isIndia: false,
          isLoading: false,
        });
      }
    }

    detectLocation();
  }, []);

  return geoData;
}
