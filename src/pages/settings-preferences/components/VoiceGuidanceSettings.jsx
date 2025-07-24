import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import SettingSelect from './SettingSelect';
import SettingSlider from './SettingSlider';

const VoiceGuidanceSettings = ({ settings, onSettingChange }) => {
  const voiceOptions = [
    { value: 'female1', label: 'Sarah (Female)', description: 'Clear and friendly voice' },
    { value: 'female2', label: 'Emma (Female)', description: 'Professional and calm voice' },
    { value: 'male1', label: 'David (Male)', description: 'Deep and clear voice' }
  ];

  const frequencyOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Only arrival announcements' },
    { value: 'standard', label: 'Standard', description: 'Key navigation points' },
    { value: 'detailed', label: 'Detailed', description: 'Frequent updates and directions' }
  ];

  return (
    <SettingsSection
      title="Voice Guidance"
      description="Customize voice announcements and audio feedback"
      icon="Volume2"
    >
      <div className="space-y-1">
        <SettingToggle
          label="Enable Voice Guidance"
          description="Hear spoken directions and arrival notifications"
          checked={settings.voiceEnabled}
          onChange={(e) => onSettingChange('voiceEnabled', e.target.checked)}
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Voice Selection"
            description="Choose your preferred voice for announcements"
            options={voiceOptions}
            value={settings.voiceType}
            onChange={(value) => onSettingChange('voiceType', value)}
            disabled={!settings.voiceEnabled}
          />
        </div>
        
        <SettingSlider
          label="Voice Volume"
          description="Adjust the volume level for voice announcements"
          value={settings.voiceVolume}
          onChange={(value) => onSettingChange('voiceVolume', value)}
          min={0}
          max={100}
          step={5}
          unit="%"
          disabled={!settings.voiceEnabled}
        />
        
        <div className="border-t border-border pt-3">
          <SettingSelect
            label="Announcement Frequency"
            description="How often you want to receive voice updates"
            options={frequencyOptions}
            value={settings.announcementFrequency}
            onChange={(value) => onSettingChange('announcementFrequency', value)}
            disabled={!settings.voiceEnabled}
          />
        </div>
        
        <SettingToggle
          label="Arrival Notifications"
          description="Play sound when you reach your destination"
          checked={settings.arrivalNotifications}
          onChange={(e) => onSettingChange('arrivalNotifications', e.target.checked)}
          disabled={!settings.voiceEnabled}
        />
      </div>
    </SettingsSection>
  );
};

export default VoiceGuidanceSettings;