import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';

const SettingToggle = ({ 
  label, 
  description, 
  checked, 
  onChange, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`flex items-start justify-between py-3 ${className}`}>
      <div className="flex-1 min-w-0 mr-4">
        <label className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          size="default"
        />
      </div>
    </div>
  );
};

export default SettingToggle;