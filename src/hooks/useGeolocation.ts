import { useState, useEffect } from 'react';

interface LocationInfo {
  city: string;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): LocationInfo => {
  const [city, setCity] = useState(() => {
    return localStorage.getItem('prayermode_location') || 'Your Location';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'Unknown Location';
          setCity(locationName);
          localStorage.setItem('prayermode_location', locationName);
        } catch {
          setError('Could not fetch location name');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  return { city, loading, error };
};
