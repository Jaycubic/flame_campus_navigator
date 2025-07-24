import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CompassWidget = ({ 
  userHeading = 0, 
  destinationBearing = 0,
  isVisible = true,
  onToggleVisibility 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [magneticDeclination] = useState(2.5); // Approximate for Pune, India

  // Calculate true north from magnetic north
  const trueNorth = userHeading + magneticDeclination;
  
  // Calculate relative bearing to destination
  const relativeBearing = destinationBearing - userHeading;

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 z-40">
      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        layout
      >
        {/* Compact View */}
        <motion.div
          className="p-3 cursor-pointer"
          onClick={handleToggleExpanded}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-16 h-16">
            {/* Compass Background */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-300 bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Cardinal Direction Markers */}
              <div className="absolute inset-1 rounded-full">
                {/* North */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                  <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                </div>
                {/* East */}
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                  <div className="w-3 h-1 bg-gray-400 rounded-full"></div>
                </div>
                {/* South */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                  <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
                </div>
                {/* West */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                  <div className="w-3 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Compass Needle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -userHeading }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="relative">
                {/* North Pointer (Red) */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-6 border-l-transparent border-r-transparent border-b-red-500"></div>
                </div>
                {/* South Pointer (White) */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-6 border-l-transparent border-r-transparent border-t-white border-t-opacity-80"></div>
                </div>
                {/* Center Dot */}
                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              </div>
            </motion.div>

            {/* Destination Indicator */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: relativeBearing }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Expanded View */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-3 pb-3 border-t border-gray-200">
            <div className="space-y-2 text-xs">
              {/* Heading Information */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Heading:</span>
                <span className="font-mono font-medium">{Math.round(userHeading)}°</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">To Destination:</span>
                <span className="font-mono font-medium text-blue-600">{Math.round(destinationBearing)}°</span>
              </div>

              {/* Cardinal Direction */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Direction:</span>
                <span className="font-medium">
                  {(() => {
                    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                    const index = Math.round(userHeading / 45) % 8;
                    return directions[index];
                  })()}
                </span>
              </div>

              {/* Accuracy Indicator */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">High</span>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <motion.button
              className="w-full mt-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onToggleVisibility}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="EyeOff" size={12} className="inline mr-1" />
              Hide Compass
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompassWidget;