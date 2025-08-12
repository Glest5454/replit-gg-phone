// Global notification utility functions
// These can be imported and used anywhere in the app

import { useNotificationContext } from '@/context/NotificationContext';

// Hook to use notifications in components
export const useNotifications = () => {
  return useNotificationContext();
};

// Example usage functions
export const Phone = {
  Notifications: {
    // Basic notifications
    show: (title: string, message: string, app?: string, options?: any) => {
      // This will be called from components using the hook
      console.log('Notification requested:', { title, message, app, options });
    },
    
    // App-specific notifications
    showMessage: (sender: string, message: string) => {
      console.log('Message notification:', { sender, message });
    },
    
    showCall: (caller: string) => {
      console.log('Call notification:', { caller });
    },
    
    showBanking: (title: string, message: string) => {
      console.log('Banking notification:', { title, message });
    },
    
    showTwitter: (username: string, tweet: string) => {
      console.log('Twitter notification:', { username, tweet });
    },
    
    // System notifications
    showInfo: (title: string, message: string) => {
      console.log('Info notification:', { title, message });
    },
    
    showSuccess: (title: string, message: string) => {
      console.log('Success notification:', { title, message });
    },
    
    showWarning: (title: string, message: string) => {
      console.log('Warning notification:', { title, message });
    },
    
    showError: (title: string, message: string) => {
      console.log('Error notification:', { title, message });
    },
    
    // Utility functions
    clearAll: () => {
      console.log('Clear all notifications');
    }
  }
};

// Example of how to use in components:
/*
import { useNotifications } from '@/utils/notifications';

const MyComponent = () => {
  const { showSuccess, showMessageNotification } = useNotifications();
  
  const handleSuccess = () => {
    showSuccess('Success!', 'Operation completed successfully', 'banking');
  };
  
  const handleNewMessage = () => {
    showMessageNotification('John Doe', 'Hey, are you online?');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleNewMessage}>Show Message</button>
    </div>
  );
};
*/
