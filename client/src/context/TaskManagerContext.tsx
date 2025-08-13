import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

export interface RecentApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  lastOpened: Date;
  component: React.ComponentType<any>;
  props?: any;
}

interface TaskManagerContextType {
  recentApps: RecentApp[];
  addToRecent: (app: Omit<RecentApp, 'lastOpened'>) => void;
  removeFromRecent: (appId: string) => void;
  removeAllRecentApps: () => void;
  clearRecent: () => void;
  openApp: (appId: string) => void;
  isTaskManagerOpen: boolean;
  openTaskManager: () => void;
  closeTaskManager: () => void;
}

const TaskManagerContext = createContext<TaskManagerContextType | undefined>(undefined);

export const useTaskManager = () => {
  const context = useContext(TaskManagerContext);
  if (!context) {
    throw new Error('useTaskManager must be used within a TaskManagerProvider');
  }
  return context;
};

interface TaskManagerProviderProps {
  children: ReactNode;
  onAppSwitch?: (appId: string) => void;
}

export const TaskManagerProvider = ({ children, onAppSwitch }: TaskManagerProviderProps) => {
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);

  const addToRecent = useCallback((app: Omit<RecentApp, 'lastOpened'>) => {
    setRecentApps(prev => {
      // Remove if already exists
      const filtered = prev.filter(existing => existing.id !== app.id);
      
      // Add to beginning with current timestamp
      const newApp: RecentApp = {
        ...app,
        lastOpened: new Date()
      };
      
      // Keep only last 5 apps
      return [newApp, ...filtered].slice(0, 5);
    });
  }, []);

  const removeFromRecent = useCallback((appId: string) => {
    setRecentApps(prev => prev.filter(app => app.id !== appId));
  }, []);

  const removeAllRecentApps = useCallback(() => {
    setRecentApps([]);
  }, []);

  const clearRecent = useCallback(() => {
    setRecentApps([]);
  }, []);

  const openApp = useCallback((appId: string) => {
    if (onAppSwitch) {
      onAppSwitch(appId);
    }
    closeTaskManager();
  }, [onAppSwitch]);

  const openTaskManager = useCallback(() => {
    setIsTaskManagerOpen(true);
  }, []);

  const closeTaskManager = useCallback(() => {
    setIsTaskManagerOpen(false);
  }, []);

  const contextValue: TaskManagerContextType = {
    recentApps,
    addToRecent,
    removeFromRecent,
    removeAllRecentApps,
    clearRecent,
    openApp,
    isTaskManagerOpen,
    openTaskManager,
    closeTaskManager
  };

  return (
    <TaskManagerContext.Provider value={contextValue}>
      {children}
    </TaskManagerContext.Provider>
  );
};
