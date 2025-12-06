const express = require('express');
const { getGithubProfile } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getGithubProfile);

module.exports = router;
