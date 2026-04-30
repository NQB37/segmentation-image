import mongoose from 'mongoose';
import {
  deleteNotification,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService.js';

const getNotifications = async (req, res) => {
  try {
    const notifications = await listNotifications(req.user._id);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getNotificationUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user._id);
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const markRead = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid notification ID.' });
  }

  try {
    const notification = await markNotificationRead(req.user._id, id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await markAllNotificationsRead(req.user._id);
    return res.status(200).json({ message: 'Notifications marked read.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeNotification = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid notification ID.' });
  }

  try {
    const notification = await deleteNotification(req.user._id, id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  getNotificationUnreadCount,
  getNotifications,
  markAllRead,
  markRead,
  removeNotification,
};
