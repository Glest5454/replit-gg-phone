import { useNotificationContext } from '@/context/NotificationContext';
import { Notification } from '@/components/ui/Notification';

export const NotificationManager = () => {
  const { notifications, removeNotification } = useNotificationContext();

  // Debug logging
  /*console.log('NotificationManager render - notifications count:', notifications.length);
  console.log('Current notifications:', notifications);
  console.log('NotificationManager is rendering with notifications:', notifications);*/

  const handleDismiss = (id: string) => {
    /*console.log('Dismissing notification:', id);*/
    removeNotification(id);
  };

  const handleAction = (notificationId: string) => {
    // Handle notification action if needed
    /*console.log('Notification action triggered:', notificationId);*/
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 99999, overflow: 'hidden' }}>
      {/* Real notifications */}
      {notifications.map((notification, index) => {
        /*console.log('Rendering notification:', notification.id);*/  
        return (
          <div key={notification.id} className="pointer-events-auto" style={{ 
            position: 'absolute',
            top: `${100 + (index * 60)}px`, // Daha az mesafe (60px)
            right: '50px', // Telefon ekranının sağ kenarından içeride
            zIndex: 99999
          }}>
            <Notification
              notification={notification}
              onDismiss={handleDismiss}
              onAction={() => handleAction(notification.id)}
            />
          </div>
        );
      })}
    </div>
  );
};
