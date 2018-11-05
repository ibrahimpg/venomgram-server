// Modules
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './temp/' });

// Middleware
const authorization = require('../middleware/authorization');

// Controllers
const UserControllers = require('../controllers/user');

// View User Profile Username/Bio
router.get('/user/:username', UserControllers.user);

// View Your Profile Details/Settings
router.get('/self', authorization, UserControllers.self);

// Register User
router.post('/register', UserControllers.register);

// Login User
router.post('/login', UserControllers.login);

// Update User
router.patch('/update', authorization, upload.single('display'), UserControllers.update);

// Delete User
router.delete('/delete', authorization, UserControllers.delete);

// Follow User
router.patch('/follow', authorization, UserControllers.follow);

// Unfollow User
router.patch('/unfollow', authorization, UserControllers.unfollow);

// Block User
router.patch('/block', authorization, UserControllers.block);

// Unblock User
router.patch('/unblock', authorization, UserControllers.unblock);

module.exports = router;
