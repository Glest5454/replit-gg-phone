import { 
  Users, 
  CreditCard, 
  Camera,
  Settings,
  Calculator,
  Images,
  Music,
  Clock,
  NotepadTextDashed,
  FileText,
  BookOpen,
  MessageCircle,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import contactsPng from '@apps/contacts.png';
import settingsPng from '@apps/settings.png';
import notesPng from '@apps/notes.png';
import bankingPng from '@apps/wallet.png';
import cameraPng from '@apps/camera.png';
import galleryPng from '@apps/gallery.png';
import twitterPng from '@apps/twitter.png';
//import twitterPng from '@apps/x.png';
import whatsappPng from '@apps/whatsapp.png';
import mailPng from '@apps/mail.png';
import calculatorPng from '@apps/calculator.png'; 
import spotifyPng from '@apps/spotify.png';
import clockPng from '@apps/clock.png';
import darkchatPng from '@apps/darkchat.png';
import mapsPng from '@apps/maps.png';
import browserPng from '@apps/browser.png';
import messagesPng from '@apps/messages.png';

export interface AppConfig {
  id: string;
  name: string;
  icon: string | React.ComponentType<any>;
  iconType: 'png' | 'lucide';
  color?: string;
  category: 'social' | 'utilities' | 'media' | 'productivity' | 'system' | 'custom';
  isActive: boolean;
  isVisible: boolean;
  isDockApp?: boolean; // Whether this app should appear in the dock
  order: number;
  description?: string;
  version?: string;
  permissions?: string[];
  dependencies?: string[];
  screen?: string; // Navigation screen
  settings?: {
    hasSettings: boolean;
    settingsPath?: string;
  };
  notifications?: {
    enabled: boolean;
    types: ('info' | 'success' | 'warning' | 'error')[];
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    darkMode?: boolean;
  };
}



// App Template for easy creation
export const createAppTemplate = (overrides: Partial<AppConfig>): AppConfig => ({
  id: '',
  name: '',
  icon: '',
  iconType: 'png',
  color: undefined,
  category: 'custom',
  isActive: true,
  isVisible: true,
  isDockApp: false,
  order: 999,
  description: '',
  version: '1.0.0',
  permissions: [],
  dependencies: [],
  settings: {
    hasSettings: false,
    settingsPath: undefined,
  },
  notifications: {
    enabled: true,
    types: ['info', 'success', 'warning', 'error'],
  },
  theme: {
    primaryColor: undefined,
    secondaryColor: undefined,
    darkMode: undefined,
  },
  ...overrides,
});

// Existing apps configuration
export const appsConfig: AppConfig[] = [
  {
    id: 'banking',
    name: 'Banking',
    icon: bankingPng,
    iconType: 'png',
    color: 'from-green-500 to-emerald-500',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 1,
    screen: 'banking',
    description: 'Manage your finances and banking',
    version: '1.0.0',
    permissions: ['financial'],
    settings: {
      hasSettings: true,
      settingsPath: '/banking/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success', 'warning', 'error'],
    },
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: twitterPng,
    iconType: 'png',
    color: 'from-blue-400 to-blue-600',
    category: 'social',
    isActive: true,
    isVisible: true,
    isEssential: false,
    isInstalled: true,
    order: 2,
    screen: 'twitter',
    description: 'Stay connected with social media',
    version: '1.0.0',
    developer: 'Twitter Inc.',
    rating: 4.2,
    downloads: 50000,
    appSize: '45.8 MB',
    permissions: ['social'],
    settings: {
      hasSettings: true,
      settingsPath: '/twitter/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: settingsPng,
    iconType: 'png',
    color: 'from-gray-500 to-gray-700',
    category: 'system',
    isActive: true,
    isVisible: true,
    isDockApp: true,
    order: 3,
    screen: 'settings',
    description: 'Phone settings and configuration',
    version: '1.0.0',
    permissions: ['system'],
    settings: {
      hasSettings: false,
    },
    notifications: {
      enabled: true,
      types: ['info', 'success', 'warning', 'error'],
    },
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: calculatorPng,
    iconType: 'png',
    color: 'from-orange-500 to-red-500',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 4,
    screen: 'calculator',
    description: 'Basic calculator functionality',
    version: '1.0.0',
    permissions: [],
    settings: {
      hasSettings: false,
    },
    notifications: {
      enabled: false,
      types: [],
    },
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: cameraPng,
    iconType: 'png',
    color: 'from-purple-500 to-pink-500',
    category: 'media',
    isActive: true,
    isVisible: true,
    isDockApp: true,
    order: 5,
    screen: 'camera',
    description: 'Take photos and videos',
    version: '1.0.0',
    permissions: ['camera', 'storage'],
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: galleryPng,
    iconType: 'png',
    color: 'from-pink-500 to-rose-500',
    category: 'media',
    isActive: true,
    isVisible: true,
    order: 6,
    screen: 'gallery',
    description: 'View and manage your photos',
    version: '1.0.0',
    permissions: ['storage'],
    settings: {
      hasSettings: true,
      settingsPath: '/gallery/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: notesPng,
    iconType: 'png',
    color: 'from-yellow-500 to-orange-500',
    category: 'productivity',
    isActive: true,
    isVisible: true,
    order: 7,
    screen: 'notes',
    description: 'Create and manage notes',
    version: '1.0.0',
    permissions: ['storage'],
    settings: {
      hasSettings: true,
      settingsPath: '/notes/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: spotifyPng,
    iconType: 'png',
    color: 'from-green-500 to-green-700',
    category: 'media',
    isActive: true,
    isVisible: true,
    order: 8,
    screen: 'spotify',
    description: 'Listen to music and podcasts',
    version: '1.0.0',
    permissions: ['media'],
    settings: {
      hasSettings: true,
      settingsPath: '/spotify/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: clockPng,
    iconType: 'png',
    color: 'from-blue-500 to-indigo-500',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 9,
    screen: 'clock',
    description: 'Clock and alarm functionality',
    version: '1.0.0',
    permissions: [],
    settings: {
      hasSettings: true,
      settingsPath: '/clock/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'warning'],
    },
  },
  {
    id: 'yellowpages',
    name: 'Yellow Pages',
    icon: BookOpen,
    iconType: 'lucide',
    color: 'from-yellow-400 to-yellow-600',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 10,
    screen: 'yellowpages',
    description: 'Business directory and contacts',
    version: '1.0.0',
    permissions: ['location'],
    settings: {
      hasSettings: true,
      settingsPath: '/yellowpages/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: contactsPng,
    iconType: 'png',
    color: 'from-indigo-500 to-purple-500',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    isDockApp: true,
    order: 11,
    screen: 'contacts',
    description: 'Manage contacts, make calls, and view call history',
    version: '1.0.0',
    permissions: ['contacts', 'phone'],
    settings: {
      hasSettings: true,
      settingsPath: '/contacts/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'darkchat',
    name: 'Dark Chat',
    icon: darkchatPng,
    iconType: 'png',
    color: 'from-gray-700 to-gray-900',
    category: 'social',
    isActive: true,
    isVisible: true,
    order: 12,
    screen: 'darkchat',
    description: 'Anonymous messaging and chat rooms',
    version: '1.0.0',
    permissions: ['social', 'location'],
    settings: {
      hasSettings: true,
      settingsPath: '/darkchat/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: mapsPng,
    iconType: 'png',
    color: 'from-blue-500 to-blue-700',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 13,
    screen: 'maps',
    description: 'Navigation and location services',
    version: '1.0.0',
    permissions: ['location', 'gps'],
    settings: {
      hasSettings: true,
      settingsPath: '/maps/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success', 'warning'],
    },
  },
  {
    id: 'mail',
    name: 'Mail',
    icon: mailPng,
    iconType: 'png',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 14,
    screen: 'mail',
    description: 'Manage your email',
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: browserPng,
    iconType: 'png',
    color: 'from-blue-500 to-indigo-600',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 15,
    screen: 'browser',
    description: 'Web browsing and search',
    version: '1.0.0',
    permissions: ['internet'],
    settings: {
      hasSettings: true,
      settingsPath: '/browser/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: messagesPng,
    iconType: 'png',
    color: 'from-green-500 to-emerald-500',
    category: 'social',
    isActive: true,
    isVisible: true,
    isDockApp: true,
    order: 16,
    screen: 'messages',
    description: 'Send and receive messages',
    version: '1.0.0',
    permissions: ['social'],
    settings: {
      hasSettings: true,
      settingsPath: '/messages/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },

  //test
  {
    id: 'test',
    name: 'Test',
    icon: browserPng,
    iconType: 'png',
    color: 'from-blue-500 to-indigo-600',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    order: 17,
    screen: 'test',
    description: 'Test app',
  },

];



// Helper functions
export const getVisibleApps = () => appsConfig.filter(app => app.isVisible && app.isActive);
export const getActiveApps = () => appsConfig.filter(app => app.isActive);
export const getAppsByCategory = (category: AppConfig['category']) => appsConfig.filter(app => app.category === category);
export const getAppById = (id: string) => appsConfig.find(app => app.id === id);

// Get apps with translated names for HomeScreen
export const getTranslatedApps = (language: string = 'en') => {
  const visibleApps = getVisibleApps();
  
  // Language translations for app names
  const translations: Record<string, Record<string, string>> = {
    tr: {
      'banking': 'Banka',
      'twitter': 'Twitter',
      'settings': 'Ayarlar',
      'calculator': 'Hesap Makinesi',
      'camera': 'Kamera',
      'gallery': 'Galeri',
      'notes': 'Notlar',
      'spotify': 'Spotify',
      'clock': 'Saat',
      'yellowpages': 'Sarı Sayfalar',
      'contacts': 'Kişiler',
      'darkchat': 'Karanlık Sohbet',
      'maps': 'Haritalar',
      'mail': 'E-Posta',
      'browser': 'Tarayıcı',
      'messages': 'Mesajlar',

    },
    en: {
      'banking': 'Banking',
      'twitter': 'Twitter',
      'settings': 'Settings',
      'calculator': 'Calculator',
      'camera': 'Camera',
      'gallery': 'Gallery',
      'notes': 'Notes',
      'spotify': 'Spotify',
      'clock': 'Clock',
      'yellowpages': 'Yellow Pages',
      'contacts': 'Contacts',
      'darkchat': 'Dark Chat',
      'maps': 'Maps',
      'mail': 'Mail',
      'browser': 'Browser',
    }
  };

  return visibleApps.map(app => ({
    ...app,
    translatedName: translations[language]?.[app.id] || app.name
  }));
};

// Easy app management functions
export const addNewApp = (newApp: AppConfig) => {
  appsConfig.push(newApp);
  // Re-sort by order
  appsConfig.sort((a, b) => a.order - b.order);
};

export const updateApp = (id: string, updates: Partial<AppConfig>) => {
  const index = appsConfig.findIndex(app => app.id === id);
  if (index !== -1) {
    appsConfig[index] = { ...appsConfig[index], ...updates };
  }
};

export const removeApp = (id: string) => {
  const index = appsConfig.findIndex(app => app.id === id);
  if (index !== -1) {
    appsConfig.splice(index, 1);
  }
};

export const toggleAppVisibility = (id: string) => {
  const app = appsConfig.find(app => app.id === id);
  if (app) {
    app.isVisible = !app.isVisible;
  }
};

export const toggleAppActive = (id: string) => {
  const app = appsConfig.find(app => app.id === id);
  if (app) {
    app.isActive = !app.isActive;
  }
};

// Dock App Helper Functions
export const getDockApps = () => appsConfig.filter(app => app.isDockApp && app.isVisible && app.isActive);

// Get dock apps with translated names
export const getTranslatedDockApps = (language: string = 'en') => {
  const dockApps = getDockApps();
  
  // Language translations for dock app names
  const dockTranslations: Record<string, Record<string, string>> = {
    tr: {
      'messages': 'Mesajlar',
      'contacts': 'Kişiler',
      'camera': 'Kamera',
      'settings': 'Ayarlar',
    },
    en: {
      'messages': 'Messages',
      'contacts': 'Contacts',
      'camera': 'Camera',
      'settings': 'Settings',
    }
  };

  return dockApps.map(app => ({
    ...app,
    translatedName: dockTranslations[language]?.[app.id] || app.name
  }));
};
