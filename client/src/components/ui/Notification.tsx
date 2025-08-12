import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  NotificationData, 
  getAppIcon, 
  getTypeStyles, 
  formatNotificationTime 
} from '@/config/notificationConfig';

interface NotificationProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
  onAction?: () => void;
}

export const Notification = ({ notification, onDismiss, onAction }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug logging
     /*console.log('Notification component render:', notification);
  console.log('Notification isVisible state:', isVisible);*/

  useEffect(() => {
    // Slide in animation
    /*console.log('Notification useEffect - setting visible to true');*/
    const timer = setTimeout(() => {
      /*console.log('Setting notification visible');*/
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    /*console.log('Notification handleDismiss called');*/
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const handleAction = () => {
    /*console.log('Notification handleAction called');*/
    if (onAction) {
      onAction();
    }
    if (notification.action) {
      notification.action();
    }
    handleDismiss();
  };

  /*console.log('Notification render - isVisible:', isVisible, 'notification:', notification);*/      

  return (
    <div
      className={`relative z-[99999] w-72 max-w-sm transition-all duration-300 ease-out ${
        isVisible ? 'animate-oneui-slide-up' : 'animate-oneui-slide-down'
      }`}
    >
      <div
        className={`relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 shadow-2xl ${getTypeStyles(notification.type)}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header - More compact */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
              {(() => {
                const IconComponent = getAppIcon(notification.app);
                return <IconComponent className="w-4 h-4 text-white" />;
              })()}
            </div>
            <div>
              <h4 className="font-semibold text-xs">{notification.title}</h4>
              <p className="text-[10px] opacity-70">{formatNotificationTime(notification.timestamp)}</p>
            </div>
          </div>
          
          {notification.dismissible !== false && (
            <button
              onClick={handleDismiss}
              className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-2 h-2" />
            </button>
          )}
        </div>

        {/* Message - More compact */}
        <div className="mb-1.5">
          <p className="text-xs leading-tight">{notification.message}</p>
        </div>

        {/* Action Button - Only if needed */}
        {notification.action && (
          <div className="flex justify-end">
            <button
              onClick={handleAction}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
            >
              View
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-white/40 transition-all duration-300 ease-out"
            style={{ width: isExpanded ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};
