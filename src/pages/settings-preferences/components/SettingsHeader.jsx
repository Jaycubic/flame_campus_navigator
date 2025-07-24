import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SettingsHeader = ({ onResetToDefaults }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/campus-navigation-map');
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Settings & Preferences
            </h1>
            <p className="text-xs text-muted-foreground">
              Customize your navigation experience
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetToDefaults}
          iconName="RotateCcw"
          iconPosition="left"
          className="text-xs"
        >
          Reset
        </Button>
      </div>
    </header>
  );
};

export default SettingsHeader;