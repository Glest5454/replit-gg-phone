import { useState, useEffect } from 'react';
import { Camera, Phone } from 'lucide-react';
import type { Notification } from '@/hooks/usePhone';

interface LockScreenProps {
  pin: string;
  notifications: Notification[];
  onPinInput: (digit: string) => void;
  onPinDelete: () => void;
  wallpaper: string;
}

export const LockScreen = ({ pin, notifications, onPinInput, onPinDelete, wallpaper }: LockScreenProps) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showShake, setShowShake] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const customPin = localStorage.getItem('phone-custom-pin') || '1234';
    if (pin.length === 4 && pin !== customPin) {
      setShowShake(true);
      setTimeout(() => {
        setShowShake(false);
      }, 500);
    }
  }, [pin]);

  const numberPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete']
  ];

  // Function to get background style based on wallpaper
  const getBackgroundStyle = () => {
    if (wallpaper === 'default') {
      return { 
        backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Check if it's a URL (starts with http or https)
    if (wallpaper.startsWith('http')) {
      return { 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // For predefined wallpapers, use predefined styles
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

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Background */}
      <div 
        className="flex-1 relative"
        style={getBackgroundStyle()}
      >
        <div className="absolute inset-0 lock-screen-overlay bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        
        {/* Clock Widget */}
        <div className="absolute top-20 left-6 right-6">
          <div className="text-center text-white">
            <div className="text-6xl font-light tracking-tight" data-testid="lock-time">{currentTime}</div>
            <div className="text-lg opacity-80 mt-1" data-testid="lock-date">{currentDate}</div>
          </div>
        </div>
        
        {/* Notifications Preview */}
        <div className="absolute top-44 left-6 right-6 space-y-2 max-h-32 overflow-hidden">
          {notifications.slice(0, 2).map((notification) => (
            <div 
              key={notification.id}
              className="notification-item backdrop-blur-md rounded-samsung-sm p-3"
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-samsung-blue rounded-lg flex items-center justify-center">
                  <div className="text-white text-xs">📱</div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-xs">{notification.title}</div>
                  <div className="text-white/70 text-xs">{notification.message}</div>
                </div>
                <div className="text-white/50 text-xs">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Unlock Interface */}
        <div className="absolute bottom-20 left-6 right-6">
          <div className="text-center text-white mb-6">
            <div className="text-sm opacity-80">Enter PIN to unlock</div>
          </div>
          
          {/* PIN Dots */}
          <div className={`flex justify-center space-x-3 mb-6 ${showShake ? 'shake' : ''}`}>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  index < pin.length 
                    ? 'bg-white border-white' 
                    : 'border-white/50'
                }`}
                data-testid={`pin-dot-${index}`}
              />
            ))}
          </div>
          
          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-4 max-w-48 mx-auto">
            {numberPad.flat().map((key, index) => {
              if (key === '') {
                return <div key={index} />;
              }
              
              if (key === 'delete') {
                return (
                  <button
                    key={index}
                    className="oneui-button w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center"
                    onClick={onPinDelete}
                    data-testid="pin-delete"
                  >
                    ⌫
                  </button>
                );
              }
              
              return (
                <button
                  key={index}
                  className="oneui-button w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white text-lg font-light flex items-center justify-center"
                  onClick={() => onPinInput(key)}
                  data-testid={`pin-${key}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Camera and Emergency */}
        <div className="absolute bottom-8 left-6 right-6 flex justify-between items-center">
          <button 
            className="oneui-button w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center"
            data-testid="camera-quick"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button 
            className="oneui-button text-white/70 text-sm"
            data-testid="emergency-call"
          >
            Emergency
          </button>
        </div>
      </div>
    </div>
  );
};
