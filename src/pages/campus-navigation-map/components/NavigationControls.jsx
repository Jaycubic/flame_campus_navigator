import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  mode = 'browsing', // 'browsing' | 'navigating'
  onSearchClick,
  onCancelNavigation,
  onVoiceToggle,
  isVoiceEnabled = false,
  currentDestination = null,
  navigationStats = null,
  onRecenterMap,
  onSettingsClick
}) => {
  const handleSearchClick = () => {
    if (onSearchClick) onSearchClick();
  };

  const handleCancelNavigation = () => {
    if (onCancelNavigation) onCancelNavigation();
  };

  const handleVoiceToggle = () => {
    if (onVoiceToggle) onVoiceToggle();
  };

  const handleRecenterMap = () => {
    if (onRecenterMap) onRecenterMap();
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) onSettingsClick();
  };

  if (mode === 'browsing') {
    return (
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm">
            {/* Enhanced Selection Info */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Icon name="MapPin" size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Tap anywhere on map to navigate
                  </h3>
                  <p className="text-xs text-gray-600">
                    Or search for specific destinations
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="Navigation" size={14} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Search Button */}
            <div className="p-6">
              <Button
                variant="default"
                fullWidth
                iconName="Search"
                iconPosition="left"
                onClick={handleSearchClick}
                className="h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                Search Campus Destinations
              </Button>
            </div>
            
            {/* Enhanced Quick Actions */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  iconName="MapPin"
                  iconPosition="left"
                  onClick={() => {}}
                  className="h-12 text-sm font-medium border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Nearby
                </Button>
                <Button
                  variant="outline"
                  iconName="Clock"
                  iconPosition="left"
                  onClick={() => {}}
                  className="h-12 text-sm font-medium border-gray-300 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                >
                  Recent
                </Button>
                <Button
                  variant="outline"
                  iconName="Star"
                  iconPosition="left"
                  onClick={() => {}}
                  className="h-12 text-sm font-medium border-gray-300 hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200"
                >
                  Saved
                </Button>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="px-6 pb-4 border-t border-gray-100">
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  iconName="Crosshair"
                  iconPosition="left"
                  onClick={handleRecenterMap}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  My Location
                </Button>
                <Button
                  variant="ghost"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={handleSettingsClick}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  iconName="Info"
                  iconPosition="left"
                  onClick={() => {}}
                  className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Help
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm">
            {/* Enhanced Destination Info */}
            {currentDestination && (
              <motion.div 
                className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                    <Icon 
                      name={currentDestination.isCustom ? "Navigation" : "MapPin"} 
                      size={20} 
                      className="text-blue-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {currentDestination.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentDestination.isCustom ? 'Custom Location' : currentDestination.category}
                      {currentDestination.isCustom && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          Selected on Map
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {navigationStats && (
                      <>
                        <p className="text-lg font-bold text-blue-600 font-mono">
                          {navigationStats.distance}
                        </p>
                        <p className="text-xs text-gray-500">
                          {navigationStats.estimatedTime}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Route optimization indicator */}
                {navigationStats?.waypoints?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-100">
                    <div className="flex items-center space-x-2">
                      <Icon name="Route" size={14} className="text-blue-500" />
                      <span className="text-xs text-blue-700 font-medium">
                        Optimized route with {navigationStats.waypoints.length} waypoints
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Enhanced Navigation Controls */}
            <div className="p-6">
              <div className="flex items-center space-x-4">
                {/* Cancel Navigation */}
                <Button
                  variant="destructive"
                  iconName="X"
                  iconPosition="left"
                  onClick={handleCancelNavigation}
                  className="flex-1 h-14 text-base font-semibold hover:bg-red-600 transition-all duration-200"
                >
                  Cancel Navigation
                </Button>
                
                {/* Voice Toggle */}
                <Button
                  variant={isVoiceEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`h-14 w-14 transition-all duration-200 ${
                    isVoiceEnabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                      : 'border-gray-300 hover:border-green-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon 
                    name={isVoiceEnabled ? "Volume2" : "VolumeX"} 
                    size={24} 
                  />
                </Button>

                {/* Recenter Map */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRecenterMap}
                  className="h-14 w-14 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Icon name="Crosshair" size={24} />
                </Button>
              </div>
            </div>

            {/* Enhanced Navigation Instructions */}
            {navigationStats?.nextInstruction && (
              <motion.div 
                className="px-6 pb-4 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start space-x-3 pt-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 mt-1">
                    <Icon name="ArrowRight" size={16} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {navigationStats.nextInstruction}
                    </p>
                    {navigationStats?.instructions && navigationStats.instructions.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Step 1 of {navigationStats.instructions.length}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Route Summary */}
            {navigationStats?.instructions && navigationStats.instructions.length > 0 && (
              <motion.div 
                className="px-6 pb-4 border-t border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3 }}
              >
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Route Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Total Distance</p>
                      <p className="text-sm font-semibold text-gray-900">{navigationStats.distance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Est. Time</p>
                      <p className="text-sm font-semibold text-gray-900">{navigationStats.estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Instructions</p>
                      <p className="text-sm font-semibold text-gray-900">{navigationStats.instructions.length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NavigationControls;