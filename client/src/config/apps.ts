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
  Globe,
  Package
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
  isEssential: boolean; // Whether this app is essential and cannot be uninstalled
  isInstalled: boolean; // Whether this app is currently installed
   // URL to download the app (for external apps)
  appSize?: string; // Size of the app (e.g., "15.2 MB")
  order: number; // Grid position order (can be changed by user)
  description?: string;
  version?: string;
  developer?: string; // Developer/company name
  rating?: number; // App rating (1-5)
  downloads?: number; // Number of downloads
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
  isEssential: false,
  isInstalled: true,
  appSize: undefined,
  order: 999,
  description: '',
  version: '1.0.0',
  developer: undefined,
  rating: undefined,
  downloads: undefined,
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'banking',
    description: 'Manage your finances and banking',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isInstalled: false,
    order: 0,
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'settings',
    description: 'Phone settings and configuration',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.8,
    downloads: 1000,
    appSize: '8.2 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'calculator',
    description: 'Basic calculator functionality',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'camera',
    description: 'Take photos and videos',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'gallery',
    description: 'View and manage your photos',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'notes',
    description: 'Create and manage notes',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'spotify',
    description: 'Listen to music and podcasts',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'clock',
    description: 'Clock and alarm functionality',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'yellowpages',
    description: 'Business directory and contacts',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'contacts',
    description: 'Manage contacts, make calls, and view call history',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'darkchat',
    description: 'Anonymous messaging and chat rooms',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'maps',
    description: 'Navigation and location services',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'mail',
    description: 'Manage your email',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
    permissions: ['email'],
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
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'browser',
    description: 'Web browsing and search',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'messages',
    description: 'Send and receive messages',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.5,
    downloads: 1000,
    appSize: '12.5 MB',
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
  // Apps Store
  {
    id: 'apps',
    name: 'Apps',
    icon: Package,
    iconType: 'lucide',
    color: 'from-purple-500 to-pink-500',
    category: 'system',
    isActive: true,
    isVisible: true,
    isEssential: true,
    isInstalled: true,
    order: 0,
    screen: 'apps',
    description: 'Download and manage applications',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.9,
    downloads: 1000,
    appSize: '15.8 MB',
    permissions: ['system'],
    settings: {
      hasSettings: true,
      settingsPath: '/apps/settings',
    },
    notifications: {
      enabled: true,
      types: ['info', 'success'],
    },
  },
  {
    id: 'test',
    name: 'Test App',
    icon: browserPng,
    iconType: 'png',
    color: 'from-blue-500 to-indigo-600',
    category: 'utilities',
    isActive: true,
    isVisible: true,
    isEssential: false,
    isInstalled: false,
    order: 0,
    screen: 'test',
    description: 'Demo application for testing app installation system',
    version: '1.0.0',
    developer: 'Phone System',
    rating: 4.0,
    downloads: 500,
    appSize: '8.5 MB',
  
    permissions: ['basic'],
    settings: {
      hasSettings: false,
    },
    notifications: {
      enabled: false,
      types: [],
    },
  }

];



// App Manager Class for managing app installation states
export class AppManager {
  private static instance: AppManager;
  private installedApps: Set<string> = new Set();
  private appStates: Map<string, { isInstalled: boolean; installDate?: string; lastUsed?: string }> = new Map();
  private userId: string;

  private constructor() {
    this.userId = this.getUserId();
    this.loadAppStates();
  }

  public static getInstance(): AppManager {
    if (!AppManager.instance) {
      AppManager.instance = new AppManager();
    }
    return AppManager.instance;
  }

  // Get unique user ID (can be customized based on your auth system)
  private getUserId(): string {
    // Try to get from localStorage first
    let userId = localStorage.getItem('phone-user-id');
    
    if (!userId) {
      // Generate a new unique ID
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('phone-user-id', userId);
    }
    
    return userId;
  }

  // Load app states from localStorage
  private loadAppStates(): void {
    try {
      console.log(`[AppManager] Loading app states for user: ${this.userId}`);
      const stored = localStorage.getItem(`phone-app-states-${this.userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        this.installedApps = new Set(data.installedApps || []);
        this.appStates = new Map(Object.entries(data.appStates || {}));
        console.log(`[AppManager] Loaded ${this.installedApps.size} installed apps from localStorage`);
      } else {
        console.log('[AppManager] No stored app states found, initializing essential apps');
        // Initialize with essential apps for new users
        this.initializeEssentialApps();
      }
    } catch (error) {
      console.error('Error loading app states:', error);
      this.installedApps = new Set();
      this.appStates = new Map();
      this.initializeEssentialApps();
    }
  }

  // Initialize essential apps for new users
  private initializeEssentialApps(): void {
    console.log('[AppManager] Initializing essential apps for new user');
    
    // Dynamically get essential apps from appsConfig
    const essentialApps = appsConfig
      .filter(app => app.isEssential)
      .map(app => app.id);
    
    // Also get apps that are marked as installed in config
    const preInstalledApps = appsConfig
      .filter(app => app.isInstalled === true)
      .map(app => app.id);
    
    console.log('[AppManager] Essential apps:', essentialApps);
    console.log('[AppManager] Pre-installed apps:', preInstalledApps);
    
    const now = new Date().toISOString();
    
    // Initialize essential apps
    essentialApps.forEach(appId => {
      this.installedApps.add(appId);
      this.appStates.set(appId, {
        isInstalled: true,
        installDate: now,
        lastUsed: now
      });
    });
    
    // Initialize pre-installed apps
    preInstalledApps.forEach(appId => {
      if (!this.installedApps.has(appId)) { // Don't duplicate essential apps
        this.installedApps.add(appId);
        this.appStates.set(appId, {
          isInstalled: true,
          installDate: now,
          lastUsed: now
        });
      }
    });
    
    console.log(`[AppManager] Initialized ${this.installedApps.size} apps total`);
    this.saveAppStates();
    
    // Note: Removed the localStorage clearing that was preventing app persistence
    // Apps will now properly persist between sessions
  }

  // Save app states to localStorage
  private saveAppStates(): void {
    try {
      const data = {
        installedApps: Array.from(this.installedApps),
        appStates: Object.fromEntries(this.appStates),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`phone-app-states-${this.userId}`, JSON.stringify(data));
      console.log(`[AppManager] Saved ${this.installedApps.size} app states to localStorage for user ${this.userId}`);
    } catch (error) {
      console.error('Error saving app states:', error);
    }
  }

  // Check if an app is installed
  public isAppInstalled(appId: string): boolean {
    const isInstalled = this.installedApps.has(appId);
   // console.log(`AppManager.isAppInstalled(${appId}): ${isInstalled}`);
    //console.log('Current installed apps:', Array.from(this.installedApps));
    return isInstalled;
  }

  // Get app install date
  public getAppInstallDate(appId: string): string | undefined {
    return this.appStates.get(appId)?.installDate;
  }

  // Get app last used date
  public getAppLastUsed(appId: string): string | undefined {
    return this.appStates.get(appId)?.lastUsed;
  }

  // Install an app
  public async installApp(appId: string): Promise<boolean> {
    try {
      console.log(`[AppManager] Installing app: ${appId}`);
      const now = new Date().toISOString();
      this.installedApps.add(appId);
      this.appStates.set(appId, {
        isInstalled: true,
        installDate: now,
        lastUsed: now
      });
      
      console.log(`[AppManager] App ${appId} installed, total installed: ${this.installedApps.size}`);
      this.saveAppStates();
      
      // Show success notification
      this.showNotification('App installed successfully!', 'success');
      
      return true;
    } catch (error) {
      console.error('Error installing app:', error);
      this.showNotification('Failed to install app', 'error');
      return false;
    }
  }

  // Uninstall an app
  public async uninstallApp(appId: string): Promise<boolean> {
    try {
      console.log(`[AppManager] Uninstalling app: ${appId}`);
      this.installedApps.delete(appId);
      this.appStates.delete(appId);
      
      console.log(`[AppManager] App ${appId} uninstalled, total installed: ${this.installedApps.size}`);
      this.saveAppStates();
      
      // Show success notification
      this.showNotification('App uninstalled successfully!', 'success');
      
      return true;
    } catch (error) {
      console.error('Error uninstalling app:', error);
      this.showNotification('Failed to uninstall app', 'error');
      return false;
    }
  }

  // Update app usage
  public updateAppUsage(appId: string): void {
    if (this.installedApps.has(appId)) {
      const state = this.appStates.get(appId);
      if (state) {
        state.lastUsed = new Date().toISOString();
        this.appStates.set(appId, state);
        this.saveAppStates();
      }
    }
  }

  // Get all installed apps
  public getInstalledApps(): string[] {
    return Array.from(this.installedApps);
  }

  // Get app statistics
  public getAppStats(): { total: number; installed: number; essential: number } {
    const total = appsConfig.length;
    const installed = this.installedApps.size;
    const essential = appsConfig.filter(app => app.isEssential).length;
    
    return { total, installed, essential };
  }




  // Show notification (can be customized)
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // You can integrate this with your notification system
  
    // Optional: Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Phone App Manager', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  // Export app states for backup/transfer
  public exportAppStates(): string {
    const data = {
      userId: this.userId,
      installedApps: Array.from(this.installedApps),
      appStates: Object.fromEntries(this.appStates),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import app states from backup
  public importAppStates(backupData: string): boolean {
    try {
      const data = JSON.parse(backupData);
      if (data.installedApps && data.appStates) {
        this.installedApps = new Set(data.installedApps);
        this.appStates = new Map(Object.entries(data.appStates));
        this.saveAppStates();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing app states:', error);
      return false;
    }
  }
 

}

// App Manager Helper Functions
export const getAppManager = () => AppManager.getInstance();

// Get apps with installation status
export const getAppsWithInstallStatus = () => {
  const appManager = getAppManager();
  const result = appsConfig.map(app => {
    let isInstalled = false;
    
    if (app.isEssential) {
      // Essential apps are always installed
      isInstalled = true;
      //console.log(`App ${app.id}: Essential app, always installed`);
    } else {
      // AppManager state takes precedence over config
      const managerState = appManager.isAppInstalled(app.id);
      isInstalled = managerState;
      //console.log(`App ${app.id}: AppManager state=${managerState}, config state=${app.isInstalled}, final=${isInstalled}`);
    }
    
    return {
      ...app,
      isInstalled,
      installDate: appManager.getAppInstallDate(app.id),
      lastUsed: appManager.getAppLastUsed(app.id)
    };
  });
  
  const installedCount = result.filter(app => app.isInstalled).length;
 // console.log(`[getAppsWithInstallStatus] Returning ${result.length} apps, ${installedCount} installed`);
  
  return result;
};

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
      'test': 'Test',
      'apps': 'Uygulamalar',

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
      'messages': 'Messages',
      'test': 'Test',
      'apps': 'Apps',
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
