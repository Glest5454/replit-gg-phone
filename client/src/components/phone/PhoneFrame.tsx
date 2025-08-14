import { usePhone } from '@/hooks/usePhone';
import framePng from '@assets/frame.png';
import { useEffect, useState } from 'react';
import { StatusBar } from './StatusBar';
import { LockScreen } from './LockScreen';
import { HomeScreen } from './HomeScreen';
import { BankingApp } from './apps/BankingApp';
import { TwitterApp } from './apps/TwitterApp';
import { SettingsApp } from './apps/SettingsApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { CameraApp } from './apps/CameraApp';
import { GalleryApp } from './apps/GalleryApp';
import { NotesApp } from './apps/NotesApp';
import { SpotifyApp } from './apps/SpotifyApp';
import { ClockApp } from './apps/ClockApp';
import { YellowPagesApp } from './apps/YellowPagesApp';
import { ContactsApp } from './apps/ContactsApp';
import { MessagesApp } from './apps/MessagesApp';
import { NotificationManager } from './NotificationManager';
import { MailApp } from './apps/MailApp';
import { MapsApp } from './apps/MapsApp';
import { DarkChatApp } from './apps/DarkChatApp';
import { BrowserApp } from './apps/BrowserApp';
import { AppsApp } from './apps/AppsApp';
import { HomeIndicator } from './HomeIndicator';
import { useTaskManager } from '@/context/TaskManagerContext';
import { Grid3X3, X, Trash2 } from 'lucide-react';
import { getAppById } from '@/config/apps';

export const PhoneFrame = () => {
  const { 
    phoneState, 
    navigateToScreen, 
    goBack, 
    addPinDigit, 
    deletePinDigit, 
    toggleTheme,
    setWallpaper,
    setBrightness,
    refreshLockScreenState
  } = usePhone();
  
  const { 
    recentApps, 
    isTaskManagerOpen, 
    closeTaskManager, 
    openApp, 
    removeFromRecent,
    removeAllRecentApps,
  } = useTaskManager();
  
  const [playerData, setPlayerData] = useState<{
    phoneNumber?: string;
    playerName?: string;
  }>({});

  const [selectedContactForMessages, setSelectedContactForMessages] = useState<{
    id: string;
    name: string;
    phoneNumber: string;
    favorite?: boolean;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    // Apply saved settings on phone load
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
   
    if (phoneScreen) {
      // Apply saved theme
      phoneScreen.classList.remove('phone-dark-mode', 'phone-light-mode');
      phoneScreen.classList.add(phoneState.theme === 'dark' ? 'phone-dark-mode' : 'phone-light-mode');
      
      // Apply saved brightness
      phoneScreen.style.filter = `brightness(${phoneState.brightness}%)`;
    }
  }, [phoneState.theme, phoneState.brightness]);

  // Listen for NUI messages from FiveM
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'openPhone' && event.data.playerData) {
        setPlayerData({
          phoneNumber: event.data.playerData.phoneNumber,
          playerName: event.data.playerData.playerName
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNavigateToMessages = (contact: {
    id: string;
    name: string;
    phoneNumber: string;
    favorite?: boolean;
    avatar?: string;
  }) => {
    setSelectedContactForMessages(contact);
    navigateToScreen('messages');
  };

  const handleNavigateToContactsForCall = (contact: {
    id: string;
    name: string;
    phoneNumber: string;
    favorite?: boolean;
    avatar?: string;
  }) => {
    setSelectedContactForMessages(contact);
    // Add URL parameter to indicate we want to call this contact
    window.history.pushState({}, '', `?call=${contact.phoneNumber}`);
    navigateToScreen('contacts');
  };

  const handleHomePress = () => {
    navigateToScreen('home');
    
  };

  // Function to render app icon based on iconType
  const renderAppIcon = (appId: string) => {
    const appConfig = getAppById(appId);
    if (!appConfig) {
      console.log('No app config found for:', appId);
      return <Grid3X3 className="w-6 h-6 text-white" />;
    }
    /*console.log('Rendering icon for app:', appId)
    console.log('iconType:', appConfig.iconType, appConfig.icon);*/
    if (appConfig.iconType === 'lucide') {
      const IconComponent = appConfig.icon as React.ComponentType<any>;
      return <IconComponent className="w-6 h-6 text-white" />;
    } else if (appConfig.iconType === 'png' && typeof appConfig.icon === 'string') {
      return <img src={appConfig.icon} alt={appConfig.name} className="w-12 h-12 object-contain" />;
    }
    
    return <Grid3X3 className="w-6 h-6 text-white" />;
  };

  // Function to render app color based on app config
  const renderAppColor = (appId: string) => {
    const appConfig = getAppById(appId);
    if (!appConfig || !appConfig.color) return '';
    

    if (appConfig.iconType === 'lucide' && appConfig.color.includes('from-') && appConfig.color.includes('to-')) {
      return `bg-gradient-to-br ${appConfig.color}`;
    }
    else if (appConfig.iconType === 'png') {
      return 'bg-black/20';
    }
    return appConfig.color;
  };

  const renderCurrentScreen = () => {
    switch (phoneState.currentScreen) {
      case 'lock':
        return (
          <LockScreen
            pin={phoneState.pin}
            notifications={phoneState.notifications}
            onPinInput={addPinDigit}
            onPinDelete={deletePinDigit}
            wallpaper={phoneState.wallpaper}
          />
        );
      case 'home':
        return <HomeScreen onAppOpen={navigateToScreen} />;
      case 'banking':
        return <BankingApp onBack={goBack} />;
      case 'twitter':
        return <TwitterApp onBack={goBack} />;
      case 'settings':
        return <SettingsApp onBack={goBack} onToggleTheme={toggleTheme} theme={phoneState.theme} setWallpaper={setWallpaper} setBrightness={setBrightness} playerData={playerData} refreshLockScreenState={refreshLockScreenState} />;
      case 'calculator':
        return <CalculatorApp onBack={goBack} />;
      case 'camera':
        return <CameraApp onBack={goBack} />;
      case 'gallery':
        return <GalleryApp onBack={goBack} />;
      case 'notes':
        return <NotesApp onBack={goBack} />;
      case 'spotify':
        return <SpotifyApp onBack={goBack} />;
      case 'clock':
        return <ClockApp onBack={goBack} />;
      case 'yellowpages':
        return <YellowPagesApp onBack={goBack} />;
      case 'contacts':
        return <ContactsApp onBack={goBack} onNavigateToMessages={handleNavigateToMessages} />;
      case 'messages':
        return <MessagesApp onBack={goBack} selectedContact={selectedContactForMessages} onNavigateToContacts={handleNavigateToContactsForCall} />;
      case 'mail':
        return <MailApp onBack={goBack} />;
      case 'maps':
        return <MapsApp onBack={goBack} />;
      case 'darkchat':
        return <DarkChatApp onBack={goBack} />;
      case 'browser':
        return <BrowserApp onBack={goBack} />;
      case 'apps':
        return <AppsApp />;
      case 'test':
        return <div className="flex items-center justify-center h-full text-white">Test App</div>;
      default:
        return <HomeScreen onAppOpen={navigateToScreen} />;
    }
  };

  return (
    <div className="relative">
      {/* Phone Frame using background image */}
      <div 
        className="relative w-[380px] h-[750px]"
        style={{
          backgroundImage: `url(${framePng})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Screen Container positioned within the frame */}
        <div className="phone-screen 
        absolute top-10 left-7 right-8 bottom-4
         bg-black rounded-[45px] 
         overflow-hidden"
         >
          <StatusBar />
          <div className="w-full h-full pt-10">
            {renderCurrentScreen()}
          </div>
        </div>
        
        {/* Notifications appear above the phone screen */}
        <NotificationManager />
        
        {/* Home Indicator - only show when not on lock screen */}
        {phoneState.currentScreen !== 'lock' && (
          <HomeIndicator onHomePress={handleHomePress} />
        )}
        
        {/* Task Manager Overlay - Samsung S25 Style */}
        {isTaskManagerOpen && (
          <div className="absolute mx-8 top-10 bottom-4 rounded-[45px] inset-0 backdrop-blur-lg z-40 flex items-end justify-center">
            <div className="w-full max-w-sm mx-4 mb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-semibold">Recent Apps</h2>
                <button
                  onClick={closeTaskManager}
                  className="oneui-button p-2 text-white/60 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* App Cards - Vertical Samsung S25 Style */}
              {recentApps.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {recentApps.map((app) => (
                    <div 
                      key={app.id}
                      className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 cursor-pointer hover:bg-black/20 transition-all duration-200 relative group border border-white/20"
                      onClick={() => {
                        navigateToScreen(app.id as any);
                        closeTaskManager();
                       
                      }}
                    >
                       {/* Remove button */}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           // If removing the current app, go back to home
                           if (phoneState.currentScreen === app.id) {
                             navigateToScreen('home');
                           }
                           removeFromRecent(app.id);
                         }}
                         className="absolute top-3 right-3 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 className="w-3 h-3 text-white" />
                       </button>
                      
                      <div className="flex items-center space-x-4">
                        {/* App icon */}
                        <div 
                          className={`w-12 h-12 ${renderAppColor(app.id)} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          {renderAppIcon(app.id)}
                        </div>
                        
                        {/* App info */}
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm">{app.name}</h3>
                          <p className="text-white/60 text-xs">Tap to open</p>
                        </div>
                        
                        {/* Swipe indicator */}
                        <div className="w-2 h-8 bg-white/30 rounded-full">
                          <div className="w-2 h-2 bg-white/60 rounded-full mx-auto mt-1"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 mb-6">
                  <Grid3X3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">No recent apps</p>
                  <p className="text-white/40 text-sm mt-2">Open some apps to see them here</p>
                </div>
              )}
              
              {/* Remove All Button - Only show when there are apps */}
              {recentApps.length > 0 && (
                <button
                  onClick={() => {
                    removeAllRecentApps();
                    navigateToScreen('home');
                  }}
                  className="oneui-button w-full py-3 px-4 text-white/80 hover:text-white rounded-2xl bg-red-800/60 hover:bg-red-600/60 border border-red-800/60 hover:border-red-600/60 transition-all duration-200 backdrop-blur-sm mb-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Clear All</span>
                  </div>
                </button>
              )}
              
              {/* Instructions */}
              <div className="text-center mb-2">
                <p className="text-white/60 text-sm">
                  Swipe up on home indicator to open task manager
                </p>
                <p className="text-white/40 text-xs">
                  Tap home indicator to return to main menu
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};