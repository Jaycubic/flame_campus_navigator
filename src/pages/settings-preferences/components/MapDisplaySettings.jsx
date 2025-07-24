import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import SettingSelect from './SettingSelect';
import SettingSlider from './SettingSlider';

const MapDisplaySettings = ({ settings, onSettingChange }) => {
  const markerStyleOptions = [
    { value: 'classic', label: 'Classic Blue', description: 'Traditional blue location marker' },
    { value: 'modern', label: 'Modern Gradient', description: 'Colorful gradient marker' },
    { value: 'minimal', label: 'Minimal Dot', description: 'Simple dot indicator' },
    { value: 'flame', label: 'FLAME Branded', description: 'University branded marker' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode', description: 'Standard light theme' },
    { value: 'dark', label: 'Dark Mode', description: 'Dark theme for low light' },
    { value: 'auto', label: 'Auto', description: 'Follow system preference' }
  ];

  return (
    <SettingsSection
      title="Map Display"
      description="Customize map appearance and visual preferences"
      icon="Map"
    >
      <div className="space-y-1">
        <SettingSlider
          label="Default Zoom Level"
          description="Set the initial zoom level when opening the map"
          value={settings.defaultZoom}
          onChange={(value) => onSettingChange('defaultZoom', value)}
          min={1}
          max={20}
          step={1}
          unit="x"
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Marker Style"
            description="Choose how your location appears on the map"
            options={markerStyleOptions}
            value={settings.markerStyle}
            onChange={(value) => onSettingChange('markerStyle', value)}
          />
        </div>
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Theme"
            description="Select your preferred color scheme"
            options={themeOptions}
            value={settings.theme}
            onChange={(value) => onSettingChange('theme', value)}
          />
        </div>
        
        <SettingToggle
          label="High Contrast Mode"
          description="Enhance visibility with increased contrast for accessibility"
          checked={settings.highContrast}
          onChange={(e) => onSettingChange('highContrast', e.target.checked)}
        />
        
        <SettingToggle
          label="Show Building Labels"
          description="Display building names and numbers on the map"
          checked={settings.showBuildingLabels}
          onChange={(e) => onSettingChange('showBuildingLabels', e.target.checked)}
        />
        
        <SettingToggle
          label="Animated Transitions"
          description="Enable smooth animations for map movements and markers"
          checked={settings.animatedTransitions}
          onChange={(e) => onSettingChange('animatedTransitions', e.target.checked)}
        />
      </div>
    </SettingsSection>
  );
};

export default MapDisplaySettings;