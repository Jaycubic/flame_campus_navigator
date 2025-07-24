import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import SettingSelect from './SettingSelect';
import SettingSlider from './SettingSlider';

const NavigationBehaviorSettings = ({ settings, onSettingChange }) => {
  const routePreferenceOptions = [
    { value: 'fastest', label: 'Fastest Route', description: 'Prioritize speed and efficiency' },
    { value: 'scenic', label: 'Scenic Route', description: 'Take more pleasant paths through campus' },
    { value: 'accessible', label: 'Accessible Route', description: 'Prefer wheelchair accessible paths' }
  ];

  const reroutingSensitivityOptions = [
    { value: 'low', label: 'Low', description: 'Only reroute for major deviations' },
    { value: 'medium', label: 'Medium', description: 'Balanced rerouting sensitivity' },
    { value: 'high', label: 'High', description: 'Reroute for minor path deviations' }
  ];

  return (
    <SettingsSection
      title="Navigation Behavior"
      description="Configure route calculation and navigation preferences"
      icon="Navigation"
    >
      <div className="space-y-1">
        <SettingSelect
          label="Route Preference"
          description="Choose your preferred type of navigation route"
          options={routePreferenceOptions}
          value={settings.routePreference}
          onChange={(value) => onSettingChange('routePreference', value)}
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Auto Re-routing Sensitivity"
            description="How quickly the app recalculates when you go off route"
            options={reroutingSensitivityOptions}
            value={settings.reroutingSensitivity}
            onChange={(value) => onSettingChange('reroutingSensitivity', value)}
          />
        </div>
        
        <SettingSlider
          label="Arrival Radius"
          description="Distance from destination to trigger arrival notification"
          value={settings.arrivalRadius}
          onChange={(value) => onSettingChange('arrivalRadius', value)}
          min={5}
          max={50}
          step={5}
          unit="m"
        />
        
        <SettingToggle
          label="Vibration Feedback"
          description="Vibrate device for navigation alerts and arrivals"
          checked={settings.vibrationFeedback}
          onChange={(e) => onSettingChange('vibrationFeedback', e.target.checked)}
        />
        
        <SettingToggle
          label="Auto-Start Navigation"
          description="Automatically begin navigation when destination is selected"
          checked={settings.autoStartNavigation}
          onChange={(e) => onSettingChange('autoStartNavigation', e.target.checked)}
        />
        
        <SettingToggle
          label="Keep Screen On"
          description="Prevent screen from turning off during active navigation"
          checked={settings.keepScreenOn}
          onChange={(e) => onSettingChange('keepScreenOn', e.target.checked)}
        />
      </div>
    </SettingsSection>
  );
};

export default NavigationBehaviorSettings;