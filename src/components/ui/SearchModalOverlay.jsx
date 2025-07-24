import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const SearchModalOverlay = ({ 
  isVisible = false, 
  onClose, 
  onDestinationSelect,
  searchQuery = '',
  onSearchChange
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'Search' },
    { id: 'academic', label: 'Academic', icon: 'GraduationCap' },
    { id: 'dining', label: 'Dining', icon: 'Coffee' },
    { id: 'dormitory', label: 'Housing', icon: 'Home' },
    { id: 'facilities', label: 'Facilities', icon: 'Building' },
  ];

  const mockResults = [
    { id: 1, name: 'Main Library', category: 'academic', building: 'Academic Block A', distance: '0.2 km' },
    { id: 2, name: 'Student Cafeteria', category: 'dining', building: 'Student Center', distance: '0.3 km' },
    { id: 3, name: 'Computer Science Department', category: 'academic', building: 'Tech Block', distance: '0.4 km' },
    { id: 4, name: 'Hostel Block 1', category: 'dormitory', building: 'Residential Area', distance: '0.5 km' },
    { id: 5, name: 'Sports Complex', category: 'facilities', building: 'Recreation Center', distance: '0.6 km' },
    { id: 6, name: 'Medical Center', category: 'facilities', building: 'Health Services', distance: '0.3 km' },
  ];

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(localQuery);
    }
    
    // Filter results based on query and category
    let filtered = mockResults;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(result => result.category === selectedCategory);
    }
    
    if (localQuery.trim()) {
      filtered = filtered.filter(result => 
        result.name.toLowerCase().includes(localQuery.toLowerCase()) ||
        result.building.toLowerCase().includes(localQuery.toLowerCase())
      );
    }
    
    setSearchResults(filtered);
  }, [localQuery, selectedCategory, onSearchChange]);

  const handleDestinationSelect = (destination) => {
    if (onDestinationSelect) {
      onDestinationSelect(destination);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={handleClose} />
      
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-lg shadow-elevation-4 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Find Destination
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <Input
            type="search"
            placeholder="Search buildings, departments, facilities..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-border">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                iconName={category.icon}
                iconPosition="left"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-4 space-y-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleDestinationSelect(result)}
                  className="w-full p-4 text-left bg-muted/50 hover:bg-muted rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {result.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.building}
                      </p>
                    </div>
                    <div className="ml-3 flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {result.distance}
                      </span>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModalOverlay;