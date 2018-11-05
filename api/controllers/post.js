// Modules
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

// Models
const Post = require('../models/post');
const User = require('../models/user');

// View Feed
exports.feed = (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => Post.find({ username: { $in: user.following } }).sort({ created: -1 }))
    .then(post => res.json(post.slice(parseInt(req.params.from, 10), parseInt(req.params.to, 10))))
    .catch(() => res.status(500));
};

// View Explore
exports.explore = (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => Post.find({
      $and: [
        { username: { $nin: user.blocked } },
        { username: { $nin: user.following } },
        { username: { $ne: user.username } },
      ],
    }).sort({ created: -1 }))
    .then(post => res.json(post.slice(parseInt(req.params.from, 10), parseInt(req.params.to, 10))))
    .catch(() => res.status(500));
};

// View Profile Gallery
exports.profile = (req, res) => {
  Post.find({ username: req.params.username }).sort({ created: -1 })
    .then(post => res.json(post.slice(parseInt(req.params.from, 10), parseInt(req.params.to, 10))))
    .catch(() => res.status(500));
};

// Make Post
exports.upload = (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, { format: 'jpg', tags: [req.tokenData.username] })
    .then(result => new Post({
      _id: new mongoose.Types.ObjectId(),
      username: req.tokenData.username,
      caption: req.body.caption,
      path: result.secure_url,
      publicId: result.public_id,
    })
      .save()
      .then(() => res.status(201).json('Picture posted.')))
    .catch(() => res.status(500));
};

// Delete Post
exports.delete = (req, res) => {
  Post.findOne({ _id: req.body.id }).exec()
    .then((post) => {
      if (post.username === req.tokenData.username) {
        return post.remove()
          .then(() => cloudinary.v2.uploader.destroy(post.publicId))
          .then(() => res.json('Picture deleted.'));
      }
      return res.status(403).json('Delete post failed.');
    })
    .catch(() => res.status(500));
};

// Like Post
exports.like = (req, res) => {
  Post.findByIdAndUpdate(req.body.id, { $addToSet: { likedBy: req.tokenData.username } },
    { runValidators: true })
    .then(() => res.json('Liked post.'))
    .catch(() => res.status(500));
};

// Unlike Post
exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(req.body.id, { $pull: { likedBy: req.tokenData.username } },
    { runValidators: true })
    .then(() => res.json('Unliked post.'))
    .catch(() => res.status(500));
};

// Report Post
exports.report = (req, res) => {
  Post.findByIdAndUpdate(req.body.id, { $addToSet: { reportedBy: req.tokenData.id } },
    { runValidators: true })
    .then(() => res.json('Reported post.'))
    .catch(() => res.status(500));
};
