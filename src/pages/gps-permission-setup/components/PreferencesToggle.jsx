import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesToggle = ({ 
  voiceEnabled, 
  onVoiceToggle, 
  autoNavigationEnabled, 
  onAutoNavigationToggle 
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
          <Icon name="Settings" size={20} className="text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Navigation Preferences
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10">
            <Icon name="Volume2" size={20} className="text-success" />
          </div>
          <div className="flex-1">
            <Checkbox
              label="Voice Guidance"
              description="Hear audio announcements when you arrive at destinations"
              checked={voiceEnabled}
              onChange={(e) => onVoiceToggle(e.target.checked)}
              className="mb-2"
            />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={14} />
              <span>Uses your device's text-to-speech feature</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border"></div>

        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Icon name="Navigation" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <Checkbox
              label="Auto-Navigation Mode"
              description="Automatically start navigation when you select a destination"
              checked={autoNavigationEnabled}
              onChange={(e) => onAutoNavigationToggle(e.target.checked)}
              className="mb-2"
            />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Zap" size={14} />
              <span>Skip confirmation dialogs for faster navigation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesToggle;