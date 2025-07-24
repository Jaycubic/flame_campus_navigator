import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import CategorySection from './components/CategorySection';
import RecentDestinations from './components/RecentDestinations';
import QuickActions from './components/QuickActions';

const DestinationSearchSelection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);

  // Mock data for campus locations
  const mockLocations = [
    {
      id: 1,
      name: "Main Library",
      building: "Academic Block A",
      category: "academic",
      distance: "0.2 km",
      walkingTime: "3 min",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5271557, lng: 73.7276252 }
    },
    {
      id: 2,
      name: "Student Cafeteria",
      building: "Student Center",
      category: "dining",
      distance: "0.3 km",
      walkingTime: "4 min",
      image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5265000, lng: 73.7280000 }
    },
    {
      id: 3,
      name: "Computer Science Department",
      building: "Tech Block",
      category: "academic",
      distance: "0.4 km",
      walkingTime: "5 min",
      image: "https://images.pixabay.com/photo/2016/11/19/14/00/code-1839406_960_720.jpg?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5260000, lng: 73.7285000 }
    },
    {
      id: 4,
      name: "Hostel Block 1",
      building: "Residential Area",
      category: "dormitory",
      distance: "0.5 km",
      walkingTime: "7 min",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5255000, lng: 73.7290000 }
    },
    {
      id: 5,
      name: "Sports Complex",
      building: "Recreation Center",
      category: "recreation",
      distance: "0.6 km",
      walkingTime: "8 min",
      image: "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5250000, lng: 73.7295000 }
    },
    {
      id: 6,
      name: "Administrative Office",
      building: "Admin Block",
      category: "administrative",
      distance: "0.3 km",
      walkingTime: "4 min",
      image: "https://images.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_960_720.jpg?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5268000, lng: 73.7278000 }
    },
    {
      id: 7,
      name: "Medical Center",
      building: "Health Services",
      category: "administrative",
      distance: "0.4 km",
      walkingTime: "5 min",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5262000, lng: 73.7282000 }
    },
    {
      id: 8,
      name: "Engineering Lab",
      building: "Tech Block",
      category: "academic",
      distance: "0.5 km",
      walkingTime: "6 min",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?w=400&h=300&fit=crop",
      coordinates: { lat: 18.5258000, lng: 73.7287000 }
    }
  ];

  const categories = [
    {
      id: 'academic',
      name: 'Academic Buildings',
      type: 'academic'
    },
    {
      id: 'dormitory',
      name: 'Dormitories',
      type: 'dormitory'
    },
    {
      id: 'dining',
      name: 'Dining Facilities',
      type: 'dining'
    },
    {
      id: 'recreation',
      name: 'Recreation Centers',
      type: 'recreation'
    },
    {
      id: 'administrative',
      name: 'Administrative Offices',
      type: 'administrative'
    }
  ];

  // Load recent destinations from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentDestinations');
    if (recent) {
      const recentData = JSON.parse(recent);
      const recentWithDetails = recentData.map(recentItem => {
        const location = mockLocations.find(loc => loc.id === recentItem.id);
        return location ? { ...location, lastVisited: recentItem.lastVisited } : null;
      }).filter(Boolean);
      setRecentLocations(recentWithDetails.slice(0, 3));
    }
  }, []);

  // Filter search results
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleBackClick = () => {
    navigate('/campus-navigation-map');
  };

  const handleDestinationSelect = (location) => {
    // Save to recent destinations
    const recent = JSON.parse(localStorage.getItem('recentDestinations') || '[]');
    const updatedRecent = [
      { id: location.id, lastVisited: 'just now' },
      ...recent.filter(item => item.id !== location.id)
    ].slice(0, 5);
    localStorage.setItem('recentDestinations', JSON.stringify(updatedRecent));

    // Save selected destination
    localStorage.setItem('selectedDestination', JSON.stringify(location));
    
    // Navigate to map with navigation active
    navigate('/navigation-active-state');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleQuickAction = (action) => {
    const actionMap = {
      restroom: mockLocations.find(loc => loc.name.includes('Medical')),
      parking: mockLocations.find(loc => loc.category === 'administrative'),
      emergency: mockLocations.find(loc => loc.name.includes('Administrative')),
      cafeteria: mockLocations.find(loc => loc.category === 'dining')
    };

    const destination = actionMap[action];
    if (destination) {
      handleDestinationSelect(destination);
    }
  };

  const getLocationsByCategory = (categoryType) => {
    return mockLocations.filter(location => location.category === categoryType);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBackClick={handleBackClick}
        onClearSearch={handleClearSearch}
      />

      <div className="pb-safe-area-bottom">
        {searchQuery.trim() ? (
          <SearchResults
            results={searchResults}
            onDestinationSelect={handleDestinationSelect}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="space-y-6">
            <RecentDestinations
              recentLocations={recentLocations}
              onDestinationSelect={handleDestinationSelect}
            />

            <QuickActions onActionClick={handleQuickAction} />

            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Browse by Category
              </h2>
              {categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  locations={getLocationsByCategory(category.type)}
                  onDestinationSelect={handleDestinationSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationSearchSelection;