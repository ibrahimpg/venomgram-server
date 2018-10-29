// Modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const upload = multer({ dest: './temp/' });

// Middleware
const authorization = require('../middleware/authorization');

// Models
const User = require('../models/user');
const Post = require('../models/post');

// Check If User Logged In
router.get('/check', authorization, (req, res) => {
  User.findOne({ username: req.tokenData.username })
    .then(users => res.json({ message: users }))
    .catch(err => res.json({ message: err }));
});

// View Your Profile Details
router.get('/self-view', authorization, (req, res) => {
  User.findOne({ username: req.tokenData.username })
    .then(user => res.json(user))
    .catch(err => res.json({ message: err }));
});

// Register User
router.post('/register', (req, res) => {
  User
    .find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length >= 1 || req.body.password.length < 6) {
        res.json({ message: 'Registration failed.' });
      }
      cloudinary.v2.uploader.upload('./temp/placeholder.jpg', { public_id: `${req.body.username}` },
        (error, result) => {
          if (error) {
            res.json(error);
          } else {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: bcrypt.hashSync(req.body.password, 10),
              bio: 'Bio...',
              display: result.url,
            });
            newUser
              .save()
              .then(() => res.json({ message: 'User created.', newUser }))
              .catch(err => res.json({ message: err }));
          }
        });
    })
    .catch(err => res.json({ message: err }));
});

// Login User
router.post('/login', (req, res) => {
  User
    .findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.json({ message: 'Login failed.' });
      }
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_KEY, { expiresIn: '12h' });
        return res.json({ message: 'Login successful.', token, username: user.username });
      }
      return res.json({ message: 'Login failed.' });
    })
    .catch(() => res.json({ message: 'Login failed.' }));
});

// Update User
router.patch('/update', authorization, upload.single('display'), (req, res) => {
  if (req.file == null) {
    User
      .findByIdAndUpdate(req.tokenData.id, { bio: req.body.bio },
        { runValidators: true })
      .then(() => res.json({ message: 'User updated.' }))
      .catch(err => res.json({ message: 'Error', error: err }));
  } else {
    cloudinary.v2.uploader.upload(req.file.path, {
      public_id: `${req.tokenData.username}`, invalidate: true, format: 'jpg',
    },
    (error, result) => {
      if (error) {
        res.json(error);
      } else {
        User
          .findByIdAndUpdate(req.tokenData.id, { bio: req.body.bio, display: result.url },
            { runValidators: true })
          .then(() => res.json({ message: 'User updated.' }))
          .catch(err => res.json({ message: 'Error', error: err }));
      }
    });
  }
});

// Delete User
router.delete('/delete', authorization, (req, res) => {
  Post
    .deleteMany({ username: req.tokenData.username })
    .then(() => { // add a step here that pulls the user from all blocked, following, followers
      User // also add a step that deletes all the pics from cloudinary as well
        .findByIdAndDelete(req.tokenData.id)
        .then(() => res.json({ message: 'User deleted.' }));
    })
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Follow User
router.patch('/follow', authorization, (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, { $addToSet: { following: req.body.username } },
      { runValidators: true })
    .then(() => {
      User
        .findOneAndUpdate({ username: req.body.username },
          { $addToSet: { followers: req.tokenData.username } },
          { runValidators: true })
        .then(() => res.json({ message: 'User Followed.' }));
    })
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Unfollow User
router.patch('/unfollow', authorization, (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, { $pull: { following: req.body.username } },
      { runValidators: true })
    .then(() => {
      User
        .findOneAndUpdate({ username: req.body.username },
          { $pull: { followers: req.tokenData.username } },
          { runValidators: true })
        .then(() => res.json({ message: 'User Unfollowed.' }));
    })
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Block User
router.patch('/block', authorization, (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, { $addToSet: { blocked: req.body.username } },
      { runValidators: true })
    .then(() => {
      User
        .findByIdAndUpdate(req.tokenData.id, { $pull: { following: req.body.username } },
          { runValidators: true })
        .then(() => res.json({ message: 'User blocked.' }));
    })
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Unblock User
router.patch('/unblock', authorization, (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, { $pull: { blocked: req.body.username } },
      { runValidators: true })
    .then(() => res.json({ message: 'User Unblocked.' }))
    .catch(err => res.json({ message: 'Error', error: err }));
});

module.exports = router;
