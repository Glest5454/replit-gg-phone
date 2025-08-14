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
  | 'contacts'
  | 'messages'
  | 'mail'
  | 'darkchat'
  | 'maps'
  | 'garage'
  | 'browser'
  | 'apps'
  | 'test'
  | 'phone'
  | 'wallpaper';

export interface PhoneState {
  currentScreen: Screen;
  isLocked: boolean;
  pin: string;
  notifications: Notification[];
  theme: 'light' | 'dark';
  wallpaper: string;
  brightness: number;
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
    // Load all saved settings from localStorage
    const isLockEnabled = localStorage.getItem('phone-lock-enabled') === 'true';
    const savedCustomPin = localStorage.getItem('phone-custom-pin');
    const savedTheme = localStorage.getItem('phone-theme') as 'light' | 'dark' | null;
    const savedWallpaper = localStorage.getItem('phone-wallpaper') || 'default';
    const savedBrightness = localStorage.getItem('phone-brightness');
    
    // Only activate lock screen if both lock is enabled AND a PIN is saved
    const shouldShowLockScreen = isLockEnabled && savedCustomPin && savedCustomPin.length === 4;
    
    return {
      currentScreen: shouldShowLockScreen ? 'lock' : 'home',
      isLocked: Boolean(shouldShowLockScreen),
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
      theme: savedTheme || 'dark',
      wallpaper: savedWallpaper,
      brightness: savedBrightness ? parseInt(savedBrightness) : 75
    };
  });
  
  const navigateToScreen = useCallback((screen: Screen) => {
    setPhoneState(prev => ({
      ...prev,
      currentScreen: screen
    }));

  }, []);

  const goBack = useCallback(() => {
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    if (phoneScreen) {
      phoneScreen.classList.add('sliding-in');
    }
    setTimeout(() => {
      phoneScreen?.classList.remove('sliding-in');
    }, 500);
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
    // Only lock if both conditions are met: lock enabled AND PIN is saved
    const isLockEnabled = localStorage.getItem('phone-lock-enabled') === 'true';
    const savedCustomPin = localStorage.getItem('phone-custom-pin');
    const shouldShowLockScreen = isLockEnabled && savedCustomPin && savedCustomPin.length === 4;
    
    if (!shouldShowLockScreen) {
      // If conditions aren't met, just go to home screen
      setPhoneState(prev => ({
        ...prev,
        isLocked: false,
        currentScreen: 'home',
        pin: ''
      }));
      return false; // Return false to indicate lock failed
    }
    
    setPhoneState(prev => ({
      ...prev,
      isLocked: true,
      currentScreen: 'lock',
      pin: ''
    }));
    return true; // Return true to indicate lock succeeded
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
    setPhoneState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('phone-theme', newTheme);
      return {
        ...prev,
        theme: newTheme
      };
    });
  }, []);

  const setWallpaper = useCallback((wallpaper: string) => {
    setPhoneState(prev => {
      // Save to localStorage
      localStorage.setItem('phone-wallpaper', wallpaper);
      return {
        ...prev,
        wallpaper
      };
    });
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    setPhoneState(prev => {
      // Save to localStorage
      localStorage.setItem('phone-brightness', brightness.toString());
      return {
        ...prev,
        brightness
      };
    });
  }, []);

  // Function to check if lock screen should be active
  const shouldShowLockScreen = useCallback(() => {
    const isLockEnabled = localStorage.getItem('phone-lock-enabled') === 'true';
    const savedCustomPin = localStorage.getItem('phone-custom-pin');
    return isLockEnabled && savedCustomPin && savedCustomPin.length === 4;
  }, []);

  // Function to refresh lock screen state based on current settings
  const refreshLockScreenState = useCallback(() => {
    const shouldShow = shouldShowLockScreen();
    
    setPhoneState(prev => {
      // If we should show lock screen but we're not locked, lock the phone
      if (shouldShow && !prev.isLocked) {
        return {
          ...prev,
          isLocked: true,
          currentScreen: 'lock',
          pin: ''
        };
      }
      // If we shouldn't show lock screen but we are locked, unlock the phone
      else if (!shouldShow && prev.isLocked) {
        return {
          ...prev,
          isLocked: false,
          currentScreen: 'home',
          pin: ''
        };
      }
      // Otherwise, keep current state
      return prev;
    });
  }, [shouldShowLockScreen]);

  // Monitor localStorage changes for lock settings
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'phone-lock-enabled' || e.key === 'phone-custom-pin') {
        refreshLockScreenState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshLockScreenState]);

  return {
    phoneState,
    navigateToScreen,
    goBack,
    unlock,
    lock,
    addPinDigit,
    deletePinDigit,
    toggleTheme,
    setWallpaper,
    setBrightness,
    shouldShowLockScreen,
    refreshLockScreenState
  };
};
