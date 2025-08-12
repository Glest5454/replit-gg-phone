import { usePhone } from '@/hooks/usePhone';
import framePng from '@assets/frame.png';
import { useEffect } from 'react';
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

export const PhoneFrame = () => {
  const { 
    phoneState, 
    navigateToScreen, 
    goBack, 
    addPinDigit, 
    deletePinDigit, 
    toggleTheme,
    setWallpaper,
    setBrightness
  } = usePhone();

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
        return <SettingsApp onBack={goBack} onToggleTheme={toggleTheme} theme={phoneState.theme} setWallpaper={setWallpaper} setBrightness={setBrightness} />;
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
        return <ContactsApp onBack={goBack} />;
      case 'messages':
        return <MessagesApp onBack={goBack} />;
      case 'mail':
        return <MailApp onBack={goBack} />;
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
         overflow-hidden">
          <StatusBar />
          <div className="w-full h-full pt-10">
            {renderCurrentScreen()}
          </div>
        </div>
        
        {/* Notifications appear above the phone screen */}
        <NotificationManager />
      </div>
    </div>
  );
};
