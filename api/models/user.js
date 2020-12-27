const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  username: {
    type: String, required: true, unique: true, minlength: 6, maxlength: 16, match: /^[a-z0-9-_]+$/,
  },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 200 },
  display: { type: String },
  followers: [{ type: String }],
  following: [{ type: String }],
  blocked: [{ type: String }],
});

module.exports = mongoose.model('User', UserSchema);
