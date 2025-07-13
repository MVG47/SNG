import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  isLoading: false,
  notifications: [],
  sidebarOpen: false,
  theme: 'light',
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto remove after duration
    setTimeout(() => {
      get().removeNotification(id);
    }, notification.duration || 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen
    }));
  },
  
  setTheme: (theme) => {
    set({ theme });
  }
})); 