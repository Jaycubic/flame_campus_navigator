import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TroubleshootingHelp = ({ isVisible = false, onToggle }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const troubleshootingItems = [
    {
      id: 1,
      icon: 'AlertCircle',
      title: 'Location Permission Denied',
      problem: 'Browser blocked location access',
      solutions: [
        'Click the location icon in your browser\'s address bar',
        'Select "Allow" for location permissions',
        'Refresh the page and try again',
        'Check if location services are enabled on your device'
      ]
    },
    {
      id: 2,
      icon: 'Wifi',
      title: 'Weak GPS Signal',
      problem: 'Unable to get accurate location',
      solutions: [
        'Move to an outdoor area with clear sky view',
        'Avoid areas near tall buildings or dense trees',
        'Wait a few moments for GPS to stabilize',
        'Ensure your device has good internet connectivity'
      ]
    },
    {
      id: 3,
      icon: 'Battery',
      title: 'Location Services Disabled',
      problem: 'Device location settings are turned off',
      solutions: [
        'Go to your device Settings > Privacy > Location Services',
        'Enable Location Services for your browser',
        'Allow precise location access',
        'Restart your browser after making changes'
      ]
    }
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  if (!isVisible) {
    return (
      <div className="text-center">
        <Button
          variant="ghost"
          iconName="HelpCircle"
          iconPosition="left"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          Need help with setup?
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
            <Icon name="HelpCircle" size={20} className="text-warning" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Troubleshooting
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="space-y-4">
        {troubleshootingItems.map((item) => (
          <div key={item.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExpanded(item.id)}
              className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={item.icon} size={18} className="text-error" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.problem}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={expandedItem === item.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground"
                />
              </div>
            </button>

            {expandedItem === item.id && (
              <div className="px-4 pb-4 border-t border-border bg-muted/30">
                <div className="pt-4">
                  <h5 className="font-medium text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span>Solutions:</span>
                  </h5>
                  <ul className="space-y-2">
                    {item.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">
                          {solution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="MessageCircle" size={16} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-1">Still need help?</h4>
            <p className="text-sm text-primary/80">
              Contact FLAME IT Support at support@flame.edu.in or visit the IT Help Desk in the Academic Block
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingHelp;