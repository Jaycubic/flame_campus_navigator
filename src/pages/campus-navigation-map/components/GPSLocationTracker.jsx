import React, { useState, useEffect, useCallback } from 'react';

const GPSLocationTracker = ({ 
  onLocationUpdate, 
  onPermissionChange, 
  isActive = true,
  accuracy = 'high' 
}) => {
  const [watchId, setWatchId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [locationError, setLocationError] = useState(null);
  const [lastKnownPosition, setLastKnownPosition] = useState(null);

  // GPS options based on accuracy setting
  const getGPSOptions = useCallback(() => {
    const baseOptions = {
      enableHighAccuracy: accuracy === 'high',
      timeout: accuracy === 'high' ? 15000 : 10000,
      maximumAge: accuracy === 'high' ? 30000 : 60000
    };
    return baseOptions;
  }, [accuracy]);

  // Handle successful location update
  const handleLocationSuccess = useCallback((position) => {
    const locationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    setLastKnownPosition(locationData);
    setLocationError(null);

    if (onLocationUpdate) {
      onLocationUpdate(locationData);
    }
  }, [onLocationUpdate]);

  // Handle location error
  const handleLocationError = useCallback((error) => {
    let errorMessage = '';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        setPermissionStatus('denied');
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'Unknown location error';
        break;
    }

    setLocationError({ code: error.code, message: errorMessage });
    
    if (onPermissionChange) {
      onPermissionChange(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
    }
  }, [onPermissionChange]);

  // Start GPS tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError({ 
        code: 'NOT_SUPPORTED', 
        message: 'Geolocation not supported by browser' 
      });
      return;
    }

    const options = getGPSOptions();
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    );

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    );

    setWatchId(id);
    setPermissionStatus('granted');
    
    if (onPermissionChange) {
      onPermissionChange('granted');
    }
  }, [getGPSOptions, handleLocationSuccess, handleLocationError, onPermissionChange]);

  // Stop GPS tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Request location permission
  const requestPermission = useCallback(async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        if (permission.state === 'granted') {
          startTracking();
        }
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
          if (permission.state === 'granted') {
            startTracking();
          } else {
            stopTracking();
          }
        });
      } else {
        // Fallback for browsers without permissions API
        startTracking();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      startTracking(); // Fallback to direct geolocation request
    }
  }, [startTracking, stopTracking]);

  // Initialize GPS tracking
  useEffect(() => {
    if (isActive) {
      requestPermission();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isActive, requestPermission, stopTracking]);

  // Calculate distance between two GPS points
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }, []);

  // Check if user is near destination
  const checkProximity = useCallback((destination, threshold = 10) => {
    if (!lastKnownPosition || !destination) return false;
    
    const distance = calculateDistance(
      lastKnownPosition.lat,
      lastKnownPosition.lng,
      destination.lat,
      destination.lng
    );
    
    return distance <= threshold;
  }, [lastKnownPosition, calculateDistance]);

  // Get current GPS accuracy status
  const getAccuracyStatus = useCallback(() => {
    if (!lastKnownPosition) return 'unknown';
    
    const accuracy = lastKnownPosition.accuracy;
    if (accuracy <= 5) return 'high';
    if (accuracy <= 20) return 'medium';
    return 'low';
  }, [lastKnownPosition]);

  // Public methods for parent components
  const gpsTracker = {
    startTracking,
    stopTracking,
    requestPermission,
    checkProximity,
    getAccuracyStatus,
    permissionStatus,
    locationError,
    lastKnownPosition,
    isTracking: watchId !== null
  };

  return gpsTracker;
};

export default GPSLocationTracker;