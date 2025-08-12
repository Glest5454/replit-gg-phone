import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [brightness, setBrightness] = useState(75);
  const [language, setLanguage] = useState('English');
  const [wallpaper, setWallpaper] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('phone-theme') as 'light' | 'dark' | null;
    const savedBrightness = localStorage.getItem('phone-brightness');
    const savedLanguage = localStorage.getItem('phone-language');
    const savedWallpaper = localStorage.getItem('phone-wallpaper');
    const savedLightDarkMode = localStorage.getItem('phone-light-dark-mode');
    if (savedTheme) setTheme(savedTheme);
    if (savedBrightness) setBrightness(parseInt(savedBrightness));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedWallpaper) setWallpaper(savedWallpaper);
    if (savedLightDarkMode) {
      const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
      if (phoneScreen) {
        phoneScreen.classList.add(savedLightDarkMode === 'light' ? 'phone-light-mode' : 'phone-dark-mode');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phone-theme', theme);
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    
    if (phoneScreen) {
      if (theme === 'dark') {
        phoneScreen.classList.add('phone-dark-mode');
        phoneScreen.classList.remove('phone-light-mode');
      } else {
        phoneScreen.classList.add('phone-light-mode');
        phoneScreen.classList.remove('phone-dark-mode');
      }
    }
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('phone-brightness', brightness.toString());
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    if (phoneScreen) {
      phoneScreen.style.filter = `brightness(${brightness}%)`;
    }
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('phone-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('phone-wallpaper', wallpaper);
  }, [wallpaper]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { 
    theme, 
    toggleTheme, 
    brightness, 
    setBrightness, 
    language, 
    setLanguage,
    wallpaper,
    setWallpaper
  };
};
