import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch papers with optional search and filters
 * @param {string} searchTerm - Search query
 * @param {string} category - Category filter
 * @param {number} limit - Number of papers to fetch
 * @param {number} skip - Number of papers to skip
 * @returns {Promise<Array>} Array of papers
 */
export const fetchPapersFromBackend = async (searchTerm = null, category = null, limit = 1000, skip = 0) => {
  try {
    const params = {
      limit,
      skip
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (category && category !== 'all') {
      params.category = category;
    }

    const response = await api.get('/papers', { params });

    // Transform backend response to frontend format
    return response.data.papers.map(paper => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors || [],
      abstract: paper.abstract || '',
      keywords: paper.keywords || [],
      category: paper.category || 'General',
      publicationDate: paper.publicationDate,
      citations: paper.citations || 0,
      significance: paper.significance || '',
      pdfUrl: paper.pmcLink,
      doi: paper.doi || paper.pmcLink
    }));
  } catch (error) {
    console.error('Error fetching papers from backend:', error);
    throw error;
  }
};

/**
 * Fetch a single paper by ID
 * @param {string} id - Paper ID
 * @returns {Promise<Object>} Paper object
 */
export const fetchPaperByIdFromBackend = async (id) => {
  try {
    const response = await api.get(`/papers/${id}`);
    const paper = response.data;

    return {
      id: paper.id,
      title: paper.title,
      authors: paper.authors || [],
      abstract: paper.abstract || '',
      keywords: paper.keywords || [],
      category: paper.category || 'General',
      publicationDate: paper.publicationDate,
      citations: paper.citations || 0,
      significance: paper.significance || '',
      pdfUrl: paper.pmcLink,
      doi: paper.metadata?.doi || paper.pmcLink,
      metadata: paper.metadata || {},
      relatedPapers: paper.relatedPapers || [],
      images: [] // Images would need separate handling
    };
  } catch (error) {
    console.error('Error fetching paper by ID:', error);
    throw error;
  }
};

/**
 * Advanced semantic search
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
export const semanticSearchBackend = async (query, options = {}) => {
  try {
    const response = await api.post('/papers/search', {
      query,
      filters: options.filters || {},
      limit: options.limit || 20
    });

    return {
      query: response.data.query,
      results: response.data.results.map(paper => ({
        id: paper.id,
        title: paper.title,
        authors: paper.authors || [],
        abstract: paper.abstract || '',
        keywords: paper.keywords || [],
        category: paper.category || 'General',
        publicationDate: paper.publicationDate,
        significance: paper.significance || '',
        pdfUrl: paper.pmcLink
      })),
      totalFound: response.data.totalFound
    };
  } catch (error) {
    console.error('Error performing semantic search:', error);
    throw error;
  }
};

/**
 * Get category statistics
 * @returns {Promise<Array>} Category statistics
 */
export const getCategoryStats = async () => {
  try {
    const response = await api.get('/papers/categories/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    throw error;
  }
};

/**
 * Health check
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'ERROR', message: error.message };
  }
};

export default api;
