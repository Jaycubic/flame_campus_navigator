import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import SettingSelect from './SettingSelect';

const LocationServicesSettings = ({ settings, onSettingChange }) => {
  const accuracyOptions = [
    { value: 'high', label: 'High Accuracy', description: 'Best precision, higher battery usage' },
    { value: 'balanced', label: 'Balanced', description: 'Good precision with moderate battery usage' },
    { value: 'low', label: 'Battery Saver', description: 'Lower precision, minimal battery usage' }
  ];

  return (
    <SettingsSection
      title="Location Services"
      description="Manage GPS accuracy and battery optimization"
      icon="MapPin"
    >
      <div className="space-y-1">
        <SettingToggle
          label="Enable GPS Tracking"
          description="Allow the app to access your location for navigation"
          checked={settings.gpsEnabled}
          onChange={(e) => onSettingChange('gpsEnabled', e.target.checked)}
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="GPS Accuracy"
            description="Choose between accuracy and battery life"
            options={accuracyOptions}
            value={settings.gpsAccuracy}
            onChange={(value) => onSettingChange('gpsAccuracy', value)}
            disabled={!settings.gpsEnabled}
          />
        </div>
        
        <SettingToggle
          label="Background Location"
          description="Continue tracking location when app is minimized"
          checked={settings.backgroundLocation}
          onChange={(e) => onSettingChange('backgroundLocation', e.target.checked)}
          disabled={!settings.gpsEnabled}
        />
        
        <SettingToggle
          label="Battery Optimization"
          description="Reduce GPS frequency when stationary to save battery"
          checked={settings.batteryOptimization}
          onChange={(e) => onSettingChange('batteryOptimization', e.target.checked)}
          disabled={!settings.gpsEnabled}
        />
      </div>
    </SettingsSection>
  );
};

export default LocationServicesSettings;