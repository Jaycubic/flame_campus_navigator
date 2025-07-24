import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MapHeaderOverlay from '../../components/ui/MapHeaderOverlay';
import SearchModalOverlay from '../../components/ui/SearchModalOverlay';
import NavigationStatusIndicator from '../../components/ui/NavigationStatusIndicator';
import CampusMapSVG from './components/CampusMapSVG';
import GPSLocationTracker from './components/GPSLocationTracker';
import useVoiceGuidanceSystem from './components/VoiceGuidanceSystem';
import NavigationControls from './components/NavigationControls';
import { useLocationPermission } from '../../components/LocationPermissionProvider';

const CampusNavigationMap = () => {
  const navigate = useNavigate();
  
  // Use location permission context
  const { 
    permissionStatus: globalPermissionStatus, 
    currentLocation: globalLocation,
    permissionError: globalError,
    isRequesting: isRequestingPermission
  } = useLocationPermission();
  
  // Core navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [userPosition, setUserPosition] = useState(globalLocation);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // GPS and location state
  const [gpsPermissionStatus, setGpsPermissionStatus] = useState(globalPermissionStatus);
  const [gpsAccuracy, setGpsAccuracy] = useState('high');
  const [locationError, setLocationError] = useState(globalError);
  
  // Voice guidance state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Enhanced navigation statistics with route optimization
  const [navigationStats, setNavigationStats] = useState({
    distance: '0.0 km',
    estimatedTime: '0 min',
    nextInstruction: '',
    routeProgress: 0,
    waypoints: [],
    instructions: [],
    optimizedRoute: null
  });

  // Update local state when global location permission changes
  useEffect(() => {
    setGpsPermissionStatus(globalPermissionStatus);
    setLocationError(globalError);
    if (globalLocation) {
      setUserPosition(globalLocation);
    }
  }, [globalPermissionStatus, globalLocation, globalError]);

  // Initialize GPS tracking
  const gpsTracker = GPSLocationTracker({
    onLocationUpdate: handleLocationUpdate,
    onPermissionChange: handlePermissionChange,
    isActive: globalPermissionStatus === 'granted',
    accuracy: 'high'
  });

  // Initialize voice guidance
  const voiceGuidance = useVoiceGuidanceSystem({
    isEnabled: isVoiceEnabled,
    language: 'en-US',
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
    onSpeechError: (error) => console.error('Voice guidance error:', error)
  });

  // Handle GPS location updates
  function handleLocationUpdate(locationData) {
    setUserPosition(locationData);
    
    // Update GPS accuracy status
    const accuracy = locationData.accuracy;
    if (accuracy <= 5) setGpsAccuracy('high');
    else if (accuracy <= 20) setGpsAccuracy('medium');
    else setGpsAccuracy('low');
    
    // Check proximity to destination if navigating
    if (isNavigating && selectedDestination) {
      checkDestinationProximity(locationData);
      updateEnhancedNavigationStats(locationData);
    }
  }

  // Handle GPS permission changes
  function handlePermissionChange(status) {
    setGpsPermissionStatus(status);
    
    if (status === 'denied') {
      navigate('/gps-permission-setup');
    }
  }

  // Check if user has reached destination
  const checkDestinationProximity = useCallback((currentLocation) => {
    if (!selectedDestination || !currentLocation) return;
    
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      selectedDestination.lat,
      selectedDestination.lng
    );
    
    // Arrival detection (within 10 meters)
    if (distance <= 10) {
      handleDestinationReached();
    }
    // Proximity alert (within 50 meters)
    else if (distance <= 50 && !navigationStats.proximityAlerted) {
      voiceGuidance.announceProximityAlert(selectedDestination.name, distance);
      setNavigationStats(prev => ({ ...prev, proximityAlerted: true }));
    }
  }, [selectedDestination, navigationStats.proximityAlerted, voiceGuidance]);

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

  // Enhanced navigation statistics update with route optimization
  const updateEnhancedNavigationStats = useCallback((currentLocation) => {
    if (!selectedDestination || !currentLocation) return;
    
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      selectedDestination.lat,
      selectedDestination.lng
    );
    
    const estimatedTime = Math.max(1, Math.round(distance / 83.33)); // Assuming 5 km/h walking speed
    
    setNavigationStats(prev => ({
      ...prev,
      distance: distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`,
      estimatedTime: estimatedTime >= 60 ? `${Math.round(estimatedTime / 60)} hr ${estimatedTime % 60} min` : `${estimatedTime} min`,
      nextInstruction: generateEnhancedInstruction(distance, prev.optimizedRoute),
      routeProgress: calculateRouteProgress(currentLocation, prev.optimizedRoute)
    }));
  }, [selectedDestination, calculateDistance]);

  // Generate enhanced navigation instruction
  const generateEnhancedInstruction = useCallback((distance, optimizedRoute) => {
    if (distance <= 10) return "You have arrived at your destination";
    if (distance <= 50) return "Destination is very close - look for landmarks";
    
    // Use route optimization for better instructions
    if (optimizedRoute?.instructions?.length > 0) {
      const currentInstruction = optimizedRoute.instructions.find(instruction => 
        instruction.distance >= distance - 20 && instruction.distance <= distance + 20
      );
      if (currentInstruction) return currentInstruction.instruction;
    }
    
    if (distance <= 100) return "Continue straight ahead";
    if (distance <= 200) return "Keep walking towards your destination";
    return "Follow the highlighted route";
  }, []);

  // Calculate route progress percentage
  const calculateRouteProgress = useCallback((currentLocation, optimizedRoute) => {
    if (!optimizedRoute || !currentLocation) return 0;
    
    const totalDistance = optimizedRoute.totalDistance || 1;
    const remainingDistance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      selectedDestination?.lat || 0,
      selectedDestination?.lng || 0
    );
    
    return Math.max(0, Math.min(100, ((totalDistance - remainingDistance) / totalDistance) * 100));
  }, [calculateDistance, selectedDestination]);

  // Enhanced destination selection with custom location support
  const handleDestinationSelect = useCallback((destination) => {
    setSelectedDestination(destination);
    setShowSearchModal(false);
    
    if (userPosition) {
      startEnhancedNavigation(destination);
    }
    
    // Announce destination selection
    if (isVoiceEnabled) {
      const locationName = destination.isCustom ? 'selected location' : destination.name;
      voiceGuidance.announceDestinationSelected(locationName);
    }
  }, [userPosition, isVoiceEnabled, voiceGuidance]);

  // Enhanced navigation start with route optimization
  const startEnhancedNavigation = useCallback((destination) => {
    setIsNavigating(true);
    
    // Reset navigation stats with enhanced data
    setNavigationStats(prev => ({ 
      ...prev, 
      proximityAlerted: false,
      routeProgress: 0,
      waypoints: [],
      instructions: []
    }));
    
    // Announce navigation start with enhanced information
    if (isVoiceEnabled) {
      const locationName = destination.isCustom ? 'your selected location' : destination.name;
      voiceGuidance.announceNavigationStarted(locationName);
      
      // Provide additional context for custom locations
      if (destination.isCustom) {
        setTimeout(() => {
          voiceGuidance.announceCustomLocationInfo();
        }, 2000);
      }
    }
    
    navigate('/navigation-active-state', { 
      state: { destination, userPosition, isCustom: destination.isCustom } 
    });
  }, [isVoiceEnabled, voiceGuidance, navigate, userPosition]);

  // Handle destination reached
  const handleDestinationReached = useCallback(() => {
    if (isVoiceEnabled) {
      const locationName = selectedDestination?.isCustom ? 'your selected location' : selectedDestination?.name;
      voiceGuidance.announceDestinationReached(locationName);
    }
    
    // Reset navigation state with enhanced cleanup
    setTimeout(() => {
      setIsNavigating(false);
      setSelectedDestination(null);
      setNavigationStats({
        distance: '0.0 km',
        estimatedTime: '0 min',
        nextInstruction: '',
        routeProgress: 0,
        waypoints: [],
        instructions: [],
        optimizedRoute: null
      });
    }, 3000);
  }, [isVoiceEnabled, voiceGuidance, selectedDestination]);

  // Cancel navigation
  const handleCancelNavigation = useCallback(() => {
    if (isVoiceEnabled) {
      voiceGuidance.announceNavigationCancelled();
    }
    
    setIsNavigating(false);
    setSelectedDestination(null);
    setNavigationStats({
      distance: '0.0 km',
      estimatedTime: '0 min',
      nextInstruction: '',
      routeProgress: 0,
      waypoints: [],
      instructions: [],
      optimizedRoute: null
    });
  }, [isVoiceEnabled, voiceGuidance]);

  // Toggle voice guidance
  const handleVoiceToggle = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  // Handle search modal
  const handleSearchClick = useCallback(() => {
    setShowSearchModal(true);
  }, []);

  const handleSearchModalClose = useCallback(() => {
    setShowSearchModal(false);
  }, []);

  // Handle settings
  const handleSettingsClick = useCallback(() => {
    navigate('/settings-preferences');
  }, [navigate]);

  // Recenter map to user location
  const handleRecenterMap = useCallback(() => {
    // This would trigger map recentering in the CampusMapSVG component
    // Implementation depends on map component's API
  }, []);

  // Check GPS permission on mount
  useEffect(() => {
    if (gpsPermissionStatus === 'denied') {
      navigate('/gps-permission-setup');
    }
  }, [gpsPermissionStatus, navigate]);

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden">
      {/* Map Header Overlay */}
      <MapHeaderOverlay
        isNavigating={isNavigating}
        onSettingsClick={handleSettingsClick}
      />

      {/* Enhanced Campus Map with place selection */}
      <div className="absolute inset-0">
        <CampusMapSVG
          userPosition={userPosition}
          selectedDestination={selectedDestination}
          onDestinationSelect={handleDestinationSelect}
          isNavigating={isNavigating}
          showRoute={isNavigating}
        />
      </div>

      {/* Enhanced Navigation Status Indicator */}
      <NavigationStatusIndicator
        isVisible={isNavigating}
        distance={navigationStats.distance}
        estimatedTime={navigationStats.estimatedTime}
        nextInstruction={navigationStats.nextInstruction}
        gpsAccuracy={gpsAccuracy}
        isVoiceEnabled={isVoiceEnabled}
        routeProgress={navigationStats.routeProgress}
        waypoints={navigationStats.waypoints}
      />

      {/* Enhanced Navigation Controls */}
      <NavigationControls
        mode={isNavigating ? 'navigating' : 'browsing'}
        onSearchClick={handleSearchClick}
        onCancelNavigation={handleCancelNavigation}
        onVoiceToggle={handleVoiceToggle}
        isVoiceEnabled={isVoiceEnabled}
        currentDestination={selectedDestination}
        navigationStats={navigationStats}
        onRecenterMap={handleRecenterMap}
        onSettingsClick={handleSettingsClick}
      />

      {/* Search Modal Overlay */}
      <SearchModalOverlay
        isVisible={showSearchModal}
        onClose={handleSearchModalClose}
        onDestinationSelect={handleDestinationSelect}
        searchQuery=""
        onSearchChange={() => {}}
      />

      {/* Loading Overlay for Location Permission Request */}
      <AnimatePresence>
        {(isRequestingPermission || globalPermissionStatus === 'prompt') && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Requesting Location Access
              </h3>
              <p className="text-gray-600 text-sm">
                Please allow location access to enable campus navigation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {locationError && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-40"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800">
                    Location Error
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    {locationError.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusNavigationMap;