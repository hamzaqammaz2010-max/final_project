const express = require('express');
const { param } = require('express-validator');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(requireAuth);

router.post(
  '/events/:eventId/register',
  [param('eventId').isMongoId().withMessage('Invalid Event ID')],
  validate,
  registerForEvent
);

router.get('/my-events', getMyRegistrations);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid Registration ID')],
  validate,
  cancelRegistration
);

module.exports = router;
