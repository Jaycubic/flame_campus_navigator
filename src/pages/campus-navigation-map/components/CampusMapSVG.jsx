import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapRouteCalculator from './MapRouteCalculator';
import CampusMap from './CampusMap.svg'; // Import the external SVG file

const CampusMapSVG = ({ 
  userPosition, 
  selectedDestination, 
  onDestinationSelect, 
  isNavigating,
  showRoute 
}) => {
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedMapPoint, setSelectedMapPoint] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const svgRef = useRef(null);
  const routeCalculator = useRef(null);

  // Campus anchor points for GPS to pixel conversion
  const anchorPoints = {
    topLeft: { pixel: { x: 132.75, y: 133.55 }, gps: { lat: 18.5271557, lng: 73.7276252 } },
    bottomRight: { pixel: { x: 2512.5, y: 3776.5 }, gps: { lat: 18.5180856, lng: 73.7339646 } }
  };

  // Initialize route calculator
  useEffect(() => {
    routeCalculator.current = new MapRouteCalculator(anchorPoints);
  }, []);

  // Convert GPS coordinates to SVG pixel position
  const gpsToPixel = useCallback((lat, lng) => {
    const { topLeft, bottomRight } = anchorPoints;
    
    const latRange = topLeft.gps.lat - bottomRight.gps.lat;
    const lngRange = bottomRight.gps.lng - topLeft.gps.lng;
    const pixelXRange = bottomRight.pixel.x - topLeft.pixel.x;
    const pixelYRange = bottomRight.pixel.y - topLeft.pixel.y;
    
    const x = topLeft.pixel.x + ((lng - topLeft.gps.lng) / lngRange) * pixelXRange;
    const y = topLeft.pixel.y + ((topLeft.gps.lat - lat) / latRange) * pixelYRange;
    
    return { x, y };
  }, [anchorPoints]);

  // Convert SVG pixel position to GPS coordinates
  const pixelToGps = useCallback((x, y) => {
    const { topLeft, bottomRight } = anchorPoints;
    
    const latRange = topLeft.gps.lat - bottomRight.gps.lat;
    const lngRange = bottomRight.gps.lng - topLeft.gps.lng;
    const pixelXRange = bottomRight.pixel.x - topLeft.pixel.x;
    const pixelYRange = bottomRight.pixel.y - topLeft.pixel.y;
    
    const lng = topLeft.gps.lng + ((x - topLeft.pixel.x) / pixelXRange) * lngRange;
    const lat = topLeft.gps.lat - ((y - topLeft.pixel.y) / pixelYRange) * latRange;
    
    return { lat, lng };
  }, [anchorPoints]);

  // Enhanced campus locations with more details
  const campusLocations = [
    { 
      id: 1, 
      name: "Main Library", 
      lat: 18.5260, 
      lng: 73.7290, 
      category: "academic",
      description: "Central library with study spaces and computer lab",
      facilities: ["WiFi", "Study Rooms", "Computer Lab"],
      hours: "6:00 AM - 11:00 PM"
    },
    { 
      id: 2, 
      name: "Student Cafeteria", 
      lat: 18.5250, 
      lng: 73.7300, 
      category: "dining",
      description: "Main dining facility with multiple food options",
      facilities: ["Food Court", "Seating Area", "ATM"],
      hours: "7:00 AM - 10:00 PM"
    },
    { 
      id: 3, 
      name: "Computer Science Block", 
      lat: 18.5240, 
      lng: 73.7310, 
      category: "academic",
      description: "Computer Science and IT department building",
      facilities: ["Labs", "Classrooms", "Faculty Offices"],
      hours: "8:00 AM - 8:00 PM"
    },
    { 
      id: 4, 
      name: "Hostel Block A", 
      lat: 18.5230, 
      lng: 73.7320, 
      category: "dormitory",
      description: "Student residential facility for undergraduate students",
      facilities: ["Common Room", "Laundry", "Security"],
      hours: "24/7"
    },
    { 
      id: 5, 
      name: "Sports Complex", 
      lat: 18.5220, 
      lng: 73.7330, 
      category: "facilities",
      description: "Indoor and outdoor sports facilities",
      facilities: ["Gym", "Basketball Court", "Swimming Pool"],
      hours: "6:00 AM - 10:00 PM"
    },
    { 
      id: 6, 
      name: "Administrative Office", 
      lat: 18.5265, 
      lng: 73.7285, 
      category: "academic",
      description: "Main administrative building for student services",
      facilities: ["Admission Office", "Accounts", "Registrar"],
      hours: "9:00 AM - 5:00 PM"
    },
    { 
      id: 7, 
      name: "Medical Center", 
      lat: 18.5245, 
      lng: 73.7295, 
      category: "facilities",
      description: "Campus health center with medical facilities",
      facilities: ["Doctor", "Pharmacy", "Emergency Care"],
      hours: "8:00 AM - 6:00 PM"
    },
    { 
      id: 8, 
      name: "Auditorium", 
      lat: 18.5235, 
      lng: 73.7305, 
      category: "facilities",
      description: "Main auditorium for events and presentations",
      facilities: ["AC", "Audio/Visual", "Seating 500"],
      hours: "Event Based"
    }
  ];

  // Calculate optimized route when destination changes
  useEffect(() => {
    if (userPosition && selectedDestination && showRoute && routeCalculator.current) {
      const route = routeCalculator.current.calculateOptimizedRoute(
        userPosition,
        selectedDestination
      );
      setOptimizedRoute(route);
    } else {
      setOptimizedRoute(null);
    }
  }, [userPosition, selectedDestination, showRoute]);

  // Handle map click for custom destination selection
  const handleMapClick = useCallback((event) => {
    if (isPanning) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const svgViewBox = svgRef.current.viewBox.baseVal;
    
    // Calculate click position relative to SVG
    const scaleX = svgViewBox.width / svgRect.width;
    const scaleY = svgViewBox.height / svgRect.height;
    
    const svgX = (event.clientX - svgRect.left) * scaleX;
    const svgY = (event.clientY - svgRect.top) * scaleY;
    
    // Convert to GPS coordinates
    const gpsCoords = pixelToGps(svgX, svgY);
    
    // Check if within campus bounds
    if (routeCalculator.current?.isWithinCampusBounds(gpsCoords)) {
      const customDestination = {
        id: 'custom',
        name: 'Selected Location',
        lat: gpsCoords.lat,
        lng: gpsCoords.lng,
        category: 'custom',
        description: 'Custom selected destination on campus',
        isCustom: true
      };
      
      setSelectedMapPoint(customDestination);
      if (onDestinationSelect) {
        onDestinationSelect(customDestination);
      }
    }
  }, [isPanning, pixelToGps, onDestinationSelect, routeCalculator]);

  // Handle context menu
  const handleRightClick = useCallback((event) => {
    event.preventDefault();
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const svgViewBox = svgRef.current.viewBox.baseVal;
    
    const scaleX = svgViewBox.width / svgRect.width;
    const scaleY = svgViewBox.height / svgRect.height;
    
    const svgX = (event.clientX - svgRect.left) * scaleX;
    const svgY = (event.clientY - svgRect.top) * scaleY;
    
    const gpsCoords = pixelToGps(svgX, svgY);
    
    if (routeCalculator.current?.isWithinCampusBounds(gpsCoords)) {
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
      setSelectedMapPoint({
        id: 'context',
        name: 'Map Location',
        lat: gpsCoords.lat,
        lng: gpsCoords.lng,
        category: 'custom'
      });
      setShowContextMenu(true);
    }
  }, [pixelToGps, routeCalculator]);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setShowContextMenu(false);
    setSelectedMapPoint(null);
  }, []);

  // Handle context menu actions
  const handleContextMenuAction = useCallback((action) => {
    if (action === 'navigate' && selectedMapPoint) {
      const customDestination = {
        ...selectedMapPoint,
        id: 'custom-' + Date.now(),
        name: 'Selected Location',
        description: 'Custom selected destination',
        isCustom: true
      };
      
      if (onDestinationSelect) {
        onDestinationSelect(customDestination);
      }
    }
    closeContextMenu();
  }, [selectedMapPoint, onDestinationSelect, closeContextMenu]);

  // Handle map interactions
  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) return; // Ignore right clicks for panning
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    setMapOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setMapScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  }, []);

  const handleLocationClick = useCallback((location) => {
    if (onDestinationSelect) {
      onDestinationSelect(location);
    }
  }, [onDestinationSelect]);

  const handleLocationHover = useCallback((location) => {
    setHoveredLocation(location);
  }, []);

  const handleLocationLeave = useCallback(() => {
    setHoveredLocation(null);
  }, []);

  // Generate enhanced route path with waypoints
  const generateEnhancedRoutePath = useCallback(() => {
    if (!userPosition || !selectedDestination || !showRoute || !optimizedRoute?.waypoints) {
      return '';
    }
    
    const points = [userPosition, ...optimizedRoute.waypoints, selectedDestination];
    const pathCommands = points.map((point, index) => {
      const pixel = gpsToPixel(point.lat, point.lng);
      return index === 0 ? `M ${pixel.x} ${pixel.y}` : `L ${pixel.x} ${pixel.y}`;
    });
    
    return pathCommands.join(' ');
  }, [userPosition, selectedDestination, showRoute, optimizedRoute, gpsToPixel]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('click', closeContextMenu);
    
    return () => {
      svg.removeEventListener('wheel', handleWheel);
      document.removeEventListener('click', closeContextMenu);
    };
  }, [handleWheel, closeContextMenu]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      <svg
        ref={svgRef}
        viewBox="0 0 2800 4000"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `scale(${mapScale}) translate(${mapOffset.x}px, ${mapOffset.y}px)`
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleMapClick}
        onContextMenu={handleRightClick}
      >
        <CampusMap /> {/* Render the external SVG content here */}
      </svg>

      {/* Location Details Tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            className="absolute z-40 pointer-events-none"
            style={{
              left: `${(gpsToPixel(hoveredLocation.lat, hoveredLocation.lng).x / 2800) * 100}%`,
              top: `${(gpsToPixel(hoveredLocation.lat, hoveredLocation.lng).y / 4000) * 100 - 8}%`,
              transform: 'translate(-50%, -100%)'
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-xs">
              <h4 className="font-semibold text-gray-900 text-sm">{hoveredLocation.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{hoveredLocation.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {hoveredLocation.category}
                </span>
                <span className="text-xs text-gray-500">{hoveredLocation.hours}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px]"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => handleContextMenuAction('navigate')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
            >
              <span>🧭</span>
              <span>Navigate Here</span>
            </button>
            <button
              onClick={() => handleContextMenuAction('info')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
            >
              <span>ℹ️</span>
              <span>Location Info</span>
            </button>
            <button
              onClick={closeContextMenu}
              className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Controls */}
      <div className="absolute bottom-20 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setMapScale(prev => Math.min(3, prev * 1.2))}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors font-bold text-lg"
        >
          +
        </button>
        <button
          onClick={() => setMapScale(prev => Math.max(0.5, prev * 0.8))}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors font-bold text-lg"
        >
          −
        </button>
        <button
          onClick={() => {
            setMapScale(1);
            setMapOffset({ x: 0, y: 0 });
          }}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors text-xs"
        >
          ⌂
        </button>
      </div>
    </div>
  );
};

export default CampusMapSVG;