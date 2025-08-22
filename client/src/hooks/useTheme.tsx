import { useState, useEffect } from 'react';
import { NUIManager } from '../utils/nui';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [brightness, setBrightness] = useState(70);
  const [language, setLanguage] = useState('en');
  const [wallpaper, setWallpaper] = useState('default');
  const [lightDarkMode, setLightDarkMode] = useState<'light' | 'dark' | 'auto'>('auto');

  // Load settings from metadata on component mount
  useEffect(() => {
    loadSettingsFromMetadata();
  }, []);

  const loadSettingsFromMetadata = async () => {
    try {
      // Get phone settings from metadata
      NUIManager.post('getPhoneSettings', {});
      // For now, use default values since we don't have response handling
      // In a real implementation, you'd need to set up proper event handling
    } catch (error) {
      console.error('Failed to load settings from metadata:', error);
      // Fallback to default values
    }
  };

  const updateTheme = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    
    try {
      // Save theme to metadata
      NUIManager.post('savePhoneTheme', { theme: newTheme });
    } catch (error) {
      console.error('Failed to save theme to metadata:', error);
    }
  };

  const updateBrightness = async (value: number) => {
    setBrightness(value);
    
    try {
      // Save brightness to metadata
      NUIManager.post('savePhoneBrightness', { brightness: value });
    } catch (error) {
      console.error('Failed to save brightness to metadata:', error);
    }
  };

  const updateLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage);
    
    try {
      // Save language to metadata
      NUIManager.post('savePhoneLanguage', { language: newLanguage });
    } catch (error) {
      console.error('Failed to save language to metadata:', error);
    }
  };

  const updateWallpaper = async (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    
    try {
      // Save wallpaper to metadata
      NUIManager.post('savePhoneWallpaper', { wallpaper: newWallpaper });
    } catch (error) {
      console.error('Failed to save wallpaper to metadata:', error);
    }
  };

  const updateLightDarkMode = async (mode: 'light' | 'dark' | 'auto') => {
    setLightDarkMode(mode);
    
    try {
      // Save light/dark mode to metadata
      NUIManager.post('savePhoneSettings', { 
        settings: { 
          ...{ theme, brightness, language, wallpaper, lightDarkMode: mode } 
        } 
      });
    } catch (error) {
      console.error('Failed to save light/dark mode to metadata:', error);
    }
  };

  return {
    theme,
    brightness,
    language,
    wallpaper,
    lightDarkMode,
    updateTheme,
    updateBrightness,
    updateLanguage,
    updateWallpaper,
    updateLightDarkMode,
    loadSettingsFromMetadata
  };
};
