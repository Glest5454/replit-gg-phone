import { useState, useCallback, useEffect } from 'react';

export type Screen = 
  | 'lock'
  | 'home'
  | 'banking'
  | 'twitter'
  | 'settings'
  | 'calculator'
  | 'camera'
  | 'gallery'
  | 'notes'
  | 'spotify'
  | 'clock'
  | 'yellowpages'
  | 'contacts';

export interface PhoneState {
  currentScreen: Screen;
  isLocked: boolean;
  pin: string;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

export interface Notification {
  id: string;
  app: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

export const usePhone = () => {
  const [phoneState, setPhoneState] = useState<PhoneState>(() => {
    // Check if lock screen is enabled
    const isLockEnabled = localStorage.getItem('phone-lock-enabled') === 'true';
    
    return {
      currentScreen: isLockEnabled ? 'lock' : 'home',
      isLocked: isLockEnabled,
      pin: '',
      notifications: [
        {
          id: '1',
          app: 'Messages',
          title: 'Messages',
          message: 'Hey, are you online?',
          time: '2m',
          icon: 'message'
        }
      ],
      theme: 'dark'
    };
  });

  const navigateToScreen = useCallback((screen: Screen) => {
    setPhoneState(prev => ({
      ...prev,
      currentScreen: screen
    }));
  }, []);

  const goBack = useCallback(() => {
    setPhoneState(prev => ({
      ...prev,
      currentScreen: 'home'
    }));
  }, []);

  const unlock = useCallback(() => {
    setPhoneState(prev => ({
      ...prev,
      isLocked: false,
      currentScreen: 'home',
      pin: ''
    }));
  }, []);

  const lock = useCallback(() => {
    setPhoneState(prev => ({
      ...prev,
      isLocked: true,
      currentScreen: 'lock',
      pin: ''
    }));
  }, []);

  const addPinDigit = useCallback((digit: string) => {
    setPhoneState(prev => {
      if (prev.pin.length >= 4) return prev;
      
      const newPin = prev.pin + digit;
      
      // Check against custom PIN or default
      const customPin = localStorage.getItem('phone-custom-pin') || '1234';
      if (newPin.length === 4 && newPin === customPin) {
        setTimeout(() => {
          unlock();
        }, 200);
      }
      
      return {
        ...prev,
        pin: newPin
      };
    });
  }, [unlock]);

  const deletePinDigit = useCallback(() => {
    setPhoneState(prev => ({
      ...prev,
      pin: prev.pin.slice(0, -1)
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPhoneState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  return {
    phoneState,
    navigateToScreen,
    goBack,
    unlock,
    lock,
    addPinDigit,
    deletePinDigit,
    toggleTheme
  };
};
