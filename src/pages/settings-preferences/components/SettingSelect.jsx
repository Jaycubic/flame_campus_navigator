import React from 'react';
import Select from '../../../components/ui/Select';

const SettingSelect = ({ 
  label, 
  description, 
  options, 
  value, 
  onChange, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`py-3 ${className}`}>
      <Select
        label={label}
        description={description}
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default SettingSelect;