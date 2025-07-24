import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onBackClick, 
  onClearSearch 
}) => {
  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="flex items-center p-4 space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="flex-shrink-0"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search buildings, rooms, facilities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;