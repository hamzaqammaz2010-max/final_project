const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'User password is required']
    },
    role: {
      type: String,
      enum: ['admin', 'attendee'],
      default: 'attendee'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
