import { usePhone } from '@/hooks/usePhone';
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
      {/* Phone Frame */}
      <div className="phone-frame rounded-samsung w-80 h-[640px] p-2 relative">
        {/* Screen Container */}
        <div className="screen-content rounded-samsung w-full h-full relative overflow-hidden">
          <StatusBar />
          <div className="w-full h-full">
            {renderCurrentScreen()}
          </div>
        </div>
      </div>
    </div>
  );
};
