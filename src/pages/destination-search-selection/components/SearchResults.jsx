import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SearchResults = ({ results, onDestinationSelect, searchQuery }) => {
  if (!searchQuery.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center">
        <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No results found
        </h3>
        <p className="text-muted-foreground">
          Try searching for buildings, rooms, or facilities
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Search Results ({results.length})
      </h2>
      <div className="space-y-3">
        {results.map((location) => (
          <div
            key={location.id}
            className="bg-muted/50 rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex">
              <div className="w-20 h-20 flex-shrink-0">
                <Image
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {location.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {location.building}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} className="text-accent" />
                        <span className="text-xs text-muted-foreground">
                          {location.distance}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} className="text-accent" />
                        <span className="text-xs text-muted-foreground">
                          {location.walkingTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onDestinationSelect(location)}
                    className="ml-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;