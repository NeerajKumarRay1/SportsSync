import { useEffect, useState } from 'react';

interface Coords {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Requests the browser's Geolocation API once on mount.
 * Falls back gracefully if permission is denied.
 */
export function useGeolocation(): GeolocationState {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  return { coords, error, isLoading };
}
