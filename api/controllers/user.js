// Modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

// Models
const User = require('../models/user');
const Post = require('../models/post');

// View Your Profile Details
exports.self = (req, res) => {
  User.findOne({ username: req.tokenData.username })
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: err }));
};

// Register User
exports.register = (req, res) => {
  User
    .find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length >= 1 || req.body.password.length < 6) {
        return res.status(400).json({ message: 'Registration failed.' });
      }
      return cloudinary.v2.uploader.upload('./temp/placeholder.jpg',
        { public_id: `${req.body.username}`, tags: [req.body.username] },
        (error, result) => {
          if (error) {
            return res.status(500).json(error);
          }
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            bio: 'Bio...',
            display: result.secure_url,
          });
          return newUser
            .save()
            .then(() => res.status(201).json({ message: 'User created.', newUser }))
            .catch(err => res.status(500).json({ message: err }));
        });
    })
    .catch(err => res.status(500).json({ message: err }));
};

// Login User
exports.login = (req, res) => {
  User.findOne({ username: req.body.username }).exec()
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_KEY, { expiresIn: '12h' });
        return res.json({ message: 'Login successful.', token, username: user.username });
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
    .catch(err => res.status(500).json({ message: 'Error', error: err }));
};

// Follow User
exports.follow = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $addToSet: { following: req.body.username } },
    { runValidators: true })
    .then(() => User.findOneAndUpdate({ username: req.body.username },
      { $addToSet: { followers: req.tokenData.username } }, { runValidators: true }))
    .then(() => res.json('User Followed.'))
    .catch(err => res.status(500).json({ message: 'Error', error: err }));
};

// Unfollow User
exports.unfollow = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $pull: { following: req.body.username } },
    { runValidators: true })
    .then(() => User.findOneAndUpdate({ username: req.body.username },
      { $pull: { followers: req.tokenData.username } }, { runValidators: true }))
    .then(() => res.json('User Unfollowed.'))
    .catch(err => res.status(500).json({ message: 'Error', error: err }));
};

// Block User
exports.block = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $addToSet: { blocked: req.body.username } },
    { runValidators: true })
    .then(() => User.findByIdAndUpdate(req.tokenData.id,
      { $pull: { following: req.body.username } }, { runValidators: true }))
    .then(() => res.json('User blocked.'))
    .catch(err => res.status(500).json({ message: 'Error', error: err }));
};

// Unblock User
exports.unblock = (req, res) => {
  User.findByIdAndUpdate(req.tokenData.id, { $pull: { blocked: req.body.username } },
    { runValidators: true })
    .then(() => res.json('User Unblocked.'))
    .catch(err => res.status(500).json(err));
};
