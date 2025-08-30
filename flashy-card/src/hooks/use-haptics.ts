'use client';

export interface HapticsAPI {
  vibrate: (pattern: number | number[]) => void;
  lightImpact: () => void;
  mediumImpact: () => void;
  heavyImpact: () => void;
  success: () => void;
  error: () => void;
  warning: () => void;
  selection: () => void;
}

export function useHaptics(): HapticsAPI {
  const vibrate = (pattern: number | number[] = 50) => {
    // Check if the device supports vibration
    if ('vibrate' in navigator && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Silently fail if vibration is not supported
        console.debug('Vibration not supported:', error);
      }
    }
  };

  const lightImpact = () => {
    // Light haptic feedback for gentle interactions
    vibrate(50);
  };

  const mediumImpact = () => {
    // Medium haptic feedback for standard interactions
    vibrate(100);
  };

  const heavyImpact = () => {
    // Heavy haptic feedback for important interactions
    vibrate(200);
  };

  const success = () => {
    // Success pattern: short-short-short
    vibrate([50, 50, 50, 50, 50]);
  };

  const error = () => {
    // Error pattern: long-short-long
    vibrate([200, 100, 50, 100, 200]);
  };

  const warning = () => {
    // Warning pattern: medium-medium
    vibrate([100, 100, 100]);
  };

  const selection = () => {
    // Selection feedback: very light
    vibrate(25);
  };

  return {
    vibrate,
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    error,
    warning,
    selection,
  };
}

