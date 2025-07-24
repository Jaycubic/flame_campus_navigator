import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsHeader from './components/SettingsHeader';
import LocationServicesSettings from './components/LocationServicesSettings';
import VoiceGuidanceSettings from './components/VoiceGuidanceSettings';
import MapDisplaySettings from './components/MapDisplaySettings';
import NavigationBehaviorSettings from './components/NavigationBehaviorSettings';
import PrivacyControlsSettings from './components/PrivacyControlsSettings';
import AccessibilitySettings from './components/AccessibilitySettings';
import UniversityIntegrationSettings from './components/UniversityIntegrationSettings';

const SettingsPreferences = () => {
  const [settings, setSettings] = useState({
    // Location Services
    gpsEnabled: true,
    gpsAccuracy: 'high',
    backgroundLocation: false,
    batteryOptimization: true,
    
    // Voice Guidance
    voiceEnabled: true,
    voiceType: 'female1',
    voiceVolume: 75,
    announcementFrequency: 'standard',
    arrivalNotifications: true,
    
    // Map Display
    defaultZoom: 15,
    markerStyle: 'flame',
    theme: 'auto',
    highContrast: false,
    showBuildingLabels: true,
    animatedTransitions: true,
    
    // Navigation Behavior
    routePreference: 'fastest',
    reroutingSensitivity: 'medium',
    arrivalRadius: 10,
    vibrationFeedback: true,
    autoStartNavigation: false,
    keepScreenOn: true,
    
    // Privacy Controls
    saveLocationHistory: true,
    anonymousAnalytics: false,
    
    // Accessibility
    textSize: 'medium',
    contrastLevel: 'normal',
    simplifiedInterface: false,
    reduceMotion: false,
    screenReaderSupport: false,
    largeTouchTargets: false,
    audioDescriptions: false,
    
    // University Integration
    flameBranding: true,
    campusNotifications: true,
    academicCalendar: false,
    emergencyAlerts: true
  });

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('campusNavigatorSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('campusNavigatorSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  };

  const handleResetToDefaults = () => {
    if (showResetConfirmation) {
      // Reset to default settings
      const defaultSettings = {
        gpsEnabled: true,
        gpsAccuracy: 'high',
        backgroundLocation: false,
        batteryOptimization: true,
        voiceEnabled: true,
        voiceType: 'female1',
        voiceVolume: 75,
        announcementFrequency: 'standard',
        arrivalNotifications: true,
        defaultZoom: 15,
        markerStyle: 'flame',
        theme: 'auto',
        highContrast: false,
        showBuildingLabels: true,
        animatedTransitions: true,
        routePreference: 'fastest',
        reroutingSensitivity: 'medium',
        arrivalRadius: 10,
        vibrationFeedback: true,
        autoStartNavigation: false,
        keepScreenOn: true,
        saveLocationHistory: true,
        anonymousAnalytics: false,
        textSize: 'medium',
        contrastLevel: 'normal',
        simplifiedInterface: false,
        reduceMotion: false,
        screenReaderSupport: false,
        largeTouchTargets: false,
        audioDescriptions: false,
        flameBranding: true,
        campusNotifications: true,
        academicCalendar: false,
        emergencyAlerts: true
      };
      
      setSettings(defaultSettings);
      setShowResetConfirmation(false);
      
      // Show success feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } else {
      setShowResetConfirmation(true);
      setTimeout(() => setShowResetConfirmation(false), 3000);
    }
  };

  const handleClearLocationHistory = () => {
    localStorage.removeItem('campusNavigatorLocationHistory');
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleResetPermissions = () => {
    // This would typically trigger a permission reset dialog
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        console.log('Current geolocation permission:', result.state);
      });
    }
  };

  const handleCheckMapUpdates = () => {
    // Simulate checking for updates
    console.log('Checking for map updates...');
  };

  const handleContactSupport = () => {
    // Open support contact
    window.open('mailto:it-support@flame.edu.in?subject=Campus Navigator Support', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader 
        onResetToDefaults={handleResetToDefaults}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pb-8"
      >
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <motion.div variants={itemVariants}>
            <LocationServicesSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <VoiceGuidanceSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <MapDisplaySettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NavigationBehaviorSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PrivacyControlsSettings
              settings={settings}
              onSettingChange={handleSettingChange}
              onClearLocationHistory={handleClearLocationHistory}
              onResetPermissions={handleResetPermissions}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AccessibilitySettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <UniversityIntegrationSettings
              settings={settings}
              onSettingChange={handleSettingChange}
              onCheckMapUpdates={handleCheckMapUpdates}
              onContactSupport={handleContactSupport}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Reset Confirmation Toast */}
      {showResetConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-warning text-warning-foreground rounded-lg p-4 shadow-lg">
            <p className="text-sm font-medium">
              Tap "Reset" again to restore all settings to default values
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPreferences;