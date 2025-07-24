import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsSection = ({ title, description, icon, children, className = '' }) => {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Icon name={icon} size={20} className="text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;