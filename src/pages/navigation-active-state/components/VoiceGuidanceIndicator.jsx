import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const VoiceGuidanceIndicator = ({ 
  isActive = false,
  currentAnnouncement = '',
  onDismiss,
  voiceSettings = { volume: 0.8, rate: 1.0, pitch: 1.0 }
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [waveAnimation, setWaveAnimation] = useState(false);
  const [announcementQueue, setAnnouncementQueue] = useState([]);

  // Show indicator when voice is active or announcement is playing
  useEffect(() => {
    if (isActive || currentAnnouncement) {
      setIsVisible(true);
      setWaveAnimation(true);
    } else {
      setWaveAnimation(false);
      // Hide after animation completes
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isActive, currentAnnouncement]);

  // Auto-dismiss announcement after 5 seconds
  useEffect(() => {
    if (currentAnnouncement) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentAnnouncement, onDismiss]);

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm mx-4">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                  animate={waveAnimation ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Icon name="Volume2" size={14} className="text-white" />
                </motion.div>
                <span className="text-sm font-medium">Voice Guidance</span>
              </div>
              
              <motion.button
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
              >
                <Icon name="X" size={12} className="text-white" />
              </motion.button>
            </div>
          </div>

          {/* Voice Wave Animation */}
          <div className="px-4 py-3 bg-blue-50">
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1 bg-blue-500 rounded-full"
                  animate={waveAnimation ? {
                    height: [8, 16, 8],
                    opacity: [0.5, 1, 0.5]
                  } : { height: 8, opacity: 0.5 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: bar * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Current Announcement */}
          <AnimatePresence>
            {currentAnnouncement && (
              <motion.div
                className="px-4 py-3 border-t border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Icon name="MessageSquare" size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {currentAnnouncement}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice Status */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Voice guidance active</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Settings" size={12} />
                <span>Settings</span>
              </div>
            </div>

            {/* Volume Indicator */}
            <div className="mt-2 flex items-center space-x-2">
              <Icon name="Volume2" size={12} className="text-gray-500" />
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-blue-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${voiceSettings.volume * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round(voiceSettings.volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceGuidanceIndicator;