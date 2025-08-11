import { useState, useEffect } from 'react';
import { Camera, Phone } from 'lucide-react';
import type { Notification } from '@/hooks/usePhone';

interface LockScreenProps {
  pin: string;
  notifications: Notification[];
  onPinInput: (digit: string) => void;
  onPinDelete: () => void;
}

export const LockScreen = ({ pin, notifications, onPinInput, onPinDelete }: LockScreenProps) => {
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
    if (pin.length === 4 && pin !== '1234') {
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

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Background */}
      <div 
        className="flex-1 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        
        {/* Clock Widget */}
        <div className="absolute top-20 left-6 right-6">
          <div className="text-center text-white">
            <div className="text-6xl font-light tracking-tight" data-testid="lock-time">{currentTime}</div>
            <div className="text-lg opacity-80 mt-1" data-testid="lock-date">{currentDate}</div>
          </div>
        </div>
        
        {/* Notifications Preview */}
        <div className="absolute top-48 left-6 right-6 space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id}
              className="bg-surface-dark/90 backdrop-blur-md rounded-samsung-sm p-4 border border-white/10"
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-samsung-blue rounded-lg flex items-center justify-center">
                  <div className="text-white text-xs">📱</div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{notification.title}</div>
                  <div className="text-white/70 text-xs">{notification.message}</div>
                </div>
                <div className="text-white/50 text-xs">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Unlock Interface */}
        <div className="absolute bottom-32 left-6 right-6">
          <div className="text-center text-white mb-6">
            <div className="text-sm opacity-80">Enter PIN to unlock</div>
          </div>
          
          {/* PIN Dots */}
          <div className={`flex justify-center space-x-4 mb-8 ${showShake ? 'shake' : ''}`}>
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
          <div className="grid grid-cols-3 gap-6 max-w-64 mx-auto">
            {numberPad.flat().map((key, index) => {
              if (key === '') {
                return <div key={index} />;
              }
              
              if (key === 'delete') {
                return (
                  <button
                    key={index}
                    className="oneui-button w-16 h-16 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center"
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
                  className="oneui-button w-16 h-16 rounded-full bg-white/10 backdrop-blur-md text-white text-xl font-light flex items-center justify-center"
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
