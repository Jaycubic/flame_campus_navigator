import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Create context for location permission state
const LocationPermissionContext = createContext();

// Custom hook to use location permission context
export const useLocationPermission = () => {
  const context = useContext(LocationPermissionContext);
  if (!context) {
    throw new Error('useLocationPermission must be used within LocationPermissionProvider');
  }
  return context;
};

const LocationPermissionProvider = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Check if geolocation is supported
  const isGeolocationSupported = 'geolocation' in navigator;

  // Handle successful location access
  const handleLocationSuccess = useCallback((position) => {
    const locationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };
    
    setCurrentLocation(locationData);
    setPermissionStatus('granted');
    setPermissionError(null);
    setIsRequesting(false);
    
    // Store permission granted status
    localStorage.setItem('locationPermissionRequested', 'true');
    localStorage.setItem('locationPermissionStatus', 'granted');
    
    console.log('Location access granted:', locationData);
  }, []);

  // Handle location access error
  const handleLocationError = useCallback((error) => {
    let errorMessage = '';
    let status = 'denied';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        status = 'denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        status = 'unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        status = 'timeout';
        break;
      default:
        errorMessage = 'Unknown location error occurred';
        status = 'error';
        break;
    }

    setPermissionError({ 
      code: error.code, 
      message: errorMessage,
      type: status 
    });
    setPermissionStatus(status);
    setIsRequesting(false);
    
    // Store permission status
    localStorage.setItem('locationPermissionRequested', 'true');
    localStorage.setItem('locationPermissionStatus', status);
    
    console.warn('Location access error:', errorMessage);
  }, []);

  // Request location permission from browser
  const requestLocationPermission = useCallback(async () => {
    if (!isGeolocationSupported) {
      setPermissionError({ 
        code: 'NOT_SUPPORTED', 
        message: 'Geolocation not supported by this browser',
        type: 'not_supported'
      });
      setPermissionStatus('not_supported');
      return;
    }

    if (hasRequested || isRequesting) {
      return;
    }

    setIsRequesting(true);
    setHasRequested(true);
    setPermissionError(null);

    try {
      // First, check permission status if supported
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          setPermissionStatus('denied');
          setPermissionError({
            code: 'PERMISSION_DENIED',
            message: 'Location access previously denied',
            type: 'denied'
          });
          setIsRequesting(false);
          return;
        }
        
        if (permission.state === 'granted') {
          // If already granted, get current position
          navigator.geolocation.getCurrentPosition(
            handleLocationSuccess,
            handleLocationError,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
          return;
        }
      }

      // Request location access - this triggers the browser permission prompt
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000 // 1 minute
        }
      );

    } catch (error) {
      console.error('Error requesting location permission:', error);
      setPermissionError({
        code: 'REQUEST_ERROR',
        message: 'Failed to request location permission',
        type: 'error'
      });
      setPermissionStatus('error');
      setIsRequesting(false);
    }
  }, [isGeolocationSupported, hasRequested, isRequesting, handleLocationSuccess, handleLocationError]);

  // Check existing permission status and request if needed
  useEffect(() => {
    // Check if we've already requested permission
    const hasRequestedBefore = localStorage.getItem('locationPermissionRequested') === 'true';
    const savedStatus = localStorage.getItem('locationPermissionStatus');
    
    if (hasRequestedBefore && savedStatus) {
      setPermissionStatus(savedStatus);
      setHasRequested(true);
      
      // If permission was granted before, try to get current location
      if (savedStatus === 'granted' && isGeolocationSupported) {
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          (error) => {
            // If we can't get location even though permission was granted,
            // the user might have revoked it
            if (error.code === error.PERMISSION_DENIED) {
              setPermissionStatus('denied');
              localStorage.setItem('locationPermissionStatus', 'denied');
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 600000 // 10 minutes
          }
        );
      }
    } else {
      // First time - automatically request location permission
      // Add a small delay to ensure the app has finished loading
      const timer = setTimeout(() => {
        requestLocationPermission();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isGeolocationSupported, requestLocationPermission, handleLocationSuccess]);

  // Retry location request
  const retryLocationRequest = useCallback(() => {
    setHasRequested(false);
    setPermissionError(null);
    localStorage.removeItem('locationPermissionRequested');
    localStorage.removeItem('locationPermissionStatus');
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Context value
  const contextValue = {
    permissionStatus,
    currentLocation,
    permissionError,
    isRequesting,
    hasRequested,
    isGeolocationSupported,
    requestLocationPermission,
    retryLocationRequest
  };

  return (
    <LocationPermissionContext.Provider value={contextValue}>
      {children}
    </LocationPermissionContext.Provider>
  );
};

export default LocationPermissionProvider;