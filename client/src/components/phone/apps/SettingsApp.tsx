import { ArrowLeft, Search, Moon, Sun, Volume2, Smartphone, MapPin, Shield, HardDrive, Info, ChevronRight, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsAppProps {
  onBack: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const SettingsApp = ({ onBack, onToggleTheme, theme }: SettingsAppProps) => {
  const [brightness, setBrightness] = useState(75);
  const [language, setLanguage] = useState('English');
  const [wallpaper, setWallpaper] = useState('default');
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [customPin, setCustomPin] = useState('');
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [newPin, setNewPin] = useState('');

  const languages = [
    { code: 'en', name: 'English', label: 'English' },
    { code: 'tr', name: 'Türkçe', label: 'Turkish' },
    { code: 'es', name: 'Español', label: 'Spanish' },
    { code: 'fr', name: 'Français', label: 'French' },
    { code: 'de', name: 'Deutsch', label: 'German' },
    { code: 'zh', name: '中文', label: 'Chinese' },
    { code: 'ja', name: '日本語', label: 'Japanese' },
  ];

  const wallpapers = [
    { id: 'default', name: 'Default Blue', preview: 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800' },
    { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600' },
    { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600' },
    { id: 'forest', name: 'Forest', preview: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500' },
    { id: 'space', name: 'Space', preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black' },
    { id: 'aurora', name: 'Aurora', preview: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600' },
  ];

  useEffect(() => {
    const savedBrightness = localStorage.getItem('phone-brightness');
    const savedLanguage = localStorage.getItem('phone-language');
    const savedWallpaper = localStorage.getItem('phone-wallpaper');
    const savedLockEnabled = localStorage.getItem('phone-lock-enabled');
    const savedCustomPin = localStorage.getItem('phone-custom-pin');
    
    if (savedBrightness) setBrightness(parseInt(savedBrightness));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedWallpaper) setWallpaper(savedWallpaper);
    if (savedLockEnabled) setIsLockEnabled(savedLockEnabled === 'true');
    if (savedCustomPin) setCustomPin(savedCustomPin);
  }, []);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    localStorage.setItem('phone-brightness', value.toString());
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    if (phoneScreen) {
      phoneScreen.style.filter = `brightness(${value}%)`;
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('phone-language', newLanguage);
    setShowLanguageSelector(false);
    
    // Apply language changes to the phone interface
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    if (phoneScreen) {
      phoneScreen.setAttribute('data-language', newLanguage.toLowerCase());
    }
  };

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('phone-wallpaper', newWallpaper);
    setShowWallpaperSelector(false);
    
    // Apply wallpaper changes
    const homeScreens = document.querySelectorAll('.home-screen-bg') as NodeListOf<HTMLElement>;
    homeScreens.forEach(screen => {
      const selectedWallpaper = wallpapers.find(w => w.id === newWallpaper);
      if (selectedWallpaper) {
        screen.className = `home-screen-bg h-full relative ${selectedWallpaper.preview}`;
      }
    });
  };

  const handleThemeToggle = () => {
    onToggleTheme();
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    if (phoneScreen) {
      if (theme === 'dark') {
        phoneScreen.classList.remove('phone-dark-mode');
        phoneScreen.classList.add('phone-light-mode');
      } else {
        phoneScreen.classList.remove('phone-light-mode');
        phoneScreen.classList.add('phone-dark-mode');
      }
    }
  };

  const handleLockToggle = () => {
    setIsLockEnabled(!isLockEnabled);
    localStorage.setItem('phone-lock-enabled', (!isLockEnabled).toString());
  };

  const handleSetCustomPin = () => {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      setCustomPin(newPin);
      localStorage.setItem('phone-custom-pin', newPin);
      setNewPin('');
      setShowPasswordSettings(false);
    }
  };

  const handlePinInput = (digit: string) => {
    if (newPin.length < 4) {
      setNewPin(newPin + digit);
    }
  };

  const handlePinDelete = () => {
    setNewPin(newPin.slice(0, -1));
  };
  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="settings-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Settings</h1>
        <button 
          className="oneui-button p-2"
          data-testid="settings-search"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-samsung-blue rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl">JD</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">John Doe</h3>
              <p className="text-white/60">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        {/* Settings Groups */}
        <div className="px-6 py-4">
          
          {/* Display Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Display</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={handleThemeToggle}
              data-testid="toggle-theme"
            >
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 relative transition-colors duration-200 ${
                theme === 'dark' ? 'bg-samsung-blue' : 'bg-white/20'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all duration-200 ${
                  theme === 'dark' ? 'right-1' : 'left-1'
                }`} />
              </div>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={() => setShowBrightnessSlider(!showBrightnessSlider)}
              data-testid="brightness-settings"
            >
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Brightness</span>
              </div>
              <span className="text-white/60">{brightness}%</span>
            </button>
            
            {showBrightnessSlider && (
              <div className="p-4 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none brightness-slider"
                  data-testid="brightness-slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              data-testid="language-settings"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Language</span>
              </div>
              <span className="text-white/60">{language}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="p-2 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`oneui-button w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                      language === lang.name 
                        ? 'bg-samsung-blue text-white' 
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => handleLanguageChange(lang.name)}
                    data-testid={`language-${lang.code}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={() => setShowWallpaperSelector(!showWallpaperSelector)}
              data-testid="wallpaper-settings"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20"></div>
                <span className="text-white">Wallpaper</span>
              </div>
              <span className="text-white/60">{wallpapers.find(w => w.id === wallpaper)?.name || 'Default'}</span>
            </button>
            
            {showWallpaperSelector && (
              <div className="p-2 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8">
                <div className="grid grid-cols-2 gap-3">
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      className={`oneui-button relative overflow-hidden rounded-lg transition-all ${
                        wallpaper === wp.id 
                          ? 'ring-2 ring-samsung-blue' 
                          : 'hover:ring-1 hover:ring-white/30'
                      }`}
                      onClick={() => handleWallpaperChange(wp.id)}
                      data-testid={`wallpaper-${wp.id}`}
                    >
                      <div className={`h-16 w-full ${wp.preview} flex items-center justify-center`}>
                        <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                          {wp.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Security & Privacy Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Security & Privacy</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={handleLockToggle}
              data-testid="lock-screen-toggle"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-sm bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <span className="text-white">Screen Lock</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 relative transition-colors duration-200 ${
                isLockEnabled ? 'bg-samsung-blue' : 'bg-white/20'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all duration-200 ${
                  isLockEnabled ? 'right-1' : 'left-1'
                }`} />
              </div>
            </button>
            
            {isLockEnabled && (
              <button 
                className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8"
                onClick={() => setShowPasswordSettings(!showPasswordSettings)}
                data-testid="password-settings"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-sm bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">🔑</span>
                  </div>
                  <span className="text-white">Change PIN</span>
                </div>
                <span className="text-white/60">{customPin ? '••••' : 'Set PIN'}</span>
              </button>
            )}
            
            {showPasswordSettings && (
              <div className="p-4 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8">
                <div className="text-center text-white mb-4">
                  <div className="text-sm opacity-80">Enter new 4-digit PIN</div>
                </div>
                
                {/* PIN Dots */}
                <div className="flex justify-center space-x-3 mb-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                        index < newPin.length 
                          ? 'bg-samsung-blue border-samsung-blue' 
                          : 'border-white/50'
                      }`}
                      data-testid={`new-pin-dot-${index}`}
                    />
                  ))}
                </div>
                
                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, index) => {
                    if (key === '') {
                      return <div key={index} />;
                    }
                    
                    if (key === 'delete') {
                      return (
                        <button
                          key={index}
                          className="oneui-button w-8 h-8 rounded-full bg-white/10 text-white text-xs flex items-center justify-center"
                          onClick={handlePinDelete}
                          data-testid="new-pin-delete"
                        >
                          ⌫
                        </button>
                      );
                    }
                    
                    return (
                      <button
                        key={index}
                        className="oneui-button w-8 h-8 rounded-full bg-white/10 text-white text-sm flex items-center justify-center"
                        onClick={() => handlePinInput(key)}
                        data-testid={`new-pin-${key}`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  className={`oneui-button w-full p-3 rounded-samsung-sm transition-all ${
                    newPin.length === 4 
                      ? 'bg-samsung-blue text-white' 
                      : 'bg-white/10 text-white/50'
                  }`}
                  onClick={handleSetCustomPin}
                  disabled={newPin.length !== 4}
                  data-testid="save-pin"
                >
                  Save PIN
                </button>
              </div>
            )}
          </div>
          
          {/* Sound Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Sound</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="sound-settings"
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Ringtone</span>
              </div>
              <span className="text-white/60">Default</span>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="vibration-settings"
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Vibration</span>
              </div>
              <div className="w-12 h-6 bg-samsung-blue rounded-full p-1 relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 transition-all duration-200" />
              </div>
            </button>
          </div>
          
          {/* Privacy Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Privacy</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="location-settings"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Location Services</span>
              </div>
              <div className="w-12 h-6 bg-white/20 rounded-full p-1 relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 transition-all duration-200" />
              </div>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="permission-settings"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">App Permissions</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
          
          {/* Phone Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Device</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="storage-settings"
            >
              <div className="flex items-center space-x-3">
                <HardDrive className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Storage</span>
              </div>
              <span className="text-white/60">12GB used</span>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="about-phone"
            >
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">About Phone</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
