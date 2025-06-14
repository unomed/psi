
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { userCompanies } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const companyId = userCompanies?.[0]?.companyId;

  // Fetch notifications
  const { data: fetchedNotifications } = useQuery({
    queryKey: ['notifications', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.priority === 'high' ? 'warning' : 'info' as const,
        createdAt: n.created_at,
        read: n.status === 'read'
      }));
    },
    enabled: !!companyId,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  useEffect(() => {
    if (fetchedNotifications) {
      const newNotifications = fetchedNotifications.filter(
        fn => !notifications.some(n => n.id === fn.id)
      );

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        
        // Show toast for new high priority notifications
        newNotifications
          .filter(n => n.type === 'warning' && !n.read)
          .forEach(n => {
            toast.warning(n.title, { description: n.message });
          });
      }
    }
  }, [fetchedNotifications, notifications]);

  const markAsRead = async (id: string) => {
    await supabase
      .from('psychosocial_notifications')
      .update({ status: 'read' })
      .eq('id', id);

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = async () => {
    if (!companyId) return;

    await supabase
      .from('psychosocial_notifications')
      .update({ status: 'read' })
      .eq('company_id', companyId);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
