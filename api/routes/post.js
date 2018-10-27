// Modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary');

const router = express.Router();
const upload = multer({ dest: './temp/' });

// Middleware
const authorization = require('../middleware/authorization');

// Models
const Post = require('../models/post');
const User = require('../models/user');

// View Feed
router.get('/feed-view/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => Post.find({ username: { $in: user.following } }).sort({ created: -1 }))
    .then(posts => res.json({ message: posts }))
    .catch(res.sendStatus(500));
});

// View Explore
router.get('/explore-view/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => Post.find({
      $and: [
        { username: { $nin: user.blocked } },
        { username: { $nin: user.following } },
        { username: { $ne: user.username } },
      ],
    }).sort({ created: -1 }))
    .then(posts => res.json({ message: posts }))
    .catch(res.sendStatus(500));
});

// View Profile
router.get('/profile-view/:username', (req, res) => {
  Post.find({ username: req.params.username }).sort({ created: -1 })
    .then(posts => res.json({ message: posts }))
    .catch(res.sendStatus(500));
});

// Make Post
router.post('/upload', authorization, upload.single('picture'), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, { format: 'jpg' },
    (error, result) => {
      if (error) {
        res.json(error);
      }
      const newPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        username: req.tokenData.username,
        caption: req.body.caption,
        path: result.url,
      });
      newPost
        .save()
        .then(() => res.json({ message: 'Picture posted.' }))
        .catch(err => res.json({ message: err }));
    });
});

// Delete Post
router.delete('/delete', authorization, (req, res) => {
  Post.findOne({ _id: req.body.id }).exec()
    .then((post) => {
      if (post.username === req.tokenData.username) {
        post.remove();
        res.json({ message: 'Post deleted.' });
      }
      res.json({ message: 'Delete post failed.' });
    })
    .catch(err => res.json({ message: 'Error', error: err }));
}); // make this delete the image on cloudinary storage

// Like Post
router.patch('/like', authorization, (req, res) => {
  Post.findByIdAndUpdate(req.body.id, { $addToSet: { likedBy: req.tokenData.username } },
    { runValidators: true })
    .then(() => res.json({ message: 'Liked post.' }))
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Unlike Post
router.patch('/unlike', authorization, (req, res) => {
  Post
    .findByIdAndUpdate(req.body.id, { $pull: { likedBy: req.tokenData.username } },
      { runValidators: true })
    .then(() => res.json({ message: 'Unliked post.' }))
    .catch(err => res.json({ message: 'Error', error: err }));
});

// Report Post
router.patch('/report', authorization, (req, res) => {
  Post
    .findByIdAndUpdate(req.body.id, { $addToSet: { reportedBy: req.tokenData.username } },
      { runValidators: true })
    .then(() => res.json({ message: 'Reported post.' }))
    .catch(err => res.json({ message: 'Error', error: err }));
});

module.exports = router;
