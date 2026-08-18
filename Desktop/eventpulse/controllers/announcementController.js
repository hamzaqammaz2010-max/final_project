const Message = require('../models/Message');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getEventAnnouncements = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages
  });
});

exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { content } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  let newAnnouncement = await Message.create({
    event: eventId,
    sender: req.user._id,
    content
  });

  newAnnouncement = await newAnnouncement.populate('sender', 'name role');

  const io = req.app.get('io');
  if (io) {
    io.to(eventId).emit('announcement', newAnnouncement);
  }

  res.status(201).json({
    status: 'success',
    data: newAnnouncement
  });
});