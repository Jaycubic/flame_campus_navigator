import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentDestinations = ({ recentLocations, onDestinationSelect }) => {
  if (!recentLocations || recentLocations.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Destinations
        </h2>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
      
      <div className="space-y-3">
        {recentLocations.map((location) => (
          <div
            key={location.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => onDestinationSelect(location)}
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
              <div className="flex items-center mt-1 space-x-1">
                <Icon name="Clock" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last visited {location.lastVisited}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {location.distance}
              </span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDestinations;