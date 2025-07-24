import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArrivalCelebration = ({ 
  isVisible = false,
  destination,
  onDismiss,
  onNavigateAgain,
  onViewDestinationInfo,
  arrivalTime = new Date()
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState('arriving'); // 'arriving', 'celebration', 'options'

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setCelebrationPhase('arriving');
      
      // Sequence the celebration phases
      const timer1 = setTimeout(() => setCelebrationPhase('celebration'), 1000);
      const timer2 = setTimeout(() => setCelebrationPhase('options'), 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowConfetti(false);
      setCelebrationPhase('arriving');
    }
  }, [isVisible]);

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
  };

  const handleNavigateAgain = () => {
    if (onNavigateAgain) onNavigateAgain();
  };

  const handleViewInfo = () => {
    if (onViewDestinationInfo) onViewDestinationInfo();
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100,
    rotation: Math.random() * 360
  }));

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: particle.color,
                    left: `${particle.x}%`,
                    top: '-10%'
                  }}
                  initial={{ 
                    y: -100, 
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: particle.rotation,
                    scale: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Celebration Modal */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm mx-4 w-full"
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Celebration Header */}
          <div className="relative px-6 py-8 bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute top-8 right-6 w-4 h-4 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-6 h-6 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-2 border-white rounded-full"></div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h1 className="text-2xl font-bold mb-2">You've Arrived!</h1>
              <p className="text-green-100 text-sm">
                Welcome to {destination?.name || 'your destination'}
              </p>
            </motion.div>
          </div>

          {/* Arrival Details */}
          <div className="px-6 py-4 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-green-600" />
                <span className="text-gray-700">Arrived at</span>
              </div>
              <span className="font-medium text-gray-900">
                {arrivalTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-green-600" />
                <span className="text-gray-700">Location</span>
              </div>
              <span className="font-medium text-gray-900 truncate ml-2">
                {destination?.building || 'Campus Location'}
              </span>
            </div>
          </div>

          {/* Celebration Message */}
          <AnimatePresence mode="wait">
            {celebrationPhase === 'arriving' && (
              <motion.div
                className="px-6 py-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Icon name="PartyPopper" size={48} className="text-yellow-500 mx-auto mb-3" />
                </motion.div>
                <p className="text-gray-600">
                  Navigation completed successfully!
                </p>
              </motion.div>
            )}

            {celebrationPhase === 'celebration' && (
              <motion.div
                className="px-6 py-6 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  <Icon name="Trophy" size={48} className="text-yellow-500 mx-auto mb-3" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Great job!
                </h3>
                <p className="text-gray-600">
                  You've successfully navigated to your destination using FLAME Campus Navigator.
                </p>
              </motion.div>
            )}

            {celebrationPhase === 'options' && (
              <motion.div
                className="px-6 py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-3">
                  <Button
                    variant="default"
                    iconName="Navigation"
                    iconPosition="left"
                    onClick={handleNavigateAgain}
                    fullWidth
                    className="h-12"
                  >
                    Navigate Somewhere Else
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="Info"
                    iconPosition="left"
                    onClick={handleViewInfo}
                    fullWidth
                    className="h-10"
                  >
                    View Location Info
                  </Button>
                  
                  <Button
                    variant="ghost"
                    iconName="X"
                    iconPosition="left"
                    onClick={handleDismiss}
                    fullWidth
                    className="h-10 text-gray-600"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArrivalCelebration;