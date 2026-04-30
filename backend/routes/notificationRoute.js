import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getNotificationUnreadCount,
  getNotifications,
  markAllRead,
  markRead,
  removeNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.get('/unread/count', getNotificationUnreadCount);
router.patch('/read/:id', markRead);
router.patch('/read/all', markAllRead);
router.delete('/:id', removeNotification);

export default router;
