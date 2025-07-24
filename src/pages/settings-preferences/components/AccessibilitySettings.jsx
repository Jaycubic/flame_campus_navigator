import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import SettingSelect from './SettingSelect';

const AccessibilitySettings = ({ settings, onSettingChange }) => {
  const textSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact text for more content' },
    { value: 'medium', label: 'Medium', description: 'Standard text size' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability' },
    { value: 'extra-large', label: 'Extra Large', description: 'Maximum text size' }
  ];

  const contrastOptions = [
    { value: 'normal', label: 'Normal', description: 'Standard contrast levels' },
    { value: 'high', label: 'High', description: 'Enhanced contrast for better visibility' },
    { value: 'maximum', label: 'Maximum', description: 'Highest contrast for accessibility' }
  ];

  return (
    <SettingsSection
      title="Accessibility"
      description="Customize the app for different accessibility needs"
      icon="Eye"
    >
      <div className="space-y-1">
        <SettingSelect
          label="Text Size"
          description="Adjust text size throughout the application"
          options={textSizeOptions}
          value={settings.textSize}
          onChange={(value) => onSettingChange('textSize', value)}
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Contrast Level"
            description="Enhance visual contrast for better readability"
            options={contrastOptions}
            value={settings.contrastLevel}
            onChange={(value) => onSettingChange('contrastLevel', value)}
          />
        </div>
        
        <SettingToggle
          label="Simplified Interface"
          description="Use a cleaner, less cluttered interface design"
          checked={settings.simplifiedInterface}
          onChange={(e) => onSettingChange('simplifiedInterface', e.target.checked)}
        />
        
        <SettingToggle
          label="Reduce Motion"
          description="Minimize animations and transitions for motion sensitivity"
          checked={settings.reduceMotion}
          onChange={(e) => onSettingChange('reduceMotion', e.target.checked)}
        />
        
        <SettingToggle
          label="Screen Reader Support"
          description="Optimize interface for screen reader compatibility"
          checked={settings.screenReaderSupport}
          onChange={(e) => onSettingChange('screenReaderSupport', e.target.checked)}
        />
        
        <SettingToggle
          label="Large Touch Targets"
          description="Increase button and control sizes for easier interaction"
          checked={settings.largeTouchTargets}
          onChange={(e) => onSettingChange('largeTouchTargets', e.target.checked)}
        />
        
        <SettingToggle
          label="Audio Descriptions"
          description="Provide detailed audio descriptions of visual elements"
          checked={settings.audioDescriptions}
          onChange={(e) => onSettingChange('audioDescriptions', e.target.checked)}
        />
      </div>
    </SettingsSection>
  );
};

export default AccessibilitySettings;