import React from 'react';
import Icon from '../AppIcon';

const NavigationStatusIndicator = ({ 
  isVisible = false,
  distance = '0.0 km',
  estimatedTime = '0 min',
  nextInstruction = '',
  gpsAccuracy = 'high', // 'high' | 'medium' | 'low'
  isVoiceEnabled = false
}) => {
  if (!isVisible) return null;

  const getGpsIcon = () => {
    switch (gpsAccuracy) {
      case 'high': return 'Navigation';
      case 'medium': return 'MapPin';
      case 'low': return 'AlertTriangle';
      default: return 'Navigation';
    }
  };

  const getGpsColor = () => {
    switch (gpsAccuracy) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-success';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-status animate-fade-in">
      <div className="bg-card rounded-lg shadow-elevation-3 border border-border overflow-hidden min-w-[200px] max-w-[280px]">
        {/* Status Header */}
        <div className="px-4 py-3 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getGpsIcon()} 
                size={16} 
                className={`animate-pulse-gps ${gpsAccuracy === 'high' ? 'text-primary-foreground' : 'text-warning'}`}
              />
              <span className="text-sm font-medium">Navigating</span>
            </div>
            {isVoiceEnabled && (
              <Icon name="Volume2" size={14} className="text-primary-foreground/80" />
            )}
          </div>
        </div>

        {/* Distance & Time */}
        <div className="px-4 py-3 border-b border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground font-mono">
                {distance}
              </p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground font-mono">
                {estimatedTime}
              </p>
              <p className="text-xs text-muted-foreground">ETA</p>
            </div>
          </div>
        </div>

        {/* Next Instruction */}
        {nextInstruction && (
          <div className="px-4 py-3">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent mt-0.5">
                <Icon name="ArrowRight" size={12} className="text-accent-foreground" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {nextInstruction}
              </p>
            </div>
          </div>
        )}

        {/* GPS Accuracy Indicator */}
        <div className="px-4 py-2 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name="Satellite" 
                size={12} 
                className={getGpsColor()}
              />
              <span className="text-xs text-muted-foreground">
                GPS: {gpsAccuracy}
              </span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 h-3 rounded-full ${
                    (gpsAccuracy === 'high' && bar <= 4) ||
                    (gpsAccuracy === 'medium' && bar <= 2) ||
                    (gpsAccuracy === 'low' && bar <= 1)
                      ? 'bg-success' :'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationStatusIndicator;