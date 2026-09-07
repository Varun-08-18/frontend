import api from './api';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  expenseId?: number;
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get('/notifications');

  return response.data;
}

export async function markNotificationAsRead(id: number) {
  const response = await api.patch(
    `/notifications/${id}/read`,
  );

  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch(
    '/notifications/read-all',
  );

  return response.data;
}