import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

/* ─────────────────────────────────────────────────────────────
   GET /api/notifications
   Retrieve authenticated user's notifications
   ───────────────────────────────────────────────────────────── */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const filter = { recipient: req.user._id };
  if (req.query.unreadOnly === 'true') filter.read = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

  res.json({ success: true, notifications, unreadCount });
});

/* ─────────────────────────────────────────────────────────────
   PATCH /api/notifications/:id/read
   Mark a notification as read
   ───────────────────────────────────────────────────────────── */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();

  res.json({ success: true, notification });
});

/* ─────────────────────────────────────────────────────────────
   PATCH /api/notifications/read-all
   Mark all notifications as read
   ───────────────────────────────────────────────────────────── */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});
