import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import Button from '../../../components/ui/Button';

const PrivacyControlsSettings = ({ settings, onSettingChange, onClearLocationHistory, onResetPermissions }) => {
  return (
    <SettingsSection
      title="Privacy Controls"
      description="Manage your data and privacy preferences"
      icon="Shield"
    >
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Data Processing</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All location data is processed locally on your device. No personal information is transmitted to external servers. Your navigation history is stored only on your device for improving route suggestions.
          </p>
        </div>
        
        <div className="space-y-1">
          <SettingToggle
            label="Save Location History"
            description="Store visited locations to provide better route suggestions"
            checked={settings.saveLocationHistory}
            onChange={(e) => onSettingChange('saveLocationHistory', e.target.checked)}
          />
          
          <SettingToggle
            label="Anonymous Usage Analytics"
            description="Help improve the app by sharing anonymous usage patterns"
            checked={settings.anonymousAnalytics}
            onChange={(e) => onSettingChange('anonymousAnalytics', e.target.checked)}
          />
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Data Management</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={onClearLocationHistory}
              iconName="Trash2"
              iconPosition="left"
              className="w-full justify-start"
            >
              Clear Location History
            </Button>
            
            <Button
              variant="outline"
              onClick={onResetPermissions}
              iconName="RotateCcw"
              iconPosition="left"
              className="w-full justify-start"
            >
              Reset Location Permissions
            </Button>
          </div>
        </div>
        
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Privacy Notice</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Location permissions are required for navigation functionality. You can revoke these permissions at any time through your device settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default PrivacyControlsSettings;