const Checklist = require('../models/Checklist');
const { validationResult } = require('express-validator');

// @desc    Get all checklists
// @route   GET /api/checklists
// @access  Private
exports.getChecklists = async (req, res) => {
  try {
    const { category, status, search, sort } = req.query;
    
    // Build query
    let query = { owner: req.user.id };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'progress') sortOption = { progress: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'title') sortOption = { title: 1 };
    
    const checklists = await Checklist.find(query)
      .sort(sortOption)
      .populate('owner', 'name email')
      .populate('team', 'name email');
    
    // Get statistics
    const stats = {
      total: checklists.length,
      completed: checklists.filter(c => c.status === 'completed').length,
      active: checklists.filter(c => c.status === 'active').length,
      draft: checklists.filter(c => c.status === 'draft').length,
      averageProgress: checklists.length > 0 
        ? Math.round(checklists.reduce((sum, c) => sum + c.progress, 0) / checklists.length)
        : 0
    };
    
    res.status(200).json({
      success: true,
      count: checklists.length,
      stats,
      data: checklists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single checklist
// @route   GET /api/checklists/:id
// @access  Private
exports.getChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('team', 'name email');
    
    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }
    
    // Check ownership
    if (checklist.owner.toString() !== req.user.id && 
        !checklist.team.some(member => member._id.toString() === req.user.id)) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this checklist'
      });
    }
    
    res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create checklist
// @route   POST /api/checklists
// @access  Private
exports.createChecklist = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Add owner to checklist
    req.body.owner = req.user.id;
    
    // Create default items if none provided
    if (!req.body.items || req.body.items.length === 0) {
      req.body.items = [{
        title: 'First task',
        description: 'Edit or remove this default task',
        status: 'pending'
      }];
    }
    
    const checklist = await Checklist.create(req.body);
    
    res.status(201).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update checklist
// @route   PUT /api/checklists/:id
// @access  Private
exports.updateChecklist = async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    
    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }
    
    // Check ownership
    if (checklist.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this checklist'
      });
    }
    
    // Update checklist
    checklist = await Checklist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update checklist item status
// @route   PATCH /api/checklists/:id/items/:itemId
// @access  Private
exports.updateItemStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const checklist = await Checklist.findById(req.params.id);
    
    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }
    
    // Find the item
    const item = checklist.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    // Update item
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    
    if (status === 'completed') {
      item.completedDate = new Date();
    }
    
    await checklist.save();
    
    res.status(200).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete checklist
// @route   DELETE /api/checklists/:id
// @access  Private
exports.deleteChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    
    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }
    
    // Check ownership
    if (checklist.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this checklist'
      });
    }
    
    await checklist.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/checklists/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const checklists = await Checklist.find({ owner: req.user.id });
    
    // Calculate statistics
    const totalChecklists = checklists.length;
    const totalItems = checklists.reduce((sum, c) => sum + c.items.length, 0);
    const completedItems = checklists.reduce((sum, c) => 
      sum + c.items.filter(item => item.status === 'completed').length, 0
    );
    
    // Category distribution
    const categories = {};
    checklists.forEach(checklist => {
      categories[checklist.category] = (categories[checklist.category] || 0) + 1;
    });
    
    // Priority distribution
    const priorityStats = { high: 0, medium: 0, low: 0, critical: 0 };
    checklists.forEach(checklist => {
      checklist.items.forEach(item => {
        if (priorityStats.hasOwnProperty(item.priority)) {
          priorityStats[item.priority]++;
        }
      });
    });
    
    // Recent activity
    const recentChecklists = checklists
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
    
    res.status(200).json({
      success: true,
      data: {
        totalChecklists,
        totalItems,
        completedItems,
        completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        categories,
        priorityStats,
        recentChecklists
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};