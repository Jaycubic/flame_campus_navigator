import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationControlPanel = ({
  destination,
  distance = '0.0 km',
  estimatedTime = '0 min',
  isVoiceEnabled = false,
  onCancelNavigation,
  onVoiceToggle,
  onRecalculateRoute,
  nextInstruction = '',
  gpsAccuracy = 'high'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);

  const handleCancelNavigation = () => {
    if (onCancelNavigation) {
      onCancelNavigation();
    }
  };

  const handleVoiceToggle = () => {
    if (onVoiceToggle) {
      onVoiceToggle();
    }
  };

  const handleRecalculateRoute = () => {
    if (onRecalculateRoute) {
      onRecalculateRoute();
    }
  };

  const getGpsStatusColor = () => {
    switch (gpsAccuracy) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  const getGpsStatusIcon = () => {
    switch (gpsAccuracy) {
      case 'high': return 'Satellite';
      case 'medium': return 'MapPin';
      case 'low': return 'AlertTriangle';
      default: return 'Satellite';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-4 mb-4">
        <motion.div
          className="bg-white rounded-t-2xl shadow-2xl border border-gray-200 overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Main Navigation Info */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Icon name="Navigation" size={20} className="text-white" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-semibold">Navigating to</h2>
                  <p className="text-blue-100 text-sm">{destination?.name || 'Unknown Destination'}</p>
                </div>
              </div>
              
              <motion.button
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Icon 
                  name={isExpanded ? "ChevronDown" : "ChevronUp"} 
                  size={16} 
                  className="text-white" 
                />
              </motion.button>
            </div>

            {/* Distance and Time Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-bold font-mono"
                  key={distance}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {distance}
                </motion.p>
                <p className="text-blue-100 text-sm">Distance</p>
              </div>
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-bold font-mono"
                  key={estimatedTime}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {estimatedTime}
                </motion.p>
                <p className="text-blue-100 text-sm">ETA</p>
              </div>
            </div>
          </div>

          {/* Next Instruction */}
          <AnimatePresence>
            {nextInstruction && (
              <motion.div
                className="px-6 py-4 bg-blue-50 border-b border-blue-100"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                    <Icon name="ArrowRight" size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Next Direction</p>
                    <p className="text-gray-700 leading-relaxed">{nextInstruction}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Controls */}
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="destructive"
                iconName="X"
                iconPosition="left"
                onClick={handleCancelNavigation}
                className="flex-1 h-12 text-base font-medium"
              >
                Cancel Navigation
              </Button>
              
              <Button
                variant={isVoiceEnabled ? "default" : "outline"}
                size="icon"
                onClick={handleVoiceToggle}
                className="h-12 w-12"
              >
                <Icon 
                  name={isVoiceEnabled ? "Volume2" : "VolumeX"} 
                  size={20} 
                />
              </Button>
            </div>

            {/* GPS Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getGpsStatusIcon()} 
                  size={16} 
                  className={getGpsStatusColor()}
                />
                <span className="text-sm text-gray-600">
                  GPS: {gpsAccuracy} accuracy
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 h-3 rounded-full ${
                      (gpsAccuracy === 'high' && bar <= 4) ||
                      (gpsAccuracy === 'medium' && bar <= 2) ||
                      (gpsAccuracy === 'low' && bar <= 1)
                        ? 'bg-green-500' :'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="border-t border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 space-y-3">
                  <Button
                    variant="outline"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={handleRecalculateRoute}
                    fullWidth
                    className="h-10"
                  >
                    Recalculate Route
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="AlertTriangle"
                    iconPosition="left"
                    onClick={() => setShowEmergencyOptions(!showEmergencyOptions)}
                    fullWidth
                    className="h-10"
                  >
                    Emergency Options
                  </Button>

                  <AnimatePresence>
                    {showEmergencyOptions && (
                      <motion.div
                        className="grid grid-cols-2 gap-2 pt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          iconName="Phone"
                          iconPosition="left"
                          onClick={() => {}}
                          className="h-9 text-sm"
                        >
                          Call Help
                        </Button>
                        <Button
                          variant="outline"
                          iconName="MapPin"
                          iconPosition="left"
                          onClick={() => {}}
                          className="h-9 text-sm"
                        >
                          Share Location
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NavigationControlPanel;