import type { Screen } from '@/hooks/usePhone';
import { usePhone } from '@/hooks/usePhone';
import { useLanguage } from '@/hooks/useLanguage';
import { getTranslatedApps, getTranslatedDockApps, getAppsWithInstallStatus, getAppManager } from '@/config/apps';
import { useTaskManager } from '@/context/TaskManagerContext';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Edit3, X, Check } from 'lucide-react';

interface HomeScreenProps {
  onAppOpen: (screen: Screen) => void;
}

// Not currently used but kept for future manual grid overrides
const apps = [] as const;

export const HomeScreen = ({ onAppOpen }: HomeScreenProps) => {
  const { t, language } = useLanguage();
  const { phoneState } = usePhone();
  const { addToRecent } = useTaskManager();
  
  // Force re-render when apps change
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Get apps with translated names and installation status
  const allApps = useMemo(() => getAppsWithInstallStatus(), []);
  const apps = useMemo(() => {
    const translatedApps = getTranslatedApps(language === 'english' ? 'en' : 'tr');
    // Only show installed apps in home screen and sort by order
    const installedApps = translatedApps.filter(app => allApps.find((a: any) => a.id === app.id)?.isInstalled);
    return installedApps.sort((a, b) => a.order - b.order);
  }, [language, allApps, refreshTrigger]);

  // Listen for app state changes from Apps app
  useEffect(() => {
    const handleAppStateChange = () => {
      // Force re-render by updating a dependency
      // This will trigger the useMemo to recalculate apps
      setCurrentPage(prev => prev);
    };

    window.addEventListener('phone:appStateChanged', handleAppStateChange);
    return () => window.removeEventListener('phone:appStateChanged', handleAppStateChange);
  }, []);

  // Force re-render when allApps changes
  useEffect(() => {
    // This will trigger the apps useMemo to recalculate
  }, [allApps]);
  
  // Get dock apps with translated names based on current language
  const dockApps = getTranslatedDockApps(language === 'english' ? 'en' : 'tr');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedApp, setDraggedApp] = useState<string | null>(null);
  const [dragOverApp, setDragOverApp] = useState<string | null>(null);
  
  // Calculate pages (4x4 grid = 16 apps per page)
  const appsPerPage = 16;
  const totalPages = Math.ceil(apps.length / appsPerPage);
  
  // Touch/swipe refs
  const appGridRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);

  // Touch event handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    touchEndRef.current = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50; // Minimum distance for swipe to register
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && currentPage < totalPages - 1) {
        // Swipe left - next page
        setCurrentPage(prev => prev + 1);
        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      } else if (diff < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(prev => prev - 1);
        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
    
    setIsDragging(false);
  }, [isDragging, currentPage, totalPages]);

  // Mouse event handlers for desktop drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && currentPage < totalPages - 1) {
        // Drag left - next page
        setCurrentPage(prev => prev + 1);
        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      } else if (diff < 0 && currentPage > 0) {
        // Drag right - previous page
        setCurrentPage(prev => prev - 1);
        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
    
    setIsDragging(false);
  }, [isDragging, startX, currentX, currentPage, totalPages]);

  // Get current page apps
  const getCurrentPageApps = useMemo(() => {
    const startIndex = currentPage * appsPerPage;
    const endIndex = startIndex + appsPerPage;
    return apps.slice(startIndex, endIndex);
  }, [currentPage, apps, appsPerPage]);

  // Scroll to top when page changes
  useEffect(() => {
    if (appGridRef.current) {
      appGridRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage]);

  // Page change handler
  const handlePageChange = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex);
    // Haptic feedback (if available)
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  // Edit mode toggle
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  // Exit edit mode
  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
    setDraggedApp(null);
    setDragOverApp(null);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  // Drag & Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, appId: string) => {
    if (!isEditMode) return;
    setDraggedApp(appId);
    e.dataTransfer.effectAllowed = 'move';
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [isEditMode]);

  const handleDragOver = useCallback((e: React.DragEvent, appId: string) => {
    if (!isEditMode || !draggedApp || draggedApp === appId) return;
    e.preventDefault();
    setDragOverApp(appId);
  }, [isEditMode, draggedApp]);

    // ... existing code ...

const handleDrop = useCallback((e: React.DragEvent, targetAppId: string) => {
  if (!isEditMode || !draggedApp || draggedApp === targetAppId) return;
  e.preventDefault();
  
  console.log(`[DragDrop] Dropping ${draggedApp} onto ${targetAppId}`);
  
  const appManager = getAppManager();
  const draggedAppData = apps.find(app => app.id === draggedApp);
  const targetAppData = apps.find(app => app.id === targetAppId);
  
  if (draggedAppData && targetAppData) {
    console.log(`[DragDrop] Before swap: ${draggedApp}=${draggedAppData.order}, ${targetAppId}=${targetAppData.order}`);
    
    // Simple position swap (0, 1, 2, 3...)
    const tempPosition = draggedAppData.order;
    appManager.updateAppPosition(draggedApp, targetAppData.order);
    appManager.updateAppPosition(targetAppId, tempPosition);
    
    // Save to localStorage
    appManager.saveGridOrder();
    
    console.log(`[DragDrop] After swap: ${draggedApp}=${targetAppData.order}, ${targetAppId}=${tempPosition}`);
    
    // Force re-render by updating refresh trigger
    setRefreshTrigger(prev => prev + 1);
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }
  
  setDraggedApp(null);
  setDragOverApp(null);
}, [isEditMode, draggedApp, apps]);

// ... existing code ...

  const handleDragEnd = useCallback(() => {
    setDraggedApp(null);
    setDragOverApp(null);
  }, []);

  // Get wallpaper from localStorage or use default
  const wallpaper = localStorage.getItem('phone-wallpaper') || 'default';

  // Function to get background style based on wallpaper
  const getBackgroundStyle = useMemo(() => {
    if (wallpaper === 'default') {
      return { background: 'linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 20% 10%) 100%)' };
    }
    
    // Check if it's a URL (starts with http or https)
    if (wallpaper.startsWith('http')) {
      return { 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // For predefined wallpapers, use CSS variables or predefined styles
    const wallpaperStyles: Record<string, string> = {
      'sunset': 'linear-gradient(135deg, hsl(25 100% 50%) 0%, hsl(330 100% 50%) 50%, hsl(270 100% 60%) 100%)',
      'ocean': 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(180 100% 50%) 50%, hsl(180 100% 40%) 100%)',
      'forest': 'linear-gradient(135deg, hsl(120 100% 40%) 0%, hsl(160 100% 40%) 50%, hsl(180 100% 40%) 100%)',
      'space': 'linear-gradient(135deg, hsl(270 100% 30%) 0%, hsl(220 100% 30%) 50%, hsl(0 0% 0%) 100%)',
      'aurora': 'linear-gradient(135deg, hsl(120 100% 50%) 0%, hsl(210 100% 50%) 50%, hsl(270 100% 60%) 100%)'
    };
    
    return { 
      background: wallpaperStyles[wallpaper] || 'linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 20% 10%) 100%)'
    };
  }, [wallpaper]);

  const handleAppOpen = useCallback((screen: Screen) => {
    // Find the app data
    const app = apps.find(a => a.screen === screen);
    if (app) {
      // Add to recent apps
      addToRecent({
        id: screen,
        name: app.translatedName,
        icon: typeof app.icon === 'string' ? app.icon : 'grid-3x3',
        color: app.color || 'bg-samsung-blue',
        component: () => null, // This will be handled by the navigation system
      });
    }
    
    // Open the app
    onAppOpen(screen);
  }, [apps, addToRecent, onAppOpen]);

  const handleDockAppOpen = useCallback((screen: Screen) => {
    // Find the dock app data
    const dockApp = dockApps.find(a => a.screen === screen);
    if (dockApp) {
      // Add dock app to recent apps
      addToRecent({
        id: screen,
        name: dockApp.translatedName,
        icon: typeof dockApp.icon === 'string' ? dockApp.icon : 'grid-3x3',
        color: dockApp.color || 'bg-samsung-blue',
        component: () => null, // This will be handled by the navigation system
      });
    }
    
    // Open the app
    onAppOpen(screen);
  }, [dockApps, addToRecent, onAppOpen]);

  return (
    <div 
      className="absolute inset-0 flex flex-col"
      style={getBackgroundStyle}
    >
      {/* Edit Mode Header */}
      {isEditMode && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Edit Apps</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exitEditMode}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={exitEditMode}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Grid */}
      <div className={`pt-16 px-6 h-full overflow-y-auto ${isEditMode ? 'pt-24' : ''}`}>
        <div 
          ref={appGridRef}
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
                     {/* App Grid Container */}
           <div className="grid grid-cols-4 gap-6 mb-8">
             {getCurrentPageApps.map((app) => (
               <div
                 key={app.id}
                 draggable={isEditMode}
                 onDragStart={(e) => handleDragStart(e, app.id)}
                 onDragOver={(e) => handleDragOver(e, app.id)}
                 onDrop={(e) => handleDrop(e, app.id)}
                 onDragEnd={handleDragEnd}
                 className={`flex flex-col items-center space-y-2 group transition-all duration-200 ${
                   isEditMode ? 'cursor-move' : 'cursor-pointer'
                 } ${
                   draggedApp === app.id ? 'opacity-50 scale-95' : ''
                 } ${
                   dragOverApp === app.id ? 'ring-2 ring-blue-400 scale-110' : ''
                 }`}
               >
                                  <button
                   onClick={() => !isEditMode && handleAppOpen(app.screen as Screen)}
                   onMouseDown={(e) => {
                     if (!isEditMode) {
                       const timer = setTimeout(() => {
                         if (e.button === 0) { // Left click only
                           toggleEditMode();
                         }
                       }, 500); // 500ms long press
                       
                       const handleMouseUp = () => {
                         clearTimeout(timer);
                         document.removeEventListener('mouseup', handleMouseUp);
                       };
                       
                       document.addEventListener('mouseup', handleMouseUp);
                     }
                   }}
                   onTouchStart={(e) => {
                     if (!isEditMode) {
                       const timer = setTimeout(() => {
                         toggleEditMode();
                       }, 500); // 500ms long press
                       
                       const handleTouchEnd = () => {
                         clearTimeout(timer);
                         document.removeEventListener('touchend', handleTouchEnd);
                       };
                       
                       document.addEventListener('touchend', handleTouchEnd);
                     }
                   }}
                   className="flex flex-col items-center space-y-2 group transition-transform duration-200 hover:scale-110"
                 >
                   <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-lg ${
                     app.iconType === 'lucide' 
                       ? `bg-gradient-to-br ${app.color} ` 
                       : ''
                   }`}>
                     {app.iconType === 'png' ? (
                       <img src={app.icon as string} alt={app.name} className="w-14 h-14 object-contain" />
                     ) : (
                       <app.icon className="w-10 h-10 text-white" /> 
                     )}
                   </div>
                   <span className="home-screen-text text-xs font-medium text-center text-white">{app.translatedName}</span>
                 </button>
               </div>
            ))}
          </div>
        </div>
        
        {/* Professional Dock - One UI Style */}
        <div className="absolute bottom-10 left-4 right-4">
          <div className="dock-app bg-black/60 backdrop-blur-xl rounded-[32px] px-6 py-4 border border-white/10">
            <div className="flex justify-between items-center">
              {dockApps.map((dockApp) => (
                <button 
                  key={dockApp.id}
                  className="oneui-button flex flex-col items-center space-y-1 transition-transform duration-200 hover:scale-110"
                  onClick={() => handleDockAppOpen(dockApp.screen as Screen)}
                  data-testid={`dock-${dockApp.id}`}
                >
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center  
                    ${dockApp.iconType === 'lucide' ? 'bg-gradient-to-br ' : ''}
                    ${dockApp.color}`}>
                    {dockApp.iconType === 'png' ? (
                      <img src={dockApp.icon as string} alt={dockApp.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <dockApp.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className="home-screen-text text-[10px] font-medium">{dockApp.translatedName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Indicators - Completely Fixed Position */}
      {totalPages > 1 && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-32 z-10">
          <div className="flex justify-center items-center space-x-2 mb-6 mt-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentPage 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
