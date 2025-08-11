import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClockAppProps {
  onBack: () => void;
}

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

const mockAlarms: Alarm[] = [
  { id: '1', time: '07:00', label: 'Wake up', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: '2', time: '12:00', label: 'Lunch break', enabled: false, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: '3', time: '18:30', label: 'Gym time', enabled: true, days: ['Mon', 'Wed', 'Fri'] }
];

export const ClockApp = ({ onBack }: ClockAppProps) => {
  const [activeTab, setActiveTab] = useState<'clock' | 'alarm' | 'timer' | 'stopwatch'>('clock');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [timerTime, setTimerTime] = useState(0);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }));
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'clock', label: 'Clock' },
    { id: 'alarm', label: 'Alarm' },
    { id: 'timer', label: 'Timer' },
    { id: 'stopwatch', label: 'Stopwatch' }
  ];

  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="clock-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Clock</h1>
        <div />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-4 text-center transition-colors duration-200 ${
              activeTab === tab.id 
                ? 'text-samsung-blue border-b-2 border-samsung-blue' 
                : 'text-white/70'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6">
        {activeTab === 'clock' && (
          <div className="text-center">
            <div className="text-white text-6xl font-light mb-4" data-testid="current-time">
              {currentTime}
            </div>
            <div className="text-white/70 text-lg" data-testid="current-date">
              {currentDate}
            </div>
          </div>
        )}

        {activeTab === 'alarm' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-semibold">Alarms</h2>
              <button 
                className="oneui-button bg-samsung-blue text-white p-2 rounded-full"
                data-testid="add-alarm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {mockAlarms.map((alarm) => (
                <div 
                  key={alarm.id}
                  className="bg-surface-dark/30 rounded-samsung-sm p-4"
                  data-testid={`alarm-${alarm.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-2xl font-light">{alarm.time}</div>
                      <div className="text-white/70 text-sm">{alarm.label}</div>
                      <div className="text-white/50 text-xs">{alarm.days.join(', ')}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="oneui-button p-2">
                        <Edit className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="oneui-button p-2">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                        alarm.enabled ? 'bg-samsung-blue' : 'bg-white/20'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                          alarm.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="text-center">
            <div className="text-white text-6xl font-light mb-8" data-testid="timer-display">
              {formatTime(timerTime)}
            </div>
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <button 
                  className="oneui-button bg-samsung-blue text-white px-6 py-3 rounded-samsung-sm"
                  onClick={() => setTimerTime(prev => prev + 60)}
                  data-testid="timer-add-minute"
                >
                  +1 Min
                </button>
                <button 
                  className="oneui-button bg-samsung-blue text-white px-6 py-3 rounded-samsung-sm"
                  onClick={() => setTimerTime(prev => prev + 300)}
                  data-testid="timer-add-five"
                >
                  +5 Min
                </button>
              </div>
              <div className="flex justify-center space-x-4">
                <button 
                  className={`oneui-button px-8 py-3 rounded-samsung-sm font-medium ${
                    isTimerRunning 
                      ? 'bg-red-500 text-white' 
                      : 'bg-samsung-green text-white'
                  }`}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  disabled={timerTime === 0}
                  data-testid="timer-start-stop"
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button 
                  className="oneui-button bg-white/20 text-white px-8 py-3 rounded-samsung-sm font-medium"
                  onClick={() => {
                    setTimerTime(0);
                    setIsTimerRunning(false);
                  }}
                  data-testid="timer-reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stopwatch' && (
          <div className="text-center">
            <div className="text-white text-6xl font-light mb-8" data-testid="stopwatch-display">
              {formatTime(stopwatchTime)}
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                className={`oneui-button px-8 py-3 rounded-samsung-sm font-medium ${
                  isStopwatchRunning 
                    ? 'bg-red-500 text-white' 
                    : 'bg-samsung-green text-white'
                }`}
                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                data-testid="stopwatch-start-stop"
              >
                {isStopwatchRunning ? 'Stop' : 'Start'}
              </button>
              <button 
                className="oneui-button bg-white/20 text-white px-8 py-3 rounded-samsung-sm font-medium"
                onClick={() => {
                  setStopwatchTime(0);
                  setIsStopwatchRunning(false);
                }}
                data-testid="stopwatch-reset"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
