const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getSavedInternships,
  toggleSavedInternship,
  removeSavedInternship,
  deleteUserAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.delete('/account', protect, deleteUserAccount);
router.get('/saved', protect, getSavedInternships);
router.route('/saved/:id').post(protect, toggleSavedInternship).delete(protect, removeSavedInternship);

module.exports = router;
