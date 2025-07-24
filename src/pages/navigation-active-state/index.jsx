import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ActiveNavigationMap from './components/ActiveNavigationMap';
import NavigationControlPanel from './components/NavigationControlPanel';
import CompassWidget from './components/CompassWidget';
import VoiceGuidanceIndicator from './components/VoiceGuidanceIndicator';
import ArrivalCelebration from './components/ArrivalCelebration';

const NavigationActiveState = () => {
  const navigate = useNavigate();
  
  // Navigation state
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [isNavigating, setIsNavigating] = useState(true);
  const [userHeading, setUserHeading] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState('high');
  
  // Voice guidance state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    volume: 0.8,
    rate: 1.0,
    pitch: 1.0
  });
  
  // UI state
  const [showCompass, setShowCompass] = useState(true);
  const [showArrivalCelebration, setShowArrivalCelebration] = useState(false);
  const [distance, setDistance] = useState('0.2 km');
  const [estimatedTime, setEstimatedTime] = useState('3 min');
  const [nextInstruction, setNextInstruction] = useState('');
  const [destinationBearing, setDestinationBearing] = useState(0);

  // Mock destination data
  const mockDestination = {
    id: 1,
    name: 'Main Library',
    building: 'Academic Block A',
    lat: 18.5265,
    lng: 73.7285,
    category: 'academic'
  };

  // Mock current position (simulating GPS)
  const mockCurrentPosition = {
    lat: 18.5270,
    lng: 73.7280,
    accuracy: 5
  };

  // Mock route path
  const mockRoutePath = [
    { lat: 18.5270, lng: 73.7280 },
    { lat: 18.5268, lng: 73.7282 },
    { lat: 18.5266, lng: 73.7284 },
    { lat: 18.5265, lng: 73.7285 }
  ];

  // Initialize navigation data
  useEffect(() => {
    setDestination(mockDestination);
    setCurrentPosition(mockCurrentPosition);
    setRoutePath(mockRoutePath);
    setNextInstruction('Head northeast towards Academic Block A. Continue straight for 150 meters.');
    
    // Simulate initial voice announcement
    if (isVoiceEnabled) {
      setCurrentAnnouncement('Navigation started. Head northeast towards Academic Block A.');
      setTimeout(() => setCurrentAnnouncement(''), 4000);
    }
  }, []);

  // Simulate GPS updates
  useEffect(() => {
    if (!isNavigating) return;

    const gpsInterval = setInterval(() => {
      // Simulate movement towards destination
      setCurrentPosition(prev => {
        if (!prev || !destination) return prev;
        
        const newLat = prev.lat + (Math.random() - 0.5) * 0.0001;
        const newLng = prev.lng + (Math.random() - 0.5) * 0.0001;
        
        return {
          lat: newLat,
          lng: newLng,
          accuracy: 3 + Math.random() * 7
        };
      });
      
      // Update heading
      setUserHeading(prev => (prev + (Math.random() - 0.5) * 10) % 360);
      
      // Update distance and time
      const newDistance = (0.15 + Math.random() * 0.1).toFixed(1);
      const newTime = Math.ceil(parseFloat(newDistance) * 15);
      setDistance(`${newDistance} km`);
      setEstimatedTime(`${newTime} min`);
      
      // Check for arrival (simulate proximity)
      if (Math.random() > 0.95) {
        handleArrival();
      }
    }, 2000);

    return () => clearInterval(gpsInterval);
  }, [isNavigating, destination]);

  // Voice guidance announcements
  useEffect(() => {
    if (!isVoiceEnabled || !isNavigating) return;

    const announcementInterval = setInterval(() => {
      const announcements = [
        'Continue straight ahead.',
        'In 50 meters, you will reach your destination.',
        'Keep following the blue path.',
        'Academic Block A is ahead on your right.'
      ];
      
      if (Math.random() > 0.7) {
        const announcement = announcements[Math.floor(Math.random() * announcements.length)];
        setCurrentAnnouncement(announcement);
        
        // Use Web Speech API for voice synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(announcement);
          utterance.volume = voiceSettings.volume;
          utterance.rate = voiceSettings.rate;
          utterance.pitch = voiceSettings.pitch;
          speechSynthesis.speak(utterance);
        }
        
        setTimeout(() => setCurrentAnnouncement(''), 4000);
      }
    }, 8000);

    return () => clearInterval(announcementInterval);
  }, [isVoiceEnabled, isNavigating, voiceSettings]);

  // Calculate destination bearing
  useEffect(() => {
    if (currentPosition && destination) {
      const lat1 = currentPosition.lat * Math.PI / 180;
      const lat2 = destination.lat * Math.PI / 180;
      const deltaLng = (destination.lng - currentPosition.lng) * Math.PI / 180;
      
      const bearing = Math.atan2(
        Math.sin(deltaLng) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)
      ) * 180 / Math.PI;
      
      setDestinationBearing((bearing + 360) % 360);
    }
  }, [currentPosition, destination]);

  const handleArrival = useCallback(() => {
    setIsNavigating(false);
    setShowArrivalCelebration(true);
    
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('You have arrived at your destination. Welcome to Main Library.');
      utterance.volume = voiceSettings.volume;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      speechSynthesis.speak(utterance);
    }
  }, [isVoiceEnabled, voiceSettings]);

  const handleCancelNavigation = () => {
    setIsNavigating(false);
    navigate('/campus-navigation-map');
  };

  const handleVoiceToggle = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    
    if (!isVoiceEnabled) {
      setCurrentAnnouncement('Voice guidance enabled');
      setTimeout(() => setCurrentAnnouncement(''), 3000);
    } else {
      speechSynthesis.cancel();
      setCurrentAnnouncement('');
    }
  };

  const handleRecalculateRoute = () => {
    // Simulate route recalculation
    setCurrentAnnouncement('Recalculating route...');
    setTimeout(() => {
      setCurrentAnnouncement('New route calculated. Continue straight ahead.');
      setTimeout(() => setCurrentAnnouncement(''), 4000);
    }, 2000);
  };

  const handleDismissAnnouncement = () => {
    setCurrentAnnouncement('');
    speechSynthesis.cancel();
  };

  const handleArrivalDismiss = () => {
    setShowArrivalCelebration(false);
    navigate('/campus-navigation-map');
  };

  const handleNavigateAgain = () => {
    setShowArrivalCelebration(false);
    navigate('/destination-search-selection');
  };

  const handleViewDestinationInfo = () => {
    setShowArrivalCelebration(false);
    // Navigate to destination info page (would be implemented)
    navigate('/campus-navigation-map');
  };

  const handleToggleCompass = () => {
    setShowCompass(!showCompass);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Full Screen Navigation Map */}
      <div className="absolute inset-0">
        <ActiveNavigationMap
          currentPosition={currentPosition}
          destination={destination}
          routePath={routePath}
          userHeading={userHeading}
          isFollowingUser={true}
        />
      </div>

      {/* Compass Widget */}
      <CompassWidget
        userHeading={userHeading}
        destinationBearing={destinationBearing}
        isVisible={showCompass}
        onToggleVisibility={handleToggleCompass}
      />

      {/* Voice Guidance Indicator */}
      <VoiceGuidanceIndicator
        isActive={isVoiceEnabled}
        currentAnnouncement={currentAnnouncement}
        onDismiss={handleDismissAnnouncement}
        voiceSettings={voiceSettings}
      />

      {/* Navigation Control Panel */}
      <AnimatePresence>
        {isNavigating && (
          <NavigationControlPanel
            destination={destination}
            distance={distance}
            estimatedTime={estimatedTime}
            isVoiceEnabled={isVoiceEnabled}
            onCancelNavigation={handleCancelNavigation}
            onVoiceToggle={handleVoiceToggle}
            onRecalculateRoute={handleRecalculateRoute}
            nextInstruction={nextInstruction}
            gpsAccuracy={gpsAccuracy}
          />
        )}
      </AnimatePresence>

      {/* Arrival Celebration */}
      <ArrivalCelebration
        isVisible={showArrivalCelebration}
        destination={destination}
        onDismiss={handleArrivalDismiss}
        onNavigateAgain={handleNavigateAgain}
        onViewDestinationInfo={handleViewDestinationInfo}
        arrivalTime={new Date()}
      />

      {/* Emergency Floating Button */}
      <motion.button
        className="fixed bottom-32 right-4 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
        onClick={() => {
          // Emergency contact functionality
          if (confirm('Call campus security?')) {
            window.location.href = 'tel:+911234567890';
          }
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📞
        </motion.div>
      </motion.button>
    </div>
  );
};

export default NavigationActiveState;