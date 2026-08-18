const Event = require('../models/Event');
const Category = require('../models/Category'); 
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getEvents = asyncHandler(async (req, res) => {
  const { category, city, startDate, endDate, search, page = 1, limit = 10, sortBy = 'date' } = req.query;
  const query = {};

  if (category) query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$text = { $search: search };
  }

  const sortOption = {};
  if (sortBy === 'popularity') {
    sortOption.registeredCount = -1;
  } else if (sortBy === 'date') {
    sortOption.date = 1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const events = await Event.find(query)
    .populate('category', 'name')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: events.length,
    total,
    page: Number(page),
    data: events
  });
});

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  const populatedEvent = await event.populate('category', 'name');
  res.status(201).json({ status: 'success', data: populatedEvent });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category', 'name');
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(200).json({ status: 'success', data: event });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category', 'name');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(200).json({ status: 'success', data: event });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});
