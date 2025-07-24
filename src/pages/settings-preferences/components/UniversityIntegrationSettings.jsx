import React from 'react';
import SettingsSection from './SettingsSection';
import SettingToggle from './SettingToggle';
import Button from '../../../components/ui/Button';

const UniversityIntegrationSettings = ({ settings, onSettingChange, onCheckMapUpdates, onContactSupport }) => {
  return (
    <SettingsSection
      title="University Integration"
      description="FLAME University specific settings and preferences"
      icon="GraduationCap"
    >
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
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
              <h4 className="text-sm font-semibold text-foreground">FLAME University</h4>
              <p className="text-xs text-muted-foreground">Campus Navigator v2.1.0</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Official campus navigation app for FLAME University students, faculty, and visitors.
          </p>
        </div>
        
        <div className="space-y-1">
          <SettingToggle
            label="FLAME Branding"
            description="Display university branding and colors throughout the app"
            checked={settings.flameBranding}
            onChange={(e) => onSettingChange('flameBranding', e.target.checked)}
          />
          
          <SettingToggle
            label="Campus Event Notifications"
            description="Receive notifications about campus events and important announcements"
            checked={settings.campusNotifications}
            onChange={(e) => onSettingChange('campusNotifications', e.target.checked)}
          />
          
          <SettingToggle
            label="Academic Calendar Integration"
            description="Show class schedules and academic events on the map"
            checked={settings.academicCalendar}
            onChange={(e) => onSettingChange('academicCalendar', e.target.checked)}
          />
          
          <SettingToggle
            label="Emergency Alerts"
            description="Receive critical campus safety and emergency notifications"
            checked={settings.emergencyAlerts}
            onChange={(e) => onSettingChange('emergencyAlerts', e.target.checked)}
          />
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Campus Services</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={onCheckMapUpdates}
              iconName="Download"
              iconPosition="left"
              className="w-full justify-start"
            >
              Check for Map Updates
            </Button>
            
            <Button
              variant="outline"
              onClick={onContactSupport}
              iconName="MessageCircle"
              iconPosition="left"
              className="w-full justify-start"
            >
              Contact IT Support
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Campus Information</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Last Map Update:</span>
              <span>July 20, 2025</span>
            </div>
            <div className="flex justify-between">
              <span>Total Buildings:</span>
              <span>42 mapped</span>
            </div>
            <div className="flex justify-between">
              <span>Coverage Area:</span>
              <span>156 hectares</span>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default UniversityIntegrationSettings;