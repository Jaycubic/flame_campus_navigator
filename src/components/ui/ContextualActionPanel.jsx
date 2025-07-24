import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualActionPanel = ({ 
  mode = 'browsing', // 'browsing' | 'navigating'
  onSearchClick,
  onCancelNavigation,
  onVoiceToggle,
  isVoiceEnabled = false,
  currentDestination = null
}) => {
  const handleSearchClick = () => {
    if (onSearchClick) onSearchClick();
  };

  const handleCancelNavigation = () => {
    if (onCancelNavigation) onCancelNavigation();
  };

  const handleVoiceToggle = () => {
    if (onVoiceToggle) onVoiceToggle();
  };

  if (mode === 'browsing') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-panel safe-area-bottom">
        <div className="mx-4 mb-4">
          <div className="bg-card rounded-lg shadow-elevation-3 border border-border overflow-hidden">
            <div className="p-4">
              <Button
                variant="default"
                fullWidth
                iconName="Search"
                iconPosition="left"
                onClick={handleSearchClick}
                className="h-12 text-base font-medium"
              >
                Search destinations
              </Button>
            </div>
            
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  iconName="MapPin"
                  iconPosition="left"
                  onClick={() => {}}
                  className="h-10 text-sm"
                >
                  Nearby
                </Button>
                <Button
                  variant="outline"
                  iconName="Clock"
                  iconPosition="left"
                  onClick={() => {}}
                  className="h-10 text-sm"
                >
                  Recent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-panel safe-area-bottom">
      <div className="mx-4 mb-4">
        <div className="bg-card rounded-lg shadow-elevation-3 border border-border overflow-hidden">
          {currentDestination && (
            <div className="px-4 py-3 bg-muted border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent">
                  <Icon name="MapPin" size={16} className="text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentDestination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active navigation
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="destructive"
                iconName="X"
                iconPosition="left"
                onClick={handleCancelNavigation}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              
              <Button
                variant={isVoiceEnabled ? "default" : "outline"}
                size="icon"
                onClick={handleVoiceToggle}
                className="h-12 w-12"
              >
                <Icon 
                  name={isVoiceEnabled ? "Volume2" : "VolumeX"} 
                  size={20} 
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualActionPanel;