import { 
  MessageCircle, 
  Phone, 
  Camera, 
  Settings, 
  CreditCard, 
  Twitter, 
  Calculator, 
  Images, 
  StickyNote, 
  Music, 
  Clock, 
  Book, 
  Users,
  Flashlight,
  Wifi,
  Bluetooth,
  Plane
} from 'lucide-react';
import type { Screen } from '@/hooks/usePhone';

interface HomeScreenProps {
  onAppOpen: (screen: Screen) => void;
}

const apps = [
  { id: 'contacts', name: 'Messages', icon: MessageCircle, color: 'from-purple-500 to-pink-500', screen: 'contacts' as Screen },
  { id: 'phone', name: 'Phone', icon: Phone, color: 'from-green-500 to-emerald-500', screen: 'contacts' as Screen },
  { id: 'camera', name: 'Camera', icon: Camera, color: 'from-gray-500 to-slate-500', screen: 'camera' as Screen },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'from-blue-500 to-purple-500', screen: 'settings' as Screen },
  { id: 'banking', name: 'Bank', icon: CreditCard, color: 'from-pink-500 to-red-500', screen: 'banking' as Screen },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-600', screen: 'twitter' as Screen },
  { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'from-cyan-400 to-blue-500', screen: 'calculator' as Screen },
  { id: 'gallery', name: 'Gallery', icon: Images, color: 'from-yellow-400 to-orange-500', screen: 'gallery' as Screen },
  { id: 'notes', name: 'Notes', icon: StickyNote, color: 'from-orange-300 to-yellow-500', screen: 'notes' as Screen },
  { id: 'spotify', name: 'Spotify', icon: Music, color: 'from-green-500 to-green-600', screen: 'spotify' as Screen },
  { id: 'clock', name: 'Clock', icon: Clock, color: 'from-indigo-500 to-purple-500', screen: 'clock' as Screen },
  { id: 'yellowpages', name: 'Yellow Pages', icon: Book, color: 'from-yellow-400 to-teal-400', screen: 'yellowpages' as Screen },
];

export const HomeScreen = ({ onAppOpen }: HomeScreenProps) => {
  return (
    <div className="absolute inset-0">
      {/* Background */}
      <div className="h-full relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full" />
        
        {/* App Grid */}
        <div className="pt-16 px-6 h-full overflow-y-auto">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {apps.map((app) => {
              const IconComponent = app.icon;
              return (
                <button
                  key={app.id}
                  className="oneui-button flex flex-col items-center space-y-2"
                  onClick={() => onAppOpen(app.screen)}
                  data-testid={`app-${app.id}`}
                >
                  <div className={`w-14 h-14 rounded-samsung-sm flex items-center justify-center bg-gradient-to-br ${app.color} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium text-center">{app.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Quick Actions Dock */}
          <div className="absolute bottom-8 left-6 right-6 bg-surface-dark/50 backdrop-blur-md rounded-samsung p-4">
            <div className="flex justify-around items-center">
              <button 
                className="oneui-button p-3 rounded-full bg-samsung-blue/20"
                data-testid="quick-flashlight"
              >
                <Flashlight className="w-5 h-5 text-samsung-blue" />
              </button>
              <button 
                className="oneui-button p-3 rounded-full bg-samsung-blue/20"
                data-testid="quick-wifi"
              >
                <Wifi className="w-5 h-5 text-samsung-blue" />
              </button>
              <button 
                className="oneui-button p-3 rounded-full bg-samsung-blue/20"
                data-testid="quick-bluetooth"
              >
                <Bluetooth className="w-5 h-5 text-samsung-blue" />
              </button>
              <button 
                className="oneui-button p-3 rounded-full bg-samsung-blue/20"
                data-testid="quick-airplane"
              >
                <Plane className="w-5 h-5 text-samsung-blue" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
