import React from 'react';
import Icon from '../../../components/AppIcon';

const SetupInstructions = () => {
  const instructions = [
    {
      id: 1,
      icon: 'Smartphone',
      title: 'Allow Location Access',
      description: 'Click "Allow" when your browser requests location permission',
      tip: 'This enables real-time position tracking on campus'
    },
    {
      id: 2,
      icon: 'Satellite',
      title: 'Optimize GPS Signal',
      description: 'Move to an open area for better satellite reception',
      tip: 'Avoid indoor areas or locations with tall buildings nearby'
    },
    {
      id: 3,
      icon: 'Map',
      title: 'Calibrate Position',
      description: 'Walk a few steps to improve location accuracy',
      tip: 'The blue dot will show your precise campus location'
    }
  ];

  return (
    <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
          <Icon name="BookOpen" size={20} className="text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Quick Setup Guide
        </h3>
      </div>

      <div className="space-y-6">
        {instructions.map((instruction, index) => (
          <div key={instruction.id} className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={instruction.icon} size={18} className="text-accent" />
                <h4 className="font-semibold text-foreground">
                  {instruction.title}
                </h4>
              </div>
              <p className="text-muted-foreground mb-2 leading-relaxed">
                {instruction.description}
              </p>
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
                <p className="text-sm text-warning font-medium">
                  {instruction.tip}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupInstructions;