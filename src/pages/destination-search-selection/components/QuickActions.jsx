import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'nearest-restroom',
      label: 'Nearest Restroom',
      icon: 'MapPin',
      color: 'bg-blue-100 text-blue-600',
      action: 'restroom'
    },
    {
      id: 'parking',
      label: 'Parking Areas',
      icon: 'Car',
      color: 'bg-green-100 text-green-600',
      action: 'parking'
    },
    {
      id: 'emergency',
      label: 'Emergency Exit',
      icon: 'AlertTriangle',
      color: 'bg-red-100 text-red-600',
      action: 'emergency'
    },
    {
      id: 'cafeteria',
      label: 'Food Courts',
      icon: 'Coffee',
      color: 'bg-orange-100 text-orange-600',
      action: 'cafeteria'
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            onClick={() => onActionClick(action.action)}
            className="h-20 flex-col space-y-2 border-2 hover:border-primary/50"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <Icon name={action.icon} size={20} />
            </div>
            <span className="text-sm font-medium text-center">
              {action.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;