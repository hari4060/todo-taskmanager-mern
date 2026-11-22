const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    // Stores the bcrypt hash, never the plain password
    password: {
      type: String,
      required: true,
      select: false, // excluded from queries unless explicitly requested
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
