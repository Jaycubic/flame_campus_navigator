import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationPermissionCard = ({ 
  onEnableLocation, 
  isLoading = false, 
  permissionStatus = 'prompt' 
}) => {
  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted': return 'CheckCircle';
      case 'denied': return 'XCircle';
      default: return 'MapPin';
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'text-success';
      case 'denied': return 'text-error';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-elevation-3 border border-border p-6 mb-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4">
          <Icon 
            name={getStatusIcon()} 
            size={40} 
            className={`${getStatusColor()} ${isLoading ? 'animate-pulse' : ''}`}
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Location Services
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Enable precise GPS tracking for accurate campus navigation and real-time positioning
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 mt-0.5">
            <Icon name="Navigation" size={14} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Real-time Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Live position updates as you move across campus
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 mt-0.5">
            <Icon name="Volume2" size={14} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Voice Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Audio announcements when you reach destinations
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 mt-0.5">
            <Icon name="Shield" size={14} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Privacy Protected</h3>
            <p className="text-sm text-muted-foreground">
              Location data processed locally on your device
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        fullWidth
        iconName={permissionStatus === 'granted' ? 'CheckCircle' : 'MapPin'}
        iconPosition="left"
        onClick={onEnableLocation}
        loading={isLoading}
        disabled={permissionStatus === 'granted'}
        className="h-14 text-lg font-semibold"
      >
        {permissionStatus === 'granted' ?'Location Enabled' :'Enable Location Services'
        }
      </Button>

      {permissionStatus === 'denied' && (
        <div className="mt-4 p-4 bg-error/10 rounded-lg border border-error/20">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
            <div>
              <h4 className="font-medium text-error mb-1">Permission Denied</h4>
              <p className="text-sm text-error/80">
                Please enable location access in your browser settings to use navigation features
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPermissionCard;