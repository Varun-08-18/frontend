'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  Notification,
} from '@/services/notification.service';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error,
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {unreadCount} unread notification
            {unreadCount !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Button
            variant="contained"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <Paper sx={{ p: 4 }}>
            <Typography color="text.secondary">
              No notifications found.
            </Typography>
          </Paper>
        )}

      {!loading &&
        !error &&
        notifications.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {notifications.map((notification) => (
              <Paper
                key={notification.id}
                sx={{
                  p: 2.5,
                  border: notification.isRead
                    ? '1px solid #e0e0e0'
                    : '2px solid #1976d2',
                  backgroundColor: notification.isRead
                    ? 'white'
                    : '#f5f9ff',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: notification.isRead ? 500 : 700,
                      }}
                    >
                      {notification.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ mt: 1 }}
                    >
                      {notification.message}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  {!notification.isRead && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleMarkAsRead(notification.id)
                      }
                    >
                      Mark as Read
                    </Button>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}
    </Box>
  );
}