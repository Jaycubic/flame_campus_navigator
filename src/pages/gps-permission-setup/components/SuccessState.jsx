import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessState = ({ 
  isVisible = false, 
  locationData = null, 
  onContinue 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (onContinue) {
          onContinue();
        } else {
          navigate('/campus-navigation-map');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onContinue, navigate]);

  if (!isVisible) return null;

  return (
    <div className="bg-card rounded-2xl shadow-elevation-3 border border-border p-8 text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mx-auto mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-success/20 animate-ping rounded-full"></div>
          <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-success">
            <Icon name="CheckCircle" size={32} className="text-success-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Location Enabled!
        </h2>
        <p className="text-muted-foreground mb-6">
          GPS setup complete. You're ready to navigate FLAME Campus with precision.
        </p>
      </div>

      {locationData && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Latitude</p>
              <p className="font-mono text-foreground">
                {locationData.latitude?.toFixed(6) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Longitude</p>
              <p className="font-mono text-foreground">
                {locationData.longitude?.toFixed(6) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Accuracy</p>
              <p className="font-mono text-foreground">
                ±{Math.round(locationData.accuracy || 0)}m
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Navigation" size={16} className="text-success" />
            <span>Real-time tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Volume2" size={16} className="text-success" />
            <span>Voice guidance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span>Privacy protected</span>
          </div>
        </div>

        <Button
          variant="default"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => {
            if (onContinue) {
              onContinue();
            } else {
              navigate('/campus-navigation-map');
            }
          }}
          className="h-14 text-lg font-semibold"
        >
          Start Navigating Campus
        </Button>

        <p className="text-xs text-muted-foreground">
          Redirecting automatically in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default SuccessState;