const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  pmcLink: {
    type: String,
    required: true,
    unique: true
  },
  abstract: {
    type: String,
    default: ''
  },
  authors: [{
    type: String
  }],
  keywords: [{
    type: String
  }],
  category: {
    type: String,
    default: 'General'
  },
  publicationDate: {
    type: Date
  },
  citations: {
    type: Number,
    default: 0
  },
  significance: {
    type: String,
    default: ''
  },
  relatedPapers: [{
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paper'
    },
    title: String,
    similarity: Number
  }],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: {
    doi: String,
    pmcId: String,
    pmid: String,
    journal: String,
    volume: String,
    issue: String,
    pages: String
  }
}, {
  timestamps: true
});

// Indexes for search optimization
paperSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });
paperSchema.index({ category: 1 });
paperSchema.index({ publicationDate: -1 });
paperSchema.index({ citations: -1 });

module.exports = mongoose.model('Paper', paperSchema);
