import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapRouteCalculator from './MapRouteCalculator';

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
        {/* Campus Map Background */}
        <rect width="2800" height="4000" fill="#f8fafc" />
        
        {/* Campus Buildings - Mock SVG representation */}
        <g id="buildings">
          {/* Main Academic Block */}
          <rect x="400" y="800" width="600" height="400" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" rx="8" />
          <text x="700" y="1020" textAnchor="middle" className="fill-slate-700 text-sm font-medium">Academic Block</text>
          
          {/* Library */}
          <rect x="1200" y="600" width="400" height="300" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" rx="8" />
          <text x="1400" y="770" textAnchor="middle" className="fill-purple-700 text-sm font-medium">Library</text>
          
          {/* Student Center */}
          <rect x="800" y="1400" width="500" height="350" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" rx="8" />
          <text x="1050" y="1590" textAnchor="middle" className="fill-amber-700 text-sm font-medium">Student Center</text>
          
          {/* Hostel Blocks */}
          <rect x="1800" y="1000" width="300" height="800" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" rx="8" />
          <text x="1950" y="1420" textAnchor="middle" className="fill-green-700 text-sm font-medium">Hostel A</text>
          
          <rect x="2200" y="1000" width="300" height="800" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" rx="8" />
          <text x="2350" y="1420" textAnchor="middle" className="fill-green-700 text-sm font-medium">Hostel B</text>
          
          {/* Sports Complex */}
          <rect x="400" y="2200" width="800" height="600" fill="#fecaca" stroke="#dc2626" strokeWidth="3" rx="8" />
          <text x="800" y="2520" textAnchor="middle" className="fill-red-700 text-sm font-medium">Sports Complex</text>
          
          {/* Administrative Block */}
          <rect x="1400" y="1900" width="400" height="300" fill="#e0e7ff" stroke="#3b82f6" strokeWidth="3" rx="8" />
          <text x="1600" y="2070" textAnchor="middle" className="fill-blue-700 text-sm font-medium">Admin Block</text>
        </g>

        {/* Enhanced Campus Roads with waypoint indicators */}
        <g id="roads">
          <path d="M 200 1000 L 2600 1000" stroke="#94a3b8" strokeWidth="20" fill="none" />
          <path d="M 1400 200 L 1400 3800" stroke="#94a3b8" strokeWidth="20" fill="none" />
          <path d="M 600 1800 L 2200 1800" stroke="#94a3b8" strokeWidth="15" fill="none" />
          
          {/* Road intersection markers */}
          <circle cx="1400" cy="1000" r="8" fill="#64748b" />
          <circle cx="1400" cy="1800" r="8" fill="#64748b" />
          <circle cx="600" cy="1000" r="6" fill="#64748b" />
          <circle cx="2200" cy="1000" r="6" fill="#64748b" />
        </g>

        {/* Campus Locations with enhanced interactions */}
        <g id="locations">
          {campusLocations.map((location) => {
            const pixel = gpsToPixel(location.lat, location.lng);
            const isSelected = selectedDestination?.id === location.id;
            const isHovered = hoveredLocation?.id === location.id;
            
            return (
              <g key={location.id}>
                {/* Location marker */}
                <motion.circle
                  cx={pixel.x}
                  cy={pixel.y}
                  r={isSelected ? 24 : isHovered ? 20 : 15}
                  fill={isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "#64748b"}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocationClick(location);
                  }}
                  onMouseEnter={() => handleLocationHover(location)}
                  onMouseLeave={handleLocationLeave}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: isSelected ? [1, 1.2, 1] : 1,
                    fill: isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "#64748b"
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Location label */}
                <text
                  x={pixel.x}
                  y={pixel.y - (isSelected ? 35 : isHovered ? 30 : 25)}
                  textAnchor="middle"
                  className="fill-slate-700 text-xs font-medium pointer-events-none"
                  style={{ fontSize: isHovered || isSelected ? '14px' : '12px' }}
                >
                  {location.name}
                </text>
                
                {/* Category indicator */}
                <circle
                  cx={pixel.x + (isSelected ? 18 : 12)}
                  cy={pixel.y - (isSelected ? 18 : 12)}
                  r="4"
                  fill={
                    location.category === 'academic' ? '#7c3aed' :
                    location.category === 'dining' ? '#f59e0b' :
                    location.category === 'facilities' ? '#dc2626' :
                    location.category === 'dormitory' ? '#16a34a' : '#64748b'
                  }
                  className="pointer-events-none"
                />
              </g>
            );
          })}
        </g>

        {/* Custom selected location marker */}
        <AnimatePresence>
          {selectedMapPoint && selectedMapPoint.isCustom && (
            <g id="custom-location">
              <motion.circle
                cx={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).x}
                cy={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).y}
                r="18"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.circle
                cx={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).x}
                cy={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).y}
                r="8"
                fill="#ffffff"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              />
              <text
                x={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).x}
                y={gpsToPixel(selectedMapPoint.lat, selectedMapPoint.lng).y - 30}
                textAnchor="middle"
                className="fill-emerald-700 text-sm font-semibold"
              >
                Selected Location
              </text>
            </g>
          )}
        </AnimatePresence>

        {/* User Position */}
        <AnimatePresence>
          {userPosition && (
            <g id="user-position">
              {/* Accuracy Circle */}
              <motion.circle
                cx={gpsToPixel(userPosition.lat, userPosition.lng).x}
                cy={gpsToPixel(userPosition.lat, userPosition.lng).y}
                r="30"
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* User Dot */}
              <motion.circle
                cx={gpsToPixel(userPosition.lat, userPosition.lng).x}
                cy={gpsToPixel(userPosition.lat, userPosition.lng).y}
                r="8"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="3"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          )}
        </AnimatePresence>

        {/* Enhanced Navigation Route with waypoints */}
        <AnimatePresence>
          {showRoute && userPosition && selectedDestination && (
            <g id="navigation-route">
              {/* Main route path */}
              <motion.path
                d={generateEnhancedRoutePath()}
                stroke="#f59e0b"
                strokeWidth="8"
                fill="none"
                strokeDasharray="12,6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* Route shadow for better visibility */}
              <motion.path
                d={generateEnhancedRoutePath()}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="12"
                fill="none"
                strokeDasharray="12,6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* Waypoint markers */}
              {optimizedRoute?.waypoints?.map((waypoint, index) => {
                const pixel = gpsToPixel(waypoint.lat, waypoint.lng);
                return (
                  <motion.circle
                    key={`waypoint-${index}`}
                    cx={pixel.x}
                    cy={pixel.y}
                    r="6"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  />
                );
              })}
            </g>
          )}
        </AnimatePresence>

        {/* Route Direction Arrows - Enhanced */}
        <AnimatePresence>
          {showRoute && userPosition && selectedDestination && optimizedRoute && (
            <g id="route-arrows">
              {[0.2, 0.4, 0.6, 0.8].map((position, index) => {
                const routePoints = [userPosition, ...optimizedRoute.waypoints, selectedDestination];
                const totalSegments = routePoints.length - 1;
                const segmentIndex = Math.floor(position * totalSegments);
                const segmentPosition = (position * totalSegments) - segmentIndex;
                
                if (segmentIndex >= routePoints.length - 1) return null;
                
                const startPoint = routePoints[segmentIndex];
                const endPoint = routePoints[segmentIndex + 1];
                const startPixel = gpsToPixel(startPoint.lat, startPoint.lng);
                const endPixel = gpsToPixel(endPoint.lat, endPoint.lng);
                
                const x = startPixel.x + (endPixel.x - startPixel.x) * segmentPosition;
                const y = startPixel.y + (endPixel.y - startPixel.y) * segmentPosition;
                
                // Calculate arrow rotation
                const angle = Math.atan2(endPixel.y - startPixel.y, endPixel.x - startPixel.x) * 180 / Math.PI;
                
                return (
                  <motion.g
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.15 + 0.8, duration: 0.4 }}
                  >
                    <polygon
                      points={`-10,-4 10,0 -10,4`}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1"
                      transform={`translate(${x},${y}) rotate(${angle})`}
                    />
                  </motion.g>
                );
              })}
            </g>
          )}
        </AnimatePresence>
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