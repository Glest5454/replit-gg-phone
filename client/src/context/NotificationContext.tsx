import React, { createContext, useContext, ReactNode, useState, useCallback, useRef } from 'react';
import { NotificationData } from '@/components/ui/Notification';

interface NotificationOptions {
  duration?: number;
  dismissible?: boolean;
  action?: () => void;
}

interface NotificationContextType {
  notifications: NotificationData[];
  removeNotification: (id: string) => void;
  showInfo: (title: string, message: string, app?: string, options?: any) => string;
  showSuccess: (title: string, message: string, app?: string, options?: any) => string;
  showWarning: (title: string, message: string, app?: string, options?: any) => string;
  showError: (title: string, message: string, app?: string, options?: any) => string;
  showMessageNotification: (sender: string, message: string, options?: any) => string;
  showCallNotification: (caller: string, options?: any) => string;
  showBankingNotification: (title: string, message: string, options?: any) => string;
  showTwitterNotification: (username: string, tweet: string, options?: any) => string;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const notificationIdRef = useRef(1);

  const generateId = () => `notification-${notificationIdRef.current++}`;

  const addNotification = useCallback((
    title: string,
    message: string,
    app: string = 'system',
    type: NotificationData['type'] = 'info',
    options: NotificationOptions = {}
  ) => {
    const {
      duration = 5000,
      dismissible = true,
      action
    } = options;

    const notification: NotificationData = {
      id: generateId(),
      title,
      message,
      app,
      timestamp: new Date(),
      type,
      action,
      dismissible
    };

    console.log('Context: Adding notification:', notification);
    console.log('Context: Notification duration:', duration);

    setNotifications(prev => {
      console.log('Context: Current notifications before:', prev);
      const newNotifications = [...prev, notification];
      console.log('Context: New notifications array:', newNotifications);
      return newNotifications;
    });

    // Auto-dismiss after duration - use the individual duration parameter
    if (duration > 0) {
      console.log(`Context: Setting auto-dismiss for notification ${notification.id} after ${duration}ms`);
      setTimeout(() => {
        console.log(`Context: Auto-dismissing notification ${notification.id} after ${duration}ms`);
        removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    console.log('Context: Removing notification:', id);
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      console.log('Context: Notifications after removal:', filtered);
      return filtered;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    console.log('Context: Clearing all notifications');
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showInfo = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('Context: showInfo called:', { title, message, app, options });
    return addNotification(title, message, app, 'info', options);
  }, [addNotification]);

  const showSuccess = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('Context: showSuccess called:', { title, message, app, options });
    return addNotification(title, message, app, 'success', options);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('Context: showWarning called:', { title, message, app, options });
    return addNotification(title, message, app, 'warning', options);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('Context: showError called:', { title, message, app, options });
    return addNotification(title, message, app, 'error', options);
  }, [addNotification]);

  // App-specific notification methods
  const showMessageNotification = useCallback((sender: string, message: string, options?: NotificationOptions) => {
    console.log('Context: showMessageNotification called:', { sender, message, options });
    return addNotification(
      'New Message',
      `${sender}: ${message}`,
      'messages',
      'info',
      { ...options, action: () => console.log('Navigate to messages') }
    );
  }, [addNotification]);

  const showCallNotification = useCallback((caller: string, options?: NotificationOptions) => {
    console.log('Context: showCallNotification called:', { caller, options });
    return addNotification(
      'Incoming Call',
      caller,
      'phone',
      'info',
      { ...options, action: () => console.log('Answer call'), dismissible: false }
    );
  }, [addNotification]);

  const showBankingNotification = useCallback((title: string, message: string, options?: NotificationOptions) => {
    console.log('Context: showBankingNotification called:', { title, message, options });
    return addNotification(title, message, 'banking', 'success', options);
  }, [addNotification]);

  const showTwitterNotification = useCallback((username: string, tweet: string, options?: NotificationOptions) => {
    console.log('Context: showTwitterNotification called:', { username, tweet, options });
    return addNotification(
      `@${username}`,
      tweet,
      'twitter',
      'info',
      { ...options, action: () => console.log('View tweet') }
    );
  }, [addNotification]);

  const contextValue: NotificationContextType = {
    notifications,
    removeNotification,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showMessageNotification,
    showCallNotification,
    showBankingNotification,
    showTwitterNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
