/* eslint-disable no-underscore-dangle */
// Modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

// Models
const User = require('../models/user');
const Post = require('../models/post');

// View User Profile Username/Bio
exports.user = (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => res.json({
      bio: user.bio,
      username: user.username,
      display: user.display,
      followers: user.followers,
      following: user.following,
    }))
    .catch(() => res.status(500));
};

// View Your Profile Details/Settings
exports.self = (req, res) => {
  User.findOne({ username: req.tokenData.username })
    .then(user => res.json(user))
    .catch(() => res.status(500));
};

// Register User
exports.register = (req, res) => {
  console.log("attempting reg...");
  User.find({ username: req.body.username }).exec()
    .then((user) => {
      if (user.length >= 1 || req.body.password.length < 6) {
        return res.status(400).json({ message: 'Registration failed.' });
      }
      return cloudinary.v2.uploader.upload('./temp/placeholder.jpg',
        { public_id: req.body.username, tags: [req.body.username] })
        .then(result => new User({
          _id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          bio: 'Bio...',
          display: result.secure_url,
        }).save())
        .then(() => res.status(201).json('User created.'));
    })
    .catch(() => res.status(500));
};

// Login User
exports.login = (req, res) => {
  User.findOne({ username: req.body.username }).exec()
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: '12h' });
        return res.json({
          message: 'Login successful.', token, username: user.username, id: user._id,
        });
      }
      return res.status(400).json({ message: 'Login failed.' });
    })
    .catch(() => res.status(500).json({ message: 'Login failed.' }));
};

// Update User
exports.update = (req, res) => {
  if (req.file == null) {
    return User
      .findByIdAndUpdate(req.tokenData.id, { bio: req.body.bio }, { runValidators: true })
      .then(() => res.json('User updated.'))
      .catch(() => res.status(500));
  }
  return cloudinary.v2.uploader.upload(req.file.path, {
    public_id: req.tokenData.username, invalidate: true, format: 'jpg', tags: [req.tokenData.username],
  })
    .then(result => User.findByIdAndUpdate(req.tokenData.id,
      { bio: req.body.bio || ' ', display: result.secure_url }, { runValidators: true }))
    .then(() => res.json('User updated.'))
    .catch(() => res.status(500));
};

// Delete User
exports.delete = (req, res) => {
  cloudinary.v2.api.delete_resources_by_tag(req.tokenData.username)
    .then(() => Post.deleteMany({ username: req.tokenData.username }))
    .then(() => User.findByIdAndDelete(req.tokenData.id))
    .then(() => res.json('User deleted.'))
    .catch(() => res.status(500));
};

// Follow User
exports.follow = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $addToSet: { following: req.body.username } },
    { runValidators: true })
    .then(() => User.findOneAndUpdate({ username: req.body.username },
      { $addToSet: { followers: req.tokenData.username } }, { runValidators: true }))
    .then(() => res.json('User Followed.'))
    .catch(() => res.status(500));
};

// Unfollow User
exports.unfollow = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $pull: { following: req.body.username } },
    { runValidators: true })
    .then(() => User.findOneAndUpdate({ username: req.body.username },
      { $pull: { followers: req.tokenData.username } }, { runValidators: true }))
    .then(() => res.json('User Unfollowed.'))
    .catch(() => res.status(500));
};

// Block User
exports.block = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $addToSet: { blocked: req.body.username } },
    { runValidators: true })
    .then(() => User.findByIdAndUpdate(req.tokenData.id,
      { $pull: { following: req.body.username } }, { runValidators: true }))
    .then(() => res.json('User blocked.'))
    .catch(() => res.status(500));
};

// Unblock User
exports.unblock = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $pull: { blocked: req.body.username } },
    { runValidators: true })
    .then(() => res.json('User Unblocked.'))
    .catch(() => res.status(500));
};
