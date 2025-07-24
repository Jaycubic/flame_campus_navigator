import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ActiveNavigationMap = ({ 
  currentPosition, 
  destination, 
  routePath, 
  userHeading = 0,
  onMapClick,
  isFollowingUser = true 
}) => {
  const mapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [viewBox, setViewBox] = useState('0 0 2645.25 3910.05');

  // Anchor points for coordinate conversion
  const pixelTopLeft = { x: 132.75, y: 133.55, lat: 18.5271557, lng: 73.7276252 };
  const pixelBottomRight = { x: 2512.5, y: 3776.5, lat: 18.5180856, lng: 73.7339646 };

  // Convert GPS coordinates to SVG pixel coordinates
  const gpsToPixel = (lat, lng) => {
    const latRange = pixelTopLeft.lat - pixelBottomRight.lat;
    const lngRange = pixelBottomRight.lng - pixelTopLeft.lng;
    const xRange = pixelBottomRight.x - pixelTopLeft.x;
    const yRange = pixelBottomRight.y - pixelTopLeft.y;

    const x = pixelTopLeft.x + ((lng - pixelTopLeft.lng) / lngRange) * xRange;
    const y = pixelTopLeft.y + ((pixelTopLeft.lat - lat) / latRange) * yRange;

    return { x, y };
  };

  // Update map dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        setMapDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-center map on user position when following
  useEffect(() => {
    if (isFollowingUser && currentPosition && mapRef.current) {
      const userPixel = gpsToPixel(currentPosition.lat, currentPosition.lng);
      const centerX = userPixel.x - (mapDimensions.width / 2);
      const centerY = userPixel.y - (mapDimensions.height / 2);
      setViewBox(`${centerX} ${centerY} ${mapDimensions.width} ${mapDimensions.height}`);
    }
  }, [currentPosition, isFollowingUser, mapDimensions]);

  const userPixelPosition = currentPosition ? gpsToPixel(currentPosition.lat, currentPosition.lng) : null;
  const destinationPixelPosition = destination ? gpsToPixel(destination.lat, destination.lng) : null;

  // Generate route path points
  const routePathPoints = routePath?.map(point => gpsToPixel(point.lat, point.lng)) || [];

  const handleMapClick = (event) => {
    if (onMapClick) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      onMapClick({ x, y });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      <svg
        ref={mapRef}
        viewBox={viewBox}
        className="w-full h-full cursor-pointer"
        onClick={handleMapClick}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Campus Map Background */}
        <rect
          x="0"
          y="0"
          width="2645.25"
          height="3910.05"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* Campus Buildings - Simplified representation */}
        <g className="buildings">
          {/* Academic Block A */}
          <rect x="400" y="800" width="300" height="200" fill="#3b82f6" fillOpacity="0.3" stroke="#1e40af" strokeWidth="2" rx="8" />
          <text x="550" y="910" textAnchor="middle" className="fill-blue-800 text-sm font-medium">Academic Block A</text>

          {/* Library */}
          <rect x="800" y="600" width="250" height="180" fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="2" rx="8" />
          <text x="925" y="700" textAnchor="middle" className="fill-emerald-700 text-sm font-medium">Library</text>

          {/* Student Center */}
          <rect x="1200" y="900" width="280" height="220" fill="#f59e0b" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" rx="8" />
          <text x="1340" y="1020" textAnchor="middle" className="fill-amber-700 text-sm font-medium">Student Center</text>

          {/* Hostel Blocks */}
          <rect x="1600" y="1400" width="200" height="300" fill="#8b5cf6" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" rx="8" />
          <text x="1700" y="1560" textAnchor="middle" className="fill-violet-700 text-sm font-medium">Hostel 1</text>

          <rect x="1850" y="1400" width="200" height="300" fill="#8b5cf6" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" rx="8" />
          <text x="1950" y="1560" textAnchor="middle" className="fill-violet-700 text-sm font-medium">Hostel 2</text>

          {/* Sports Complex */}
          <rect x="500" y="2000" width="400" height="300" fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2" rx="8" />
          <text x="700" y="2160" textAnchor="middle" className="fill-red-700 text-sm font-medium">Sports Complex</text>

          {/* Cafeteria */}
          <rect x="1000" y="1200" width="180" height="150" fill="#06b6d4" fillOpacity="0.3" stroke="#0891b2" strokeWidth="2" rx="8" />
          <text x="1090" y="1285" textAnchor="middle" className="fill-cyan-700 text-sm font-medium">Cafeteria</text>
        </g>

        {/* Pathways */}
        <g className="pathways">
          <path
            d="M 200 1000 Q 600 1000 1000 1200 Q 1400 1400 1800 1600"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 550 1000 L 550 1500 L 1200 1500"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        {/* Active Route Path */}
        <AnimatePresence>
          {routePathPoints.length > 1 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.path
                d={`M ${routePathPoints.map(point => `${point.x} ${point.y}`).join(' L ')}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Route Direction Arrows */}
              {routePathPoints.slice(0, -1).map((point, index) => {
                const nextPoint = routePathPoints[index + 1];
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;
                
                return (
                  <motion.g
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <polygon
                      points="0,-8 12,0 0,8"
                      fill="#3b82f6"
                      transform={`translate(${midX}, ${midY}) rotate(${angle})`}
                    />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Destination Marker */}
        <AnimatePresence>
          {destinationPixelPosition && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.circle
                cx={destinationPixelPosition.x}
                cy={destinationPixelPosition.y}
                r="20"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx={destinationPixelPosition.x}
                cy={destinationPixelPosition.y}
                r="8"
                fill="#ffffff"
              />
              
              {/* Destination Label */}
              <motion.g
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <rect
                  x={destinationPixelPosition.x - 60}
                  y={destinationPixelPosition.y - 50}
                  width="120"
                  height="25"
                  fill="#1f2937"
                  rx="4"
                  fillOpacity="0.9"
                />
                <text
                  x={destinationPixelPosition.x}
                  y={destinationPixelPosition.y - 32}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                >
                  {destination?.name || 'Destination'}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* User Position Marker with Heading */}
        <AnimatePresence>
          {userPixelPosition && (
            <motion.g
              animate={{
                x: userPixelPosition.x,
                y: userPixelPosition.y
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {/* GPS Accuracy Circle */}
              <motion.circle
                r="15"
                fill="#3b82f6"
                fillOpacity="0.2"
                stroke="#3b82f6"
                strokeWidth="1"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* User Direction Indicator */}
              <motion.g
                animate={{ rotate: userHeading }}
                transition={{ duration: 0.5 }}
              >
                <polygon
                  points="0,-12 8,8 0,4 -8,8"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </motion.g>
              
              {/* Center Dot */}
              <circle
                r="3"
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Proximity Alert Ring */}
        <AnimatePresence>
          {destinationPixelPosition && userPixelPosition && (
            <motion.circle
              cx={destinationPixelPosition.x}
              cy={destinationPixelPosition.y}
              r="30"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5 5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
                rotate: 360
              }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Zoom in functionality
          }}
        >
          <Icon name="Plus" size={20} className="text-gray-700" />
        </motion.button>
        
        <motion.button
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Zoom out functionality
          }}
        >
          <Icon name="Minus" size={20} className="text-gray-700" />
        </motion.button>
        
        <motion.button
          className={`w-10 h-10 rounded-lg shadow-lg border border-gray-200 flex items-center justify-center ${
            isFollowingUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Toggle follow user functionality
          }}
        >
          <Icon name="Navigation" size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default ActiveNavigationMap;