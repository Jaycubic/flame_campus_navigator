import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = ({ message = "Initializing GPS...", progress = 0 }) => {
  const loadingSteps = [
    { id: 1, label: 'Requesting permission', icon: 'Shield' },
    { id: 2, label: 'Connecting to GPS', icon: 'Satellite' },
    { id: 3, label: 'Calibrating position', icon: 'Navigation' },
    { id: 4, label: 'Loading campus map', icon: 'Map' }
  ];

  const currentStep = Math.min(Math.floor((progress / 100) * loadingSteps.length) + 1, loadingSteps.length);

  return (
    <div className="bg-card rounded-2xl shadow-elevation-3 border border-border p-8 text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{ 
              transform: 'rotate(0deg)',
              animation: 'spin 2s linear infinite'
            }}
          ></div>
          <Icon name="MapPin" size={32} className="text-primary animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Setting Up Navigation
        </h2>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground">
          {progress}% complete
        </p>
      </div>

      <div className="space-y-4">
        {loadingSteps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
              index + 1 < currentStep 
                ? 'bg-success/10 border border-success/20' 
                : index + 1 === currentStep 
                ? 'bg-primary/10 border border-primary/20' :'bg-muted/30 border border-border'
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 < currentStep 
                ? 'bg-success text-success-foreground' 
                : index + 1 === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1 < currentStep ? (
                <Icon name="Check" size={16} />
              ) : index + 1 === currentStep ? (
                <Icon name={step.icon} size={16} className="animate-pulse" />
              ) : (
                <Icon name={step.icon} size={16} />
              )}
            </div>
            <span className={`font-medium ${
              index + 1 < currentStep 
                ? 'text-success' 
                : index + 1 === currentStep 
                ? 'text-primary' :'text-muted-foreground'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;