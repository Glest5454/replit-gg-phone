import { 
  Users, 
  CreditCard, 
  Camera as CameraIcon,
  Settings,
  Calculator,
  Images,
  Music,
  Clock,
  NotepadTextDashed,
  Mail
  } from 'lucide-react';
import contactsPng from '@apps/contacts.png';
import settingsPng from '@apps/settings.png';
import notesPng from '@apps/notes.png';
import bankingPng from '@apps/mail.png';
import cameraPng from '@apps/camera.png';
import birdyPng from '@apps/birdy.png';
import whatsappPng from '@apps/whatsapp.png';
import darkchatPng from '@apps/darkchat.png';
import mapsPng from '@apps/maps.png';
import phonePng from '@apps/phone.png';
import type { Screen } from '@/hooks/usePhone';
import { usePhone } from '@/hooks/usePhone';
import { useLanguage } from '@/hooks/useLanguage';
import { getTranslatedApps } from '@/config/apps';
import { useTaskManager } from '@/context/TaskManagerContext';

interface HomeScreenProps {
  onAppOpen: (screen: Screen) => void;
}

// Not currently used but kept for future manual grid overrides
const apps = [] as const;

export const HomeScreen = ({ onAppOpen }: HomeScreenProps) => {
  const { t, language } = useLanguage();
  const { phoneState } = usePhone();
  const { addToRecent } = useTaskManager();
  
  // Get apps with translated names based on current language
  const apps = getTranslatedApps(language === 'english' ? 'en' : 'tr');

  // Get wallpaper from localStorage or use default
  const wallpaper = localStorage.getItem('phone-wallpaper') || 'default';

  // Function to get background style based on wallpaper
  const getBackgroundStyle = () => {
    if (wallpaper === 'default') {
      return { background: 'linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 20% 10%) 100%)' };
    }
    
    // Check if it's a URL (starts with http or https)
    if (wallpaper.startsWith('http')) {
      return { 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // For predefined wallpapers, use CSS variables or predefined styles
    const wallpaperStyles: Record<string, string> = {
      'sunset': 'linear-gradient(135deg, hsl(25 100% 50%) 0%, hsl(330 100% 50%) 50%, hsl(270 100% 60%) 100%)',
      'ocean': 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(180 100% 50%) 50%, hsl(180 100% 40%) 100%)',
      'forest': 'linear-gradient(135deg, hsl(120 100% 40%) 0%, hsl(160 100% 40%) 50%, hsl(180 100% 40%) 100%)',
      'space': 'linear-gradient(135deg, hsl(270 100% 30%) 0%, hsl(220 100% 30%) 50%, hsl(0 0% 0%) 100%)',
      'aurora': 'linear-gradient(135deg, hsl(120 100% 50%) 0%, hsl(210 100% 50%) 50%, hsl(270 100% 60%) 100%)'
    };
    
    return { 
      background: wallpaperStyles[wallpaper] || 'linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 20% 10%) 100%)'
    };
  };

  const handleAppOpen = (screen: Screen) => {
    // Find the app data
    const app = apps.find(a => a.screen === screen);
    if (app) {
      // Add to recent apps
      addToRecent({
        id: screen,
        name: app.translatedName,
        icon: typeof app.icon === 'string' ? app.icon : 'grid-3x3',
        color: app.color || 'bg-samsung-blue',
        component: () => null, // This will be handled by the navigation system
      });
    }
    
    // Open the app
    onAppOpen(screen);
  };

  const handleDockAppOpen = (screen: Screen, appName: string, appColor: string) => {
    // Add dock app to recent apps
    addToRecent({
      id: screen,
      name: appName,
      icon: 'grid-3x3', // Default icon for dock apps
      color: appColor,
      component: () => null, // This will be handled by the navigation system
    });
    
    // Open the app
    onAppOpen(screen);
  };

  return (
    <div 
      className="absolute inset-0 flex flex-col"
      style={getBackgroundStyle()}
    >
      {/* App Grid */}
      <div className="pt-16 px-6 h-full overflow-y-auto">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppOpen(app.screen as Screen)}
              className="flex flex-col items-center space-y-2 group transition-transform duration-200 hover:scale-110"
            >
              <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-lg ${
                app.iconType === 'lucide' 
                  ? `bg-gradient-to-br ${app.color}` 
                  : 'bg-black/20'
              }`}>
                {app.iconType === 'png' ? (
                  <img src={app.icon as string} alt={app.name} className="w-12 h-12 object-contain" />
                ) : (
                  <app.icon className="w-10 h-10 text-white" /> 
                )}
              </div>
              <span className="home-screen-text text-xs font-medium text-center text-white">{app.translatedName}</span>
            </button>
          ))}
        </div>
        
        {/* Professional Dock - One UI Style */}
        <div className="absolute bottom-10 left-4 right-4">
          <div className="dock-app bg-black/60 backdrop-blur-xl rounded-[32px] px-6 py-4 border border-white/10">
            <div className="flex justify-between items-center">
   <button 
                className="oneui-button flex flex-col items-center space-y-1 transition-transform duration-200 hover:scale-110"
                onClick={() => handleDockAppOpen('messages', t('messages', 'homeScreen'), 'from-green-500 to-emerald-600')}
                data-testid="dock-messages"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('messages', 'homeScreen')}</span>
              </button>

              <button 
                className="oneui-button flex flex-col items-center space-y-1 transition-transform duration-200 hover:scale-110"
                onClick={() => handleDockAppOpen('contacts', t('contacts', 'homeScreen'), 'from-blue-500 to-purple-500')}
                data-testid="dock-contacts"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('contacts', 'homeScreen')}</span>
              </button>
              
              <button 
                className="oneui-button flex flex-col items-center space-y-1 transition-transform duration-200 hover:scale-110"
                onClick={() => handleDockAppOpen('camera', t('camera', 'homeScreen'), 'from-gray-600 to-slate-700')}
                data-testid="dock-camera"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-gray-600 to-slate-700 shadow-lg">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('camera', 'homeScreen')}</span>
              </button>
              
              <button 
                className="oneui-button flex flex-col items-center space-y-1 transition-transform duration-200 hover:scale-110"
                onClick={() => handleDockAppOpen('settings', t('settings', 'common'), 'from-blue-600 to-indigo-700')}
                data-testid="dock-settings"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('settings', 'common')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
