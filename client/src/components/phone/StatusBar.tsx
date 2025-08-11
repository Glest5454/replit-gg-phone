import { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel] = useState(87);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center text-white bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium" data-testid="status-time">{currentTime}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Signal className="w-3 h-3" data-testid="status-signal" />
        <Wifi className="w-3 h-3" data-testid="status-wifi" />
        <div className="flex items-center">
          <div className="w-6 h-3 border border-white rounded-sm relative" data-testid="battery-indicator">
            <div 
              className="h-1.5 bg-samsung-green rounded-sm absolute top-0.5 left-0.5 transition-all duration-200"
              style={{ width: `${(batteryLevel / 100) * 16}px` }}
            />
          </div>
          <span className="text-xs ml-1" data-testid="battery-level">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};
