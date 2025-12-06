const express = require('express');
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getInternships).post(protect, admin, createInternship);
router
  .route('/:id')
  .get(protect, getInternshipById)
  .put(protect, admin, updateInternship)
  .delete(protect, admin, deleteInternship);

module.exports = router;
