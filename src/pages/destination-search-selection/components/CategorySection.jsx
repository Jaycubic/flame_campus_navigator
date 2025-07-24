import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CategorySection = ({ category, locations, onDestinationSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (categoryType) => {
    const iconMap = {
      academic: 'GraduationCap',
      dormitory: 'Home',
      dining: 'Coffee',
      recreation: 'Dumbbell',
      administrative: 'Building'
    };
    return iconMap[categoryType] || 'MapPin';
  };

  const getCategoryColor = (categoryType) => {
    const colorMap = {
      academic: 'text-blue-600',
      dormitory: 'text-green-600',
      dining: 'text-orange-600',
      recreation: 'text-purple-600',
      administrative: 'text-gray-600'
    };
    return colorMap[categoryType] || 'text-blue-600';
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white ${getCategoryColor(category.type)}`}>
            <Icon name={getCategoryIcon(category.type)} size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {locations.length} locations
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground"
        />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-card">
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {location.name}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {location.building}
                </p>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="text-xs text-muted-foreground">
                    {location.distance}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {location.walkingTime}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDestinationSelect(location)}
                className="flex-shrink-0"
              >
                Go
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;