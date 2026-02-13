const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'not-applicable'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  assignee: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true
  }
});

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a checklist title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  items: [checklistItemSchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  isTemplate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update progress before saving
checklistSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    const completedItems = this.items.filter(item => 
      item.status === 'completed' || item.status === 'not-applicable'
    ).length;
    this.progress = Math.round((completedItems / this.items.length) * 100);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Checklist', checklistSchema);