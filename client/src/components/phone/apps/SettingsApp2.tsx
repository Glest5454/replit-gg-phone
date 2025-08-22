import { ArrowLeft, Search, Moon, Sun, Volume2, Smartphone, MapPin, Shield, HardDrive, Info, ChevronRight, Globe, Check, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useNotifications } from '@/utils/notifications';
import { NUIManager } from '@/utils/nui';

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

interface SettingsApp2Props {
  onBack: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  setWallpaper: (wallpaper: string) => void;
  setBrightness: (brightness: number) => void;
  playerData?: {
    phoneNumber?: string;
    playerName?: string;
  };
  refreshLockScreenState?: () => void;
  onNavigate?: (appName: Screen) => void;
}

export const SettingsApp2 = ({ onBack, onToggleTheme, theme, setWallpaper, setBrightness, playerData, refreshLockScreenState, onNavigate }: SettingsApp2Props) => {
  const { language, setLanguage: setAppLanguage, t } = useLanguage();
  const { showDefault, showInfo, showSuccess, showWarning, showError, showMessageNotification, showCallNotification, showTwitterNotification } = useNotifications();
  
  // State variables for settings
  const [brightness, setBrightnessLocal] = useState(75);
  const [wallpaper, setWallpaperLocal] = useState('default');
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [customPin, setCustomPin] = useState('');
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // Load settings from metadata on component mount
  useEffect(() => {
    loadSettingsFromMetadata();
  }, []);

  // Setup event listeners for metadata responses
  useEffect(() => {
    // Event listener for phone settings loaded
    const handlePhoneSettingsLoaded = (data: any) => {
      if (data.settings) {
        const settings = data.settings;
        if (settings.brightness !== undefined) setBrightnessLocal(settings.brightness);
        if (settings.wallpaper !== undefined) setWallpaperLocal(settings.wallpaper);
        if (settings.language !== undefined) setAppLanguage(settings.language as Language);
      }
      setIsLoading(false);
    };

    // Event listener for lock settings loaded
    const handleLockSettingsLoaded = (data: any) => {
      if (data.lockSettings) {
        const lockSettings = data.lockSettings;
        setIsLockEnabled(lockSettings.enabled || false);
        setCustomPin(lockSettings.customPin || '');
      }
    };

    // Event listener for settings saved
    const handleSettingsSaved = () => {
      setIsSaving(false);
      showSuccess('Settings Saved', 'Your settings have been saved successfully.', 'settings');
    };

    // Event listener for settings save error
    const handleSettingsError = (data: any) => {
      setIsSaving(false);
      showError('Save Error', data.error || 'Failed to save settings.', 'settings');
    };

    // Register NUI callbacks
    NUIManager.registerCallback('phoneSettingsLoaded', handlePhoneSettingsLoaded);
    NUIManager.registerCallback('phoneLockSettingsLoaded', handleLockSettingsLoaded);
    NUIManager.registerCallback('phoneSettingsSaved', handleSettingsSaved);
    NUIManager.registerCallback('phoneSettingsError', handleSettingsError);
    NUIManager.registerCallback('phoneLockSettingsSaved', handleSettingsSaved);
    NUIManager.registerCallback('phoneThemeSaved', handleSettingsSaved);
    NUIManager.registerCallback('phoneWallpaperSaved', handleSettingsSaved);
    NUIManager.registerCallback('phoneBrightnessSaved', handleSettingsSaved);
    NUIManager.registerCallback('phoneLanguageSaved', handleSettingsSaved);

    // Cleanup event listeners on unmount
    return () => {
      NUIManager.removeCallback('phoneSettingsLoaded', handlePhoneSettingsLoaded);
      NUIManager.removeCallback('phoneLockSettingsLoaded', handleLockSettingsLoaded);
      NUIManager.removeCallback('phoneSettingsSaved', handleSettingsSaved);
      NUIManager.removeCallback('phoneSettingsError', handleSettingsError);
      NUIManager.removeCallback('phoneLockSettingsSaved', handleSettingsSaved);
      NUIManager.removeCallback('phoneThemeSaved', handleSettingsSaved);
      NUIManager.removeCallback('phoneWallpaperSaved', handleSettingsSaved);
      NUIManager.removeCallback('phoneBrightnessSaved', handleSettingsSaved);
      NUIManager.removeCallback('phoneLanguageSaved', handleSettingsSaved);
    };
  }, [setAppLanguage, showSuccess, showError]);

  const loadSettingsFromMetadata = async () => {
    try {
      setIsLoading(true);
      
      // Request phone settings from metadata
      NUIManager.post('getPhoneSettings', {});
      
      // Request lock settings from metadata
      NUIManager.post('getPhoneLockSettings', {});
      
    } catch (error) {
      console.error('Failed to load settings from metadata:', error);
      setIsLoading(false);
      showError('Load Error', 'Failed to load settings from server.', 'settings');
    }
  };

  const saveSettingsToMetadata = async (settingsData: any) => {
    try {
      setIsSaving(true);
      
      // Save phone settings to metadata
      NUIManager.post('savePhoneSettings', { settings: settingsData });
      
    } catch (error) {
      console.error('Failed to save settings to metadata:', error);
      setIsSaving(false);
      showError('Save Error', 'Failed to save settings to server.', 'settings');
    }
  };

  const handleBrightnessChange = (value: number) => {
    setBrightnessLocal(value);
    setBrightness(value); // Update parent component state
    
    // Save brightness to metadata
    NUIManager.post('savePhoneBrightness', { brightness: value });
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setAppLanguage(newLanguage);
    setShowLanguageSelector(false);
    
    // Save language to metadata
    NUIManager.post('savePhoneLanguage', { language: newLanguage });
  };

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaperLocal(newWallpaper);
    setWallpaper(newWallpaper); // Update parent component state
    setShowWallpaperSelector(false);
    
    // Save wallpaper to metadata
    NUIManager.post('savePhoneWallpaper', { wallpaper: newWallpaper });
  };

  const handleThemeToggle = () => {
    onToggleTheme();
    
    // Save theme to metadata
    const newTheme = theme === 'light' ? 'dark' : 'light';
    NUIManager.post('savePhoneTheme', { theme: newTheme });
  };

  const handleLockToggle = () => {
    const newLockState = !isLockEnabled;
    setIsLockEnabled(newLockState);
    
    // If disabling lock, also clear the PIN
    if (!newLockState) {
      setCustomPin('');
    }
    
    // Save lock settings to metadata
    NUIManager.post('savePhoneLockSettings', { 
      lockEnabled: newLockState, 
      customPin: newLockState ? customPin : '' 
    });
    
    // Refresh lock screen state after changing the setting
    if (refreshLockScreenState) {
      refreshLockScreenState();
    }
  };

  const handleSetCustomPin = () => {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      setCustomPin(newPin);
      setNewPin('');
      setShowPasswordSettings(false);
      
      // Save lock settings to metadata
      NUIManager.post('savePhoneLockSettings', { 
        lockEnabled: isLockEnabled, 
        customPin: newPin 
      });
      
      // Show success message
      showSuccess('PIN Saved', 'Your PIN has been saved successfully. The lock screen is now active.', 'settings');
      
      // Refresh lock screen state after setting the PIN
      if (refreshLockScreenState) {
        refreshLockScreenState();
      }
    } else {
      showError('Invalid PIN', 'PIN must be exactly 4 digits (0-9).', 'settings');
    }
  };

  const handleClearPin = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to clear your PIN? This will disable the lock screen.')) {
      setCustomPin('');
      
      // Save lock settings to metadata
      NUIManager.post('savePhoneLockSettings', { 
        lockEnabled: false, 
        customPin: '' 
      });
      
      // Update local state
      setIsLockEnabled(false);
      
      // Show success message
      showSuccess('PIN Cleared', 'Your PIN has been cleared. The lock screen is now disabled.', 'settings');
      
      // Refresh lock screen state after clearing the PIN
      if (refreshLockScreenState) {
        refreshLockScreenState();
      }
    }
  };

  const handleTestLock = () => {
    if (isLockEnabled && customPin) {
      // Try to lock the phone
      if (refreshLockScreenState) {
        refreshLockScreenState();
      }
      showSuccess('Lock Test', 'Phone locked successfully!', 'settings');
    } else if (isLockEnabled && !customPin) {
      showWarning('Lock Test', 'Screen lock is enabled but no PIN is set. Please set a PIN first.', 'settings');
    } else {
      showInfo('Lock Test', 'Screen lock is disabled. Enable it and set a PIN to test locking.', 'settings');
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
    showDefault('Test Default', 'This is a default notification', 'system', { duration: 3000 });
    showInfo('Test Info', 'This is an info notification', 'system', { duration: 3000 });
    showSuccess('Test Success', 'Operation completed successfully', 'banking', { duration: 4000 });
    showWarning('Test Warning', 'Please check your settings', 'settings', { duration: 5000 });
    showError('Test Error', 'Something went wrong', 'system', { duration: 6000 });
    showMessageNotification('John Doe', 'Hey, are you online?', { duration: 7000 });
    showCallNotification('Jane Smith', { duration: 8000 });
  };

  const testNotifications2 = () => {
    showSuccess('Test Success', 'Operation completed successfully', 'banking', { duration: 5000 });
    showInfo('Test Info', 'This is an info notification', 'system', { duration: 5000 });
    showWarning('Test Warning', 'Please check your settings', 'settings', { duration: 5000 });
    showError('Test Error', 'Something went wrong', 'system', { duration: 5000 });
    showMessageNotification('John Doe', 'Hey, are you online?', { duration: 5000 });
    showCallNotification('Jane Smith', { duration: 5000 });
    showTwitterNotification('John Doe', 'Hey, are you online?', { duration: 5000 });
    showDefault('Test Default', 'This is a default notification', 'system', { duration: 5000 });
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 settings-background flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-samsung-blue mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-white text-lg font-semibold">{t('settings', 'common')} (Metadata)</h1>
        <button 
          className="oneui-button p-2"
          data-testid="settings-search"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Loading overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-dark p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-samsung-blue mx-auto mb-4"></div>
            <p className="text-white">Saving settings...</p>
          </div>
        </div>
      )}
      
      {/* Settings List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-samsung-blue rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {playerData?.playerName ? playerData.playerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD'}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {playerData?.playerName || 'John Doe'}
              </h3>
              <p className="text-white/60">
                {playerData?.phoneNumber || '+1 (555) 123-4567'}
              </p>
              <p className="text-xs text-green-400 mt-1">
                ✓ Metadata System Active
              </p>
            </div>
          </div>
        </div>
        
        {/* Settings Groups */}
        <div className="px-4 py-3">
          
          {/* Notification Testing Section */}
          <div className="mb-4">
            <h4 className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wide">Notification Testing</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-3 bg-surface-dark/30 rounded-samsung-sm mb-2"
              onClick={testNotifications2}
              data-testid="test-notifications"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-samsung-blue" />
                <span className="text-white text-sm">Test All Notifications</span>
              </div>
              <span className="text-white/60 text-xs">Tap to test</span>
            </button>
          </div>
          
          {/* Display Settings */}
          <div className="mb-4">
            <h4 className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wide">{t('display', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-2"
              onClick={handleThemeToggle}
              data-testid="toggle-theme"
            >
              <div className="flex items-center space-x-3">
                <Moon className="w-4 h-4 text-samsung-blue" />
                <span className="text-white text-sm">{t('darkMode', 'settings')}</span>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 relative transition-colors duration-200 ${
                theme === 'dark' ? 'bg-samsung-blue' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute transition-all duration-200 ${
                  theme === 'dark' ? 'right-1' : 'left-1'
                }`} />
              </div>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-2"
              onClick={() => setShowBrightnessSlider(!showBrightnessSlider)}
              data-testid="brightness-settings"
            >
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-samsung-blue" />
                <span className="text-white text-sm">{t('brightness', 'settings')}</span>
              </div>
              <span className="text-white/60 text-xs">{brightness}%</span>
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
              onClick={() => onNavigate?.('wallpaper')}
              data-testid="wallpaper-settings"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20"></div>
                <span className="text-white">{t('wallpaper', 'settings')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/60">{wallpapers.find(w => w.id === wallpaper)?.name || 'Default'}</span>
                <span className="text-white/40">→</span>
              </div>
            </button>
            
            {showWallpaperSelector && (
              <div className="p-2 bg-surface-dark/20 rounded-samsung-sm mb-2">
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
            
            {/* Status indicator */}
            <div className="mb-2">
              <div className={`text-xs px-3 py-2 rounded-lg ${
                isLockEnabled && customPin 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : isLockEnabled 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {isLockEnabled && customPin 
                  ? '🔒 Lock screen active - Phone is locked (Saved to Metadata)'
                  : isLockEnabled 
                    ? '⚠️ Screen lock enabled but no PIN set - Phone will not lock'
                    : '🔓 Screen lock disabled - Phone is unlocked'
                }
              </div>
            </div>
            
            {isLockEnabled && (
              <button 
                className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/20 rounded-samsung-sm mb-2"
                onClick={() => setShowPasswordSettings(!showPasswordSettings)}
                data-testid="password-settings"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-sm bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">🔑</span>
                  </div>
                  <span className="text-white">{customPin ? t('changePIN', 'settings') : t('setPIN', 'settings')}</span>
                </div>
                <span className="text-white/60">{customPin ? '••••' : t('setPIN', 'settings')}</span>
              </button>
            )}

            {isLockEnabled && showPasswordSettings && (
              <div className="p-4 bg-surface-dark/20 rounded-samsung-sm mb-2">
                <div className="text-center text-white mb-4">
                  <div className="text-sm opacity-80">
                    {customPin ? t('enterNewPIN', 'settings') : t('enterNewPIN', 'settings')}
                  </div>
                  {customPin && (
                    <div className="text-xs opacity-60 mt-1">
                      Current PIN: •••• (Stored in Metadata)
                    </div>
                  )}
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
                  {customPin ? 'Update PIN' : 'Save PIN'} (To Metadata)
                </button>
                {customPin && (
                  <button
                    className="oneui-button w-full p-3 rounded-samsung-sm transition-all bg-red-500 text-white mt-2"
                    onClick={handleClearPin}
                    data-testid="clear-pin"
                  >
                    Clear PIN (From Metadata)
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Sound Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">{t('sound', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="sound-settings"
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('ringtone', 'settings')}</span>
              </div>
              <span className="text-white/60">{t('default', 'settings')}</span>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="vibration-settings"
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('vibration', 'settings')}</span>
              </div>
              <div className="w-12 h-6 bg-samsung-blue rounded-full p-1 relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 transition-all duration-200" />
              </div>
            </button>
          </div>
          
          {/* Privacy Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">{t('privacy', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="location-settings"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('locationServices', 'settings')}</span>
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
                <span className="text-white">{t('appPermissions', 'settings')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
          
          {/* Phone Settings */}
          <div className="mb-6">
            <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">{t('device', 'settings')}</h4>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="storage-settings"
            >
              <div className="flex items-center space-x-3">
                <HardDrive className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('storage', 'settings')}</span>
              </div>
              <span className="text-white/60">12GB used</span>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm mb-3"
              data-testid="about-phone"
            >
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">{t('aboutPhone', 'settings')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>

          {/* Metadata Info Panel */}
          <div className="mb-6">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-samsung-sm">
              <div className="text-green-400 text-sm font-medium mb-2">🔒 Metadata System Active</div>
              <div className="text-green-300/80 text-xs">
                All your settings are now securely stored on the server using FiveM's metadata system. 
                Your preferences will persist across sessions and are protected from client-side manipulation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
