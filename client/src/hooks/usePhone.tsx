import { useState, useEffect, useCallback } from 'react';
import { NUIManager } from '../utils/nui';

export const usePhone = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isLockEnabled, setIsLockEnabled] = useState(true);
  const [customPin, setCustomPin] = useState('1234');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [wallpaper, setWallpaper] = useState('default');
  const [brightness, setBrightness] = useState(70);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from metadata on component mount
  useEffect(() => {
    loadSettingsFromMetadata();
  }, []);

  const loadSettingsFromMetadata = async () => {
    try {
      setIsLoading(true);
      
      // Load lock settings from metadata
      NUIManager.post('getPhoneLockSettings', {});
      // For now, use default values since we don't have response handling
      // In a real implementation, you'd need to set up proper event handling

      // Load theme settings from metadata
      NUIManager.post('getPhoneTheme', {});
      // For now, use default values since we don't have response handling

      // Load wallpaper from metadata
      NUIManager.post('getPhoneWallpaper', {});
      // For now, use default values since we don't have response handling

      // Load brightness from metadata
      NUIManager.post('getPhoneBrightness', {});
      // For now, use default values since we don't have response handling

    } catch (error) {
      console.error('Failed to load settings from metadata:', error);
      // Fallback to default values
    } finally {
      setIsLoading(false);
    }
  };

  const unlockPhone = useCallback(async (pin: string) => {
    try {
      const savedPin = customPin;
      if (pin === savedPin) {
        setIsLocked(false);
        return { success: true, message: 'Phone unlocked successfully' };
      } else {
        return { success: false, message: 'Incorrect PIN' };
      }
    } catch (error) {
      console.error('Error unlocking phone:', error);
      return { success: false, message: 'Error unlocking phone' };
    }
  }, [customPin]);

  const lockPhone = useCallback(async () => {
    try {
      setIsLocked(true);
      return { success: true, message: 'Phone locked successfully' };
    } catch (error) {
      console.error('Error locking phone:', error);
      return { success: false, message: 'Error locking phone' };
    }
  }, []);

  const updateTheme = useCallback(async (newTheme: 'light' | 'dark') => {
    try {
      setTheme(newTheme);
      
      // Save theme to metadata
      NUIManager.post('savePhoneTheme', { theme: newTheme });
      
      return { success: true, message: 'Theme updated successfully' };
    } catch (error) {
      console.error('Error updating theme:', error);
      return { success: false, message: 'Error updating theme' };
    }
  }, []);

  const updateWallpaper = useCallback(async (newWallpaper: string) => {
    try {
      setWallpaper(newWallpaper);
      
      // Save wallpaper to metadata
      NUIManager.post('savePhoneWallpaper', { wallpaper: newWallpaper });
      
      return { success: true, message: 'Wallpaper updated successfully' };
    } catch (error) {
      console.error('Error updating wallpaper:', error);
      return { success: false, message: 'Error updating wallpaper' };
    }
  }, []);

  const updateBrightness = useCallback(async (newBrightness: number) => {
    try {
      setBrightness(newBrightness);
      
      // Save brightness to metadata
      NUIManager.post('savePhoneBrightness', { brightness: newBrightness });
      
      return { success: true, message: 'Brightness updated successfully' };
    } catch (error) {
      console.error('Error updating brightness:', error);
      return { success: false, message: 'Error updating brightness' };
    }
  }, []);

  const updateLockSettings = useCallback(async (enabled: boolean, pin?: string) => {
    try {
      setIsLockEnabled(enabled);
      if (pin) {
        setCustomPin(pin);
      }
      
      // Save lock settings to metadata
      NUIManager.post('savePhoneLockSettings', { 
        lockEnabled: enabled, 
        customPin: pin || customPin 
      });
      
      return { success: true, message: 'Lock settings updated successfully' };
    } catch (error) {
      console.error('Error updating lock settings:', error);
      return { success: false, message: 'Error updating lock settings' };
    }
  }, [customPin]);

  const getLockStatus = useCallback(async () => {
    try {
      NUIManager.post('getPhoneLockSettings', {});
      // For now, use default values since we don't have response handling
      // In a real implementation, you'd need to set up proper event handling
      return { enabled: true, customPin: '1234' };
    } catch (error) {
      console.error('Error getting lock status:', error);
      return { enabled: true, customPin: '1234' };
    }
  }, []);

  // Monitor metadata changes for lock settings
  useEffect(() => {
    const checkLockSettings = async () => {
      await getLockStatus();
    };

    // Check lock settings periodically
    const interval = setInterval(checkLockSettings, 5000);
    return () => clearInterval(interval);
  }, [getLockStatus]);

  // Phone state management
  const [currentScreen, setCurrentScreen] = useState<'lock' | 'home' | 'settings' | 'settings2' | 'banking' | 'twitter' | 'calculator' | 'camera' | 'gallery' | 'notes' | 'spotify' | 'clock' | 'yellowpages' | 'contacts' | 'messages' | 'mail' | 'darkchat' | 'maps' | 'garage' | 'browser' | 'apps' | 'phone' | 'test' | 'wallpaper'>('lock');
  const [pin, setPin] = useState('');

  // Navigation functions
  const navigateToScreen = useCallback((screen: typeof currentScreen) => {
    setCurrentScreen(screen);
  }, []);

  const goBack = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  // PIN management
  const addPinDigit = useCallback((digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      // Check if PIN is complete and correct
      if (newPin.length === 4) {
        if (newPin === customPin) {
          // Correct PIN - unlock phone
          setIsLocked(false);
          setCurrentScreen('home');
          setPin('');
        } else {
          // Wrong PIN - clear and show error
          setPin('');
          // You can add error handling here
        }
      }
    }
  }, [pin, customPin]);

  const deletePinDigit = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  }, [theme, updateTheme]);

  // Refresh lock screen state
  const refreshLockScreenState = useCallback(() => {
    // This function can be used to refresh the lock screen state
    // For now, it just ensures the phone is locked if it should be
    if (isLockEnabled && customPin) {
      setIsLocked(true);
      setCurrentScreen('lock');
    }
  }, [isLockEnabled, customPin]);

  // Phone state object for compatibility
  const phoneState = {
    currentScreen,
    isLocked,
    pin,
    theme,
    wallpaper,
    brightness,
    notifications: [] // Empty notifications array for compatibility
  };

  return {
    // State
    phoneState,
    isLocked,
    isLockEnabled,
    customPin,
    theme,
    wallpaper,
    brightness,
    isLoading,
    
    // Functions
    unlockPhone,
    lockPhone,
    updateTheme,
    updateWallpaper,
    updateBrightness,
    updateLockSettings,
    getLockStatus,
    loadSettingsFromMetadata,
    
    // Navigation
    navigateToScreen,
    goBack,
    addPinDigit,
    deletePinDigit,
    toggleTheme,
    setWallpaper: updateWallpaper,
    setBrightness: updateBrightness,
    refreshLockScreenState
  };
};
