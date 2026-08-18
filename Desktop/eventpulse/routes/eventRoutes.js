const express = require('express');
const { body, param } = require('express-validator');
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').notEmpty().withMessage('Event title is required'),
    body('description').notEmpty().withMessage('Event description is required'),
    body('date').isISO8601().withMessage('A valid ISO8601 date is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be an integer of at least 1'),
    body('category').isMongoId().withMessage('Valid Category ObjectId is required')
  ],
  validate,
  createEvent
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    param('id').isMongoId().withMessage('Invalid Event ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid ISO8601 date is required'),
    body('city').optional().notEmpty().withMessage('City cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('category').optional().isMongoId().withMessage('Valid Category ObjectId required')
  ],
  validate,
  updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [param('id').isMongoId().withMessage('Invalid Event ID')],
  validate,
  deleteEvent
);

module.exports = router;
