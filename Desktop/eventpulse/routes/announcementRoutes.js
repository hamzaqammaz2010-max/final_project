const express = require('express');
const { param, body } = require('express-validator');
const { getEventAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const validate = require('../middleware/validateMiddleware');
const { protect, restrictTo, requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/events/:eventId/announcements',
  [param('eventId').isMongoId().withMessage('Invalid Event ID')],
  validate,
  getEventAnnouncements
);

router.post(
  '/events/:eventId/announcements',
  requireAuth,
  requireRole('admin'),
  [
    param('eventId').isMongoId().withMessage('Invalid Event ID'),
    body('content').trim().notEmpty().withMessage('Content is required')
  ],
  validate,
  createAnnouncement
);

module.exports = router;