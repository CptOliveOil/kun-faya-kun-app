import { useState, useEffect } from 'react';

// Coordinates for Kaaba in Makkah
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export function useQibla() {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState | 'prompt' | 'unsupported'>('prompt');
  
  // Calculate bearing from true north to Kaaba based on user coords
  const calculateQibla = (userLat: number, userLng: number) => {
    // Convert to radians
    const latK = KAABA_LAT * Math.PI / 180.0;
    const lngK = KAABA_LNG * Math.PI / 180.0;
    const latU = userLat * Math.PI / 180.0;
    const lngU = userLng * Math.PI / 180.0;

    const y = Math.sin(lngK - lngU);
    const x = Math.cos(latU) * Math.tan(latK) - Math.sin(latU) * Math.cos(lngK - lngU);
    let qibla = Math.atan2(y, x) * 180.0 / Math.PI;
    
    // Normalize to 0-360
    qibla = (qibla + 360) % 360;
    setQiblaDirection(qibla);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationPermission('unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission('granted');
        calculateQibla(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError(err.message);
        setLocationPermission('denied');
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Attempt to handle device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha;
      
      // Try to get absolute webkit compass heading (iOS)
      if ((event as any).webkitCompassHeading) {
        alpha = (event as any).webkitCompassHeading;
      } else if (alpha !== null) {
        // Standard absolute alpha (Android/Standard)
        // alpha is counter-clockwise, we need clockwise from North
        alpha = 360 - alpha;
      }
      
      if (alpha !== null) {
        setHeading(alpha);
      }
    };

    const requestOrientation = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
            // Fallback
            window.addEventListener('deviceorientation', handleOrientation as any, true);
          } else {
            setError("Compass permission denied");
          }
        } catch (err) {
          console.error(err);
          // Auto-bind without permission (some older iOS or Android)
          window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
        }
      } else {
        // Non iOS 13+ devices
        window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
      }
    };

    if (locationPermission === 'granted') {
      requestOrientation();
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.removeEventListener('deviceorientation', handleOrientation as any, true);
    };
  }, [locationPermission]);

  return {
    heading,
    qiblaDirection,
    error,
    locationPermission,
    requestLocation
  };
}
