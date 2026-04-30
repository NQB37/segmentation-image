import Notification from '../models/notificationModel.js';
import { emitToUser } from '../utils/socket.js';

const populateNotification = (query) =>
  query.populate([
    { path: 'fromId', select: '_id email name avatar' },
    { path: 'boardId', select: '_id title image' },
    { path: 'inviteId', select: '_id status' },
  ]);

const createNotification = async ({
  toId,
  fromId,
  type,
  title,
  message,
  boardId,
  inviteId,
}) => {
  const notification = await Notification.create({
    toId,
    fromId,
    type,
    title,
    message,
    boardId,
    inviteId,
  });

  const populated = await populateNotification(
    Notification.findById(notification._id),
  );

  emitToUser(toId, 'notification.created', populated);
  return populated;
};

const createNotifications = async (items) => {
  const results = [];

  for (const item of items.filter(Boolean)) {
    try {
      const notification = await createNotification(item);
      results.push(notification);
    } catch (error) {
      console.error('Failed to create notification:', error.message);
    }
  }

  return results;
};

const listNotifications = (toId) =>
  populateNotification(
    Notification.find({ toId }).sort({ createdAt: -1 }).limit(50),
  );

const getUnreadCount = (toId) =>
  Notification.countDocuments({ toId, readAt: null });

const markNotificationRead = async (toId, notificationId) => {
  const notification = await populateNotification(
    Notification.findOneAndUpdate(
      { _id: notificationId, toId },
      { $set: { readAt: new Date() } },
      { new: true },
    ),
  );

  if (notification) {
    emitToUser(toId, 'notification.updated', notification);
  }

  return notification;
};

const markAllNotificationsRead = async (toId) => {
  await Notification.updateMany(
    { toId, readAt: null },
    { $set: { readAt: new Date() } },
  );

  emitToUser(toId, 'notification.readAll', { toId });
};

const deleteNotification = async (toId, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    toId,
  });

  if (notification) {
    emitToUser(toId, 'notification.deleted', {
      _id: notification._id,
    });
  }

  return notification;
};

export {
  createNotification,
  createNotifications,
  deleteNotification,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
};
