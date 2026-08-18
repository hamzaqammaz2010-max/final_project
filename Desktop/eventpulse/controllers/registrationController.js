const Registration = require('../models/Registration');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  if (event.registeredCount >= event.capacity) {
    return next(new AppError('Event has reached full capacity', 400));
  }

  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: eventId
  });

  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 400));
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: eventId
  });

  event.registeredCount += 1;
  await event.save();

  res.status(201).json({
    status: 'success',
    data: registration
  });
});

exports.getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id }).populate({
    path: 'event',
    populate: { path: 'category', select: 'name' }
  });

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations
  });
});

exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!registration) {
    return next(new AppError('Registration record not found or access unauthorized', 404));
  }

  const eventId = registration.event;
  await registration.deleteOne();

  await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });

  res.status(200).json({
    status: 'success',
    message: 'Registration cancelled successfully'
  });
});
