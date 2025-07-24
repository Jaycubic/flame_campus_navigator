import React, { useState, useEffect, useCallback, useRef } from 'react';

const useVoiceGuidanceSystem = ({
  isEnabled = false,
  language = 'en-US',
  onSpeechStart,
  onSpeechEnd,
  onSpeechError
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const speechQueue = useRef([]);
  const currentUtterance = useRef(null);

  // Check Web Speech API support
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 
                     'SpeechSynthesisUtterance' in window;
    setIsSupported(supported);

    if (supported && window.speechSynthesis) {
      // Load available voices
      const loadVoices = () => {
        try {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices);

          // Find preferred female voice for English
          const femaleVoice = availableVoices.find((voice) =>
            voice.lang.startsWith(language.split('-')[0]) && (
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('karen'))
          );

          // Fallback to any English voice
          const englishVoice = availableVoices.find((voice) =>
            voice.lang.startsWith(language.split('-')[0])
          );

          setSelectedVoice(femaleVoice || englishVoice || availableVoices[0]);
        } catch (error) {
          console.error('Error loading voices:', error);
          if (onSpeechError) onSpeechError(error.message);
        }
      };

      // Load voices immediately if available
      loadVoices();

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }

      return () => {
        if (window.speechSynthesis.removeEventListener) {
          window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        }
      };
    }
  }, [language, onSpeechError]);

  // Stop current speech
  const stopSpeech = useCallback(() => {
    try {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      speechQueue.current = [];
      currentUtterance.current = null;
    } catch (error) {
      console.error('Error stopping speech:', error);
      if (onSpeechError) onSpeechError(error.message);
    }
  }, [onSpeechError]);

  // Process speech queue
  const processQueue = useCallback(() => {
    if (speechQueue.current.length === 0 || isSpeaking || !window.speechSynthesis) return;

    const nextText = speechQueue.current.shift();
    
    try {
      const utterance = new SpeechSynthesisUtterance(nextText);

      // Configure utterance
      utterance.voice = selectedVoice;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = language;

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        if (onSpeechStart) onSpeechStart(nextText);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtterance.current = null;
        if (onSpeechEnd) onSpeechEnd(nextText);

        // Process next item in queue
        setTimeout(processQueue, 100);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        currentUtterance.current = null;
        if (onSpeechError) onSpeechError(event.error);

        // Continue with queue on error
        setTimeout(processQueue, 100);
      };

      currentUtterance.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error creating utterance:', error);
      if (onSpeechError) onSpeechError(error.message);
      setIsSpeaking(false);
      // Continue with queue on error
      setTimeout(processQueue, 100);
    }
  }, [selectedVoice, language, isSpeaking, onSpeechStart, onSpeechEnd, onSpeechError]);

  // Speak text with queue management
  const speak = useCallback((text, priority = false) => {
    if (!isSupported || !isEnabled || !text?.trim() || !window.speechSynthesis) return;

    if (priority) {
      // High priority: stop current speech and speak immediately
      stopSpeech();
      speechQueue.current = [text];
    } else {
      // Normal priority: add to queue
      speechQueue.current.push(text);
    }

    processQueue();
  }, [isSupported, isEnabled, stopSpeech, processQueue]);

  // Predefined navigation announcements
  const announcements = {
    destinationReached: (destinationName) =>
      `You have arrived at your destination: ${destinationName}`,

    navigationStarted: (destinationName) =>
      `Navigation started to ${destinationName}`,

    navigationCancelled: () =>
      `Navigation cancelled`,

    proximityAlert: (destinationName, distance) =>
      `Approaching ${destinationName}. ${Math.round(distance)} meters remaining`,

    gpsLost: () =>
      `GPS signal lost. Please check your location settings`,

    gpsRestored: () =>
      `GPS signal restored`,

    routeRecalculating: () =>
      `Recalculating route`,

    turnInstruction: (direction, landmark) =>
      `${direction} ${landmark ? `towards ${landmark}` : ''}`,

    distanceUpdate: (distance, estimatedTime) =>
      `${Math.round(distance)} meters remaining. Estimated time: ${Math.round(estimatedTime)} minutes`
  };

  // Quick announcement methods
  const announceDestinationReached = useCallback((destinationName) => {
    speak(announcements.destinationReached(destinationName), true);
  }, [speak, announcements]);

  const announceNavigationStarted = useCallback((destinationName) => {
    speak(announcements.navigationStarted(destinationName));
  }, [speak, announcements]);

  const announceNavigationCancelled = useCallback(() => {
    speak(announcements.navigationCancelled(), true);
  }, [speak, announcements]);

  const announceProximityAlert = useCallback((destinationName, distance) => {
    speak(announcements.proximityAlert(destinationName, distance));
  }, [speak, announcements]);

  const announceGPSStatus = useCallback((isLost) => {
    const message = isLost ? announcements.gpsLost() : announcements.gpsRestored();
    speak(message, true);
  }, [speak, announcements]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Public interface
  return {
    // Core methods
    speak,
    stopSpeech,

    // Quick announcements
    announceDestinationReached,
    announceNavigationStarted,
    announceNavigationCancelled,
    announceProximityAlert,
    announceGPSStatus,

    // Status
    isSupported,
    isSpeaking,
    isEnabled,
    voices,
    selectedVoice,

    // Voice selection
    setSelectedVoice: (voice) => setSelectedVoice(voice)
  };
};

export default useVoiceGuidanceSystem;