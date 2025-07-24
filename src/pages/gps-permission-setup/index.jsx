import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LocationPermissionCard from './components/LocationPermissionCard';
import SetupInstructions from './components/SetupInstructions';
import PreferencesToggle from './components/PreferencesToggle';
import TroubleshootingHelp from './components/TroubleshootingHelp';
import LoadingState from './components/LoadingState';
import SuccessState from './components/SuccessState';

const GPSPermissionSetup = () => {
  const navigate = useNavigate();
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing GPS...');
  
  // Preferences state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoNavigationEnabled, setAutoNavigationEnabled] = useState(false);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setPermissionStatus('denied');
      return;
    }

    // Check existing permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
      });
    }

    // Load saved preferences
    const savedVoice = localStorage.getItem('voiceGuidanceEnabled');
    const savedAutoNav = localStorage.getItem('autoNavigationEnabled');
    
    if (savedVoice !== null) {
      setVoiceEnabled(JSON.parse(savedVoice));
    }
    if (savedAutoNav !== null) {
      setAutoNavigationEnabled(JSON.parse(savedAutoNav));
    }
  }, []);

  const simulateLoadingProgress = () => {
    const steps = [
      { progress: 25, message: 'Requesting location permission...' },
      { progress: 50, message: 'Connecting to GPS satellites...' },
      { progress: 75, message: 'Calibrating position accuracy...' },
      { progress: 100, message: 'Loading campus map data...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingProgress(steps[currentStep].progress);
        setLoadingMessage(steps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          setShowSuccess(true);
        }, 500);
      }
    }, 800);

    return interval;
  };

  const handleEnableLocation = () => {
    if (permissionStatus === 'granted') {
      navigate('/campus-navigation-map');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Requesting location permission...');

    const loadingInterval = simulateLoadingProgress();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocationData({ latitude, longitude, accuracy });
        setPermissionStatus('granted');
        
        // Save preferences
        localStorage.setItem('voiceGuidanceEnabled', JSON.stringify(voiceEnabled));
        localStorage.setItem('autoNavigationEnabled', JSON.stringify(autoNavigationEnabled));
        localStorage.setItem('locationPermissionGranted', 'true');
      },
      (error) => {
        clearInterval(loadingInterval);
        setIsLoading(false);
        setPermissionStatus('denied');
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleContinueToMap = () => {
    navigate('/campus-navigation-map');
  };

  const handleVoiceToggle = (enabled) => {
    setVoiceEnabled(enabled);
    localStorage.setItem('voiceGuidanceEnabled', JSON.stringify(enabled));
  };

  const handleAutoNavigationToggle = (enabled) => {
    setAutoNavigationEnabled(enabled);
    localStorage.setItem('autoNavigationEnabled', JSON.stringify(enabled));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <LoadingState 
              message={loadingMessage} 
              progress={loadingProgress} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <SuccessState 
              isVisible={showSuccess}
              locationData={locationData}
              onContinue={handleContinueToMap}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  FLAME Campus Navigator
                </h1>
                <p className="text-xs text-muted-foreground">
                  GPS Setup & Configuration
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings-preferences')}
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4">
              <Icon name="MapPin" size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Campus Navigation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Set up location services to get precise directions across FLAME University campus
            </p>
          </div>

          {/* Location Permission Card */}
          <LocationPermissionCard
            onEnableLocation={handleEnableLocation}
            isLoading={isLoading}
            permissionStatus={permissionStatus}
          />

          {/* Setup Instructions */}
          {permissionStatus !== 'granted' && (
            <SetupInstructions />
          )}

          {/* Preferences Toggle */}
          <PreferencesToggle
            voiceEnabled={voiceEnabled}
            onVoiceToggle={handleVoiceToggle}
            autoNavigationEnabled={autoNavigationEnabled}
            onAutoNavigationToggle={handleAutoNavigationToggle}
          />

          {/* Troubleshooting Help */}
          <TroubleshootingHelp
            isVisible={showTroubleshooting}
            onToggle={() => setShowTroubleshooting(!showTroubleshooting)}
          />

          {/* Footer Actions */}
          <div className="text-center space-y-4">
            {permissionStatus === 'granted' && (
              <Button
                variant="outline"
                fullWidth
                iconName="Map"
                iconPosition="left"
                onClick={handleContinueToMap}
                className="h-12"
              >
                Go to Campus Map
              </Button>
            )}

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Smartphone" size={14} />
                <span>Mobile Optimized</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={14} />
                <span>Real-time Updates</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Your location data is processed locally and never shared with external services
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GPSPermissionSetup;