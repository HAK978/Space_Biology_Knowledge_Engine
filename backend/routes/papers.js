const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const { cache } = require('../server');

/**
 * GET /api/papers
 * Fetch all papers with optional filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      limit = 1000,
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log(`📄 Fetching papers - limit: ${limit}, skip: ${skip}, category: ${category || 'all'}, search: ${search || 'none'}`);

    // Build query
    const query = {};

    // Search filter (text search on title, abstract, keywords)
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Only fetch successfully processed papers
    query.processingStatus = 'completed';

    // Build cache key
    const cacheKey = `papers:${JSON.stringify(req.query)}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Execute query
    const papers = await Paper.find(query)
      .select('-__v')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    const total = await Paper.countDocuments(query);

    const result = {
      papers: papers.map(paper => ({
        id: paper._id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        keywords: paper.keywords,
        category: paper.category,
        publicationDate: paper.publicationDate,
        citations: paper.citations,
        significance: paper.significance,
        pmcLink: paper.pmcLink,
        doi: paper.metadata?.doi
      })),
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    };

    console.log(`✅ Returning ${result.papers.length} papers out of ${total} total`);

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

/**
 * GET /api/papers/:id
 * Fetch a single paper by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check cache
    const cacheKey = `paper:${id}`;
    const cachedPaper = cache.get(cacheKey);

    if (cachedPaper) {
      return res.json(cachedPaper);
    }

    const paper = await Paper.findById(id)
      .select('-__v')
      .populate('relatedPapers.paperId', 'title authors category');

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const result = {
      id: paper._id,
      title: paper.title,
      authors: paper.authors,
      abstract: paper.abstract,
      keywords: paper.keywords,
      category: paper.category,
      publicationDate: paper.publicationDate,
      citations: paper.citations,
      significance: paper.significance,
      pmcLink: paper.pmcLink,
      metadata: paper.metadata,
      relatedPapers: paper.relatedPapers
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

/**
 * POST /api/papers/search
 * Advanced semantic search
 */
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {}, limit = 20 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Build search query
    const searchQuery = {
      $text: { $search: query },
      processingStatus: 'completed'
    };

    // Add filters
    if (filters.category && filters.category !== 'all') {
      searchQuery.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      searchQuery.publicationDate = {};
      if (filters.startDate) {
        searchQuery.publicationDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        searchQuery.publicationDate.$lte = new Date(filters.endDate);
      }
    }

    // Execute search with text score
    const papers = await Paper.find(searchQuery, { score: { $meta: 'textScore' } })
      .select('-__v')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      query,
      results: papers.map(paper => ({
        id: paper._id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        keywords: paper.keywords,
        category: paper.category,
        publicationDate: paper.publicationDate,
        significance: paper.significance,
        pmcLink: paper.pmcLink
      })),
      totalFound: papers.length
    });

  } catch (error) {
    console.error('Error searching papers:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/papers/categories/stats
 * Get paper count by category
 */
router.get('/categories/stats', async (req, res) => {
  try {
    const cacheKey = 'categories:stats';
    const cachedStats = cache.get(cacheKey);

    if (cachedStats) {
      return res.json(cachedStats);
    }

    const stats = await Paper.aggregate([
      { $match: { processingStatus: 'completed' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const result = stats.map(stat => ({
      category: stat._id,
      count: stat.count
    }));

    cache.set(cacheKey, result, 1800); // Cache for 30 minutes

    res.json(result);

  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
