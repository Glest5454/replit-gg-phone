import { useState, useCallback, useRef } from 'react';
import { NotificationData } from '@/components/ui/Notification';

interface NotificationOptions {
  duration?: number;
  dismissible?: boolean;
  action?: () => void;
}

export const useNotifications = () => {
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

    console.log('Adding notification:', notification);

    setNotifications(prev => {
      console.log('Current notifications before:', prev);
      const newNotifications = [...prev, notification];
      console.log('New notifications array:', newNotifications);
      return newNotifications;
    });

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        console.log('Auto-dismissing notification:', notification.id);
        removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  }, []); // Removed notifications dependency

  const removeNotification = useCallback((id: string) => {
    console.log('Removing notification:', id);
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      console.log('Notifications after removal:', filtered);
      return filtered;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    console.log('Clearing all notifications');
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showInfo = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('showInfo called:', { title, message, app, options });
    return addNotification(title, message, app, 'info', options);
  }, [addNotification]);

  const showSuccess = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('showSuccess called:', { title, message, app, options });
    return addNotification(title, message, app, 'success', options);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('showWarning called:', { title, message, app, options });
    return addNotification(title, message, app, 'warning', options);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, app?: string, options?: NotificationOptions) => {
    console.log('showError called:', { title, message, app, options });
    return addNotification(title, message, app, 'error', options);
  }, [addNotification]);

  // App-specific notification methods
  const showMessageNotification = useCallback((sender: string, message: string, options?: NotificationOptions) => {
    console.log('showMessageNotification called:', { sender, message, options });
    return addNotification(
      'New Message',
      `${sender}: ${message}`,
      'messages',
      'info',
      { ...options, action: () => console.log('Navigate to messages') }
    );
  }, [addNotification]);

  const showCallNotification = useCallback((caller: string, options?: NotificationOptions) => {
    console.log('showCallNotification called:', { caller, options });
    return addNotification(
      'Incoming Call',
      caller,
      'phone',
      'info',
      { ...options, action: () => console.log('Answer call'), dismissible: false }
    );
  }, [addNotification]);

  const showBankingNotification = useCallback((title: string, message: string, options?: NotificationOptions) => {
    console.log('showBankingNotification called:', { title, message, options });
    return addNotification(title, message, 'banking', 'success', options);
  }, [addNotification]);

  const showTwitterNotification = useCallback((username: string, tweet: string, options?: NotificationOptions) => {
    console.log('showTwitterNotification called:', { username, tweet, options });
    return addNotification(
      `@${username}`,
      tweet,
      'twitter',
      'info',
      { ...options, action: () => console.log('View tweet') }
    );
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showMessageNotification,
    showCallNotification,
    showBankingNotification,
    showTwitterNotification
  };
};
