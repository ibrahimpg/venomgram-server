const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  username: { type: String, required: true },
  caption: { type: String, maxlength: 200 },
  path: { type: String, required: true },
  likedBy: [{ type: String }],
  reportedBy: [{ type: String }],
  publicId: { type: String, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
