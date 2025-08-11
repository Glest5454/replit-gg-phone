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
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  useEffect(() => {
    const savedBrightness = localStorage.getItem('phone-brightness');
    const savedLanguage = localStorage.getItem('phone-language');
    
    if (savedBrightness) setBrightness(parseInt(savedBrightness));
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    localStorage.setItem('phone-brightness', value.toString());
    // Apply brightness effect to the phone screen
    const screen = document.querySelector('.screen-content') as HTMLElement;
    if (screen) {
      screen.style.filter = `brightness(${value}%)`;
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('phone-language', newLanguage);
    setShowLanguageSelector(false);
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
              onClick={onToggleTheme}
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
