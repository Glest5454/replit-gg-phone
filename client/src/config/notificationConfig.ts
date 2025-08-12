import { 
    MessageCircle, 
    Phone, 
    Camera, 
    Settings,
    CreditCard, 
    Twitter, 
    Calculator, 
    Images, 
    Music, 
    Clock, 
    Book, 
    Users,  
    Bell 
}  from 'lucide-react';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  app: string;
  icon?: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: () => void;
  dismissible?: boolean;
}

// App icon mapping for notifications - returns icon component instead of JSX
export const getAppIcon = (app: string) => {
  const iconMap: Record<string, any> = {
    'messages': MessageCircle,
    'phone': Phone,
    'camera': Camera,
    'settings': Settings,
    'banking': CreditCard,
    'twitter': Twitter,
    'calculator': Calculator,
    'gallery': Images,
    'music': Music,
    'clock': Clock,
    'yellowpages': Book,
    'contacts': Users,
    'system': Bell,
  };
  
  return iconMap[app.toLowerCase()] || Bell;
};

// Notification type styles
export const getTypeStyles = (type: NotificationData['type']) => {
  const styles = {
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-100',
    success: 'bg-green-500/20 border-green-500/30 text-green-100',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100',
    error: 'bg-red-500/20 border-red-500/30 text-red-100',
  };
  return styles[type];
};

// Time formatting for notifications
export const formatNotificationTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

// Notification categories and their default settings
export const notificationCategories = {
  social: {
    enabled: true,
    types: ['info', 'success'],
    defaultDuration: 5000,
  },
  utilities: {
    enabled: true,
    types: ['info', 'success', 'warning'],
    defaultDuration: 4000,
  },
  media: {
    enabled: true,
    types: ['info', 'success'],
    defaultDuration: 5000,
  },
  productivity: {
    enabled: true,
    types: ['info', 'success'],
    defaultDuration: 4000,
  },
  system: {
    enabled: true,
    types: ['info', 'success', 'warning', 'error'],
    defaultDuration: 6000,
  },
};

// Default notification settings
export const defaultNotificationSettings = {
  enabled: true,
  sound: true,
  vibration: true,
  autoDismiss: true,
  defaultDuration: 5000,
  maxNotifications: 5,
  position: 'top-right',
  animation: 'slide-up',
};
