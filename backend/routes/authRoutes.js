const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { githubLogin, githubCallback } = require('../controllers/githubOAuthController');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/github', githubLogin);
router.get('/callback', githubCallback);

module.exports = router;
