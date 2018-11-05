// Modules
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './temp/' });

// Middleware
const authorization = require('../middleware/authorization');

// Controllers
const PostControllers = require('../controllers/post');

// View Feed
router.get('/feed/:username/:from/:to', PostControllers.feed);

// View Explore
router.get('/explore/:username/:from/:to', PostControllers.explore);

// View Profile Gallery
router.get('/profile/:username/:from/:to', PostControllers.profile);

// Make Post
router.post('/upload', authorization, upload.single('picture'), PostControllers.upload);

// Delete Post
router.delete('/delete', authorization, PostControllers.delete);

// Like Post
router.patch('/like', authorization, PostControllers.like);

// Unlike Post
router.patch('/unlike', authorization, PostControllers.unlike);

// Report Post
router.patch('/report', authorization, PostControllers.report);

module.exports = router;
