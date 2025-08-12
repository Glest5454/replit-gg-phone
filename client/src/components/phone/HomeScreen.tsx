import { 
  Users, 
  CreditCard, 
  Camera as CameraIcon,
  Settings,
  Calculator,
  Images,
  Music,
  Clock,
  NotepadTextDashed
  } from 'lucide-react';
import contactsPng from '@apps/contacts.png';
import settingsPng from '@apps/settings.png';
import notesPng from '@apps/notes.png';
import bankingPng from '@apps/mail.png';
import cameraPng from '@apps/camera.png';
import birdyPng from '@apps/birdy.png';
import whatsappPng from '@apps/whatsapp.png';
import type { Screen } from '@/hooks/usePhone';
import { usePhone } from '@/hooks/usePhone';
import { useLanguage } from '@/hooks/useLanguage';
import { getTranslatedApps } from '@/config/apps';

interface HomeScreenProps {
  onAppOpen: (screen: Screen) => void;
}

// Not currently used but kept for future manual grid overrides
const apps = [] as const;

export const HomeScreen = ({ onAppOpen }: HomeScreenProps) => {
  const { t } = useLanguage();
  const { phoneState } = usePhone();
  
  // Get apps with translated names based on current language
  const apps = getTranslatedApps(t('language', 'common') || 'en');

  return (
    <div className="absolute inset-0 home-background flex flex-col">
      {/* App Grid */}
      <div className="pt-16 px-6 h-full overflow-y-auto">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onAppOpen(app.screen as Screen)}
              className="flex flex-col items-center space-y-2 group"
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
                className="oneui-button flex flex-col items-center space-y-1"
                onClick={() => onAppOpen('contacts')}
                data-testid="dock-contacts"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('contacts', 'homeScreen')}</span>
              </button>
              
              <button 
                className="oneui-button flex flex-col items-center space-y-1"
                onClick={() => onAppOpen('banking')}
                data-testid="dock-bank"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('bank', 'homeScreen')}</span>
              </button>
              
              <button 
                className="oneui-button flex flex-col items-center space-y-1"
                onClick={() => onAppOpen('camera')}
                data-testid="dock-camera"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-gradient-to-br from-gray-600 to-slate-700 shadow-lg">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <span className="home-screen-text text-[10px] font-medium">{t('camera', 'homeScreen')}</span>
              </button>
              
              <button 
                className="oneui-button flex flex-col items-center space-y-1"
                onClick={() => onAppOpen('settings')}
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
