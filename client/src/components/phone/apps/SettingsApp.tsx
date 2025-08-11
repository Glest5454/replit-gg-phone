import { ArrowLeft, Search, Moon, Sun, Volume2, Smartphone, MapPin, Shield, HardDrive, Info, ChevronRight } from 'lucide-react';

interface SettingsAppProps {
  onBack: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const SettingsApp = ({ onBack, onToggleTheme, theme }: SettingsAppProps) => {
  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
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
              data-testid="brightness-settings"
            >
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-samsung-blue" />
                <span className="text-white">Brightness</span>
              </div>
              <span className="text-white/60">Auto</span>
            </button>
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
