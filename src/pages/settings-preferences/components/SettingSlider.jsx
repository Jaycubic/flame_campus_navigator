import React from 'react';

const SettingSlider = ({ 
  label, 
  description, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = '',
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`py-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-sm font-medium text-primary">
          {value}{unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          {description}
        </p>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default SettingSlider;