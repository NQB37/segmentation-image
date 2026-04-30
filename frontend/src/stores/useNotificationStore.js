import { create } from 'zustand';
import { io } from 'socket.io-client';
import apiClient, { API_URL } from '../api/client';

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const mergeNotification = (notifications, notification) => {
  if (!notification?._id) {
    return notifications;
  }

  const exists = notifications.some((item) => item._id === notification._id);
  if (exists) {
    return notifications.map((item) =>
      item._id === notification._id ? notification : item,
    );
  }

  return [notification, ...notifications];
};

const disconnectSocket = (socket) => {
  if (socket) {
    socket.disconnect();
  }
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  socket: null,
  activeToken: null,
  unreadCount: () =>
    get().notifications.filter((notification) => !notification.readAt).length,
  clearNotifications: () => {
    disconnectSocket(get().socket);
    set({
      notifications: [],
      isLoading: false,
      error: null,
      socket: null,
      activeToken: null,
    });
  },
  refreshNotifications: async (token) => {
    if (!token) {
      get().clearNotifications();
      return;
    }

    set({ isLoading: true });
    try {
      const response = await apiClient.get(
        '/api/notificationRoute',
        authConfig(token),
      );
      set({ notifications: response.data, error: null });
    } catch (requestError) {
      set({ error: requestError });
    } finally {
      set({ isLoading: false });
    }
  },
  connectSocket: (token) => {
    if (!token) {
      get().clearNotifications();
      return;
    }

    if (get().activeToken === token && get().socket) {
      return;
    }

    disconnectSocket(get().socket);

    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('notification.created', (notification) => {
      set((state) => ({
        notifications: mergeNotification(state.notifications, notification),
      }));
    });

    socket.on('notification.updated', (notification) => {
      set((state) => ({
        notifications: mergeNotification(state.notifications, notification),
      }));
    });

    socket.on('notification.deleted', ({ _id }) => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification._id !== _id,
        ),
      }));
    });

    socket.on('notification.readAll', () => {
      const now = new Date().toISOString();
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          readAt: notification.readAt || now,
        })),
      }));
    });

    set({ socket, activeToken: token });
  },
  markAsRead: async (notificationId, token) => {
    const response = await apiClient.patch(
      `/api/notificationRoute/read/${notificationId}`,
      {},
      authConfig(token),
    );
    set((state) => ({
      notifications: mergeNotification(state.notifications, response.data),
    }));
  },
  markAllAsRead: async (token) => {
    await apiClient.patch(
      '/api/notificationRoute/read/all',
      {},
      authConfig(token),
    );
    const now = new Date().toISOString();
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        readAt: notification.readAt || now,
      })),
    }));
  },
  deleteNotification: async (notificationId, token) => {
    await apiClient.delete(
      `/api/notificationRoute/${notificationId}`,
      authConfig(token),
    );
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification._id !== notificationId,
      ),
    }));
  },
}));
