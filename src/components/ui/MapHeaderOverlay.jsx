import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const MapHeaderOverlay = ({ isNavigating = false, onSettingsClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    let timeoutId;
    if (isNavigating) {
      timeoutId = setTimeout(() => setIsVisible(false), 3000);
    } else {
      setIsVisible(true);
    }
    return () => clearTimeout(timeoutId);
  }, [isNavigating]);

  if (!isVisible && isNavigating) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-header safe-area-top transition-opacity duration-300 ${
        isNavigating ? 'opacity-75 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="backdrop-blur-light bg-white/80 border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 text-primary-foreground"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground leading-tight">
                FLAME Campus
              </h1>
              <span className="text-xs text-muted-foreground leading-tight">
                Navigator
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MapHeaderOverlay;