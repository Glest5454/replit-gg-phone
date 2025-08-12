import { ArrowLeft, Search, Moon, Sun, Volume2, Smartphone, MapPin, Shield, HardDrive, Info, ChevronRight, Globe, Check, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useNotifications } from '@/utils/notifications';

interface SettingsAppProps {
  onBack: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  setWallpaper: (wallpaper: string) => void;
  setBrightness: (brightness: number) => void;
}

export const SettingsApp = ({ onBack, onToggleTheme, theme, setWallpaper, setBrightness }: SettingsAppProps) => {
  const { language, setLanguage: setAppLanguage, t } = useLanguage();
  const { showInfo, showSuccess, showWarning, showError, showMessageNotification, showCallNotification } = useNotifications();
  const [brightness, setBrightnessLocal] = useState(75);
  const [wallpaper, setWallpaperLocal] = useState('default');
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [customPin, setCustomPin] = useState('');
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [newPin, setNewPin] = useState('');

  const languages = [
    { code: 'english' as Language, name: 'English', label: 'English' },
    { code: 'turkish' as Language, name: 'Türkçe', label: 'Turkish' },
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
    const savedWallpaper = localStorage.getItem('phone-wallpaper');
    const savedLockEnabled = localStorage.getItem('phone-lock-enabled');
    const savedCustomPin = localStorage.getItem('phone-custom-pin');
    const savedLanguage = localStorage.getItem('phone-language');
    
    if (savedBrightness) setBrightnessLocal(parseInt(savedBrightness));
    if (savedWallpaper) setWallpaperLocal(savedWallpaper);
    if (savedLockEnabled) setIsLockEnabled(savedLockEnabled === 'true');
    if (savedCustomPin) setCustomPin(savedCustomPin);
    if (savedLanguage) setAppLanguage(savedLanguage as Language);
  }, [setAppLanguage]);

  const handleBrightnessChange = (value: number) => {
    setBrightnessLocal(value);
    setBrightness(value); // This will save to localStorage via usePhone hook
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setAppLanguage(newLanguage);
    localStorage.setItem('phone-language', newLanguage);
    setShowLanguageSelector(false);
  };

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaperLocal(newWallpaper);
    setWallpaper(newWallpaper); // This will save to localStorage via usePhone hook
    setShowWallpaperSelector(false);
  };

  const handleThemeToggle = () => {
    onToggleTheme();
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

  // Test notification functions
  const testNotifications = () => {
    showInfo('Test Info', 'This is an info notification', 'system', { duration: 3000 }); // 3 saniye
   /* setTimeout(() => showSuccess('Test Success', 'Operation completed successfully', 'banking', { duration: 4000 }), 1000); // 4 saniye
    setTimeout(() => showWarning('Test Warning', 'Please check your settings', 'settings', { duration: 5000 }), 2000); // 5 saniye
    setTimeout(() => showError('Test Error', 'Something went wrong', 'system', { duration: 6000 }), 3000); // 6 saniye
    setTimeout(() => showMessageNotification('John Doe', 'Hey, are you online?', { duration: 7000 }), 4000); // 7 saniye
    setTimeout(() => showCallNotification('Jane Smith', { duration: 8000 }), 5000); // 8 saniye*/
  };

  return (
    <div className="absolute inset-0 settings-background flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="settings-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">{t('settings', 'common')}</h1>
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
          
          {/* Notification Testing Section */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Notification Testing</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={testNotifications}
              data-testid="test-notifications"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Test All Notifications</span>
              </div>
              <span className="text-white/60">Tap to test</span>
            </button>
          </div>
          
          {/* Display Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">{t('display', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={handleThemeToggle}
              data-testid="toggle-theme"
            >
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('darkMode', 'settings')}</span>
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
                <span className="text-white">{t('brightness', 'settings')}</span>
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
                <span className="text-white">{t('language', 'settings')}</span>
              </div>
              <span className="text-white/60">{languages.find(l => l.code === language)?.name || 'English'}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="p-2 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`oneui-button w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                      language === lang.code 
                        ? 'bg-samsung-blue text-white' 
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                    data-testid={`language-${lang.code}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lang.name}</span>
                      {language === lang.code && <Check className="w-4 h-4 text-white" />}
                    </div>
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
                <span className="text-white">{t('wallpaper', 'settings')}</span>
              </div>
              <span className="text-white/60">{wallpapers.find(w => w.id === wallpaper)?.name || 'Default'}</span>
            </button>
            
            {showWallpaperSelector && (
              <div className="p-2 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8">
                {/* Custom URL Input */}
                <div className="mb-3">
                  <div className="text-white text-sm mb-2">Custom Image URL:</div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.startsWith('http')) {
                            handleWallpaperChange(input.value);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      className="bg-samsung-blue text-white px-3 py-2 rounded-lg text-sm hover:bg-samsung-blue/90 transition-colors"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input.value.startsWith('http')) {
                          handleWallpaperChange(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Set
                    </button>
                  </div>
                </div>
                
                {/* Predefined Wallpapers */}
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
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">{t('securityPrivacy', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              onClick={handleLockToggle}
              data-testid="lock-screen-toggle"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-sm bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <span className="text-white">{t('screenLock', 'settings')}</span>
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
                  <span className="text-white">{t('changePIN', 'settings')}</span>
                </div>
                <span className="text-white/60">{customPin ? '••••' : t('setPIN', 'settings')}</span>
              </button>
            )}
            
            {showPasswordSettings && (
              <div className="p-4 bg-surface-dark/20 rounded-samsung-sm mb-3 ml-8">
                <div className="text-center text-white mb-4">
                  <div className="text-sm opacity-80">{t('enterNewPIN', 'settings')}</div>
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
