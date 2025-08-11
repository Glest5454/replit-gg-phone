import { usePhone } from '@/hooks/usePhone';
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

export const PhoneFrame = () => {
  const { phoneState, navigateToScreen, goBack, addPinDigit, deletePinDigit, toggleTheme } = usePhone();

  useEffect(() => {
    // Initialize saved settings on phone load
    const savedTheme = localStorage.getItem('phone-theme') as 'light' | 'dark' | null;
    const savedBrightness = localStorage.getItem('phone-brightness');
    const savedWallpaper = localStorage.getItem('phone-wallpaper');
    
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    
    if (phoneScreen) {
      // Apply saved theme
      if (savedTheme) {
        phoneScreen.classList.add(savedTheme === 'dark' ? 'phone-dark-mode' : 'phone-light-mode');
      } else {
        phoneScreen.classList.add('phone-dark-mode'); // Default to dark
      }
      
      // Apply saved brightness
      if (savedBrightness) {
        phoneScreen.style.filter = `brightness(${savedBrightness}%)`;
      }
    }
    
    // Apply saved wallpaper
    if (savedWallpaper) {
      const wallpapers = [
        { id: 'default', preview: 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800' },
        { id: 'sunset', preview: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600' },
        { id: 'ocean', preview: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600' },
        { id: 'forest', preview: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500' },
        { id: 'space', preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black' },
        { id: 'aurora', preview: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600' },
      ];
      
      const homeScreens = document.querySelectorAll('.home-screen-bg') as NodeListOf<HTMLElement>;
      homeScreens.forEach(screen => {
        const selectedWallpaper = wallpapers.find(w => w.id === savedWallpaper);
        if (selectedWallpaper) {
          screen.className = `home-screen-bg h-full relative ${selectedWallpaper.preview}`;
        }
      });
    }
  }, []);

  const renderCurrentScreen = () => {
    switch (phoneState.currentScreen) {
      case 'lock':
        return (
          <LockScreen
            pin={phoneState.pin}
            notifications={phoneState.notifications}
            onPinInput={addPinDigit}
            onPinDelete={deletePinDigit}
          />
        );
      case 'home':
        return <HomeScreen onAppOpen={navigateToScreen} />;
      case 'banking':
        return <BankingApp onBack={goBack} />;
      case 'twitter':
        return <TwitterApp onBack={goBack} />;
      case 'settings':
        return <SettingsApp onBack={goBack} onToggleTheme={toggleTheme} theme={phoneState.theme} />;
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
      default:
        return <HomeScreen onAppOpen={navigateToScreen} />;
    }
  };

  return (
    <div className="relative">
      {/* Phone Frame using background image */}
      <div 
        className="relative w-96 h-[720px]"
        style={{
          backgroundImage: `url('/attached_assets/frame_1754954620163.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Screen Container positioned within the frame */}
        <div className="phone-screen absolute top-6 left-6 right-6 bottom-6 bg-black rounded-[32px] overflow-hidden">
          <StatusBar />
          <div className="w-full h-full pt-10">
            {renderCurrentScreen()}
          </div>
        </div>
      </div>
    </div>
  );
};
