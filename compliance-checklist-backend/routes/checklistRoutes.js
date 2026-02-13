const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  updateItemStatus,
  deleteChecklist,
  getDashboardStats
} = require('../controllers/checklistController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// CRUD operations
router.route('/')
  .get(getChecklists)
  .post([
    check('title', 'Title is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ], createChecklist);

router.route('/:id')
  .get(getChecklist)
  .put(updateChecklist)
  .delete(deleteChecklist);

// Update item status
router.patch('/:id/items/:itemId', [
  check('status', 'Valid status is required').isIn(['pending', 'in-progress', 'completed', 'not-applicable'])
], updateItemStatus);

module.exports = router;