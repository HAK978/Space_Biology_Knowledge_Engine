import {
  fetchPapersFromBackend,
  fetchPaperByIdFromBackend,
  semanticSearchBackend,
  healthCheck
} from './backendApi';

import {
  fetchPapers as fetchPapersMock,
  fetchPaperById as fetchPaperByIdMock,
  semanticSearch as semanticSearchMock
} from './api';

// Check if backend is available
let backendAvailable = false;
let backendCheckPromise = null;

const checkBackend = async () => {
  try {
    const health = await healthCheck();
    backendAvailable = health.status === 'OK';
    console.log('🔌 Backend status:', backendAvailable ? 'Connected ✅' : 'Not available ❌');
    return backendAvailable;
  } catch (error) {
    backendAvailable = false;
    console.log('📴 Backend not available, using mock data:', error.message);
    return false;
  }
};

// Check on initial load and cache the promise
backendCheckPromise = checkBackend();

/**
 * Fetch papers with automatic fallback
 */
export const fetchPapers = async (searchTerm = null, category = null, limit = 1000, skip = 0) => {
  // Wait for initial backend check if still pending
  if (backendCheckPromise) {
    await backendCheckPromise;
    backendCheckPromise = null;
  }

  // Try to reconnect if backend was unavailable
  if (!backendAvailable) {
    await checkBackend();
  }

  if (backendAvailable) {
    try {
      console.log(`📡 Fetching from backend... (limit: ${limit}, category: ${category || 'all'})`);
      return await fetchPapersFromBackend(searchTerm, category, limit, skip);
    } catch (error) {
      console.warn('⚠️ Backend failed, falling back to mock data:', error.message);
      backendAvailable = false;
    }
  }

  // Fallback to mock data
  console.log('📦 Using mock data (only 20 papers available)');
  return await fetchPapersMock(searchTerm, category);
};

/**
 * Fetch paper by ID with automatic fallback
 */
export const fetchPaperById = async (id) => {
  if (backendAvailable) {
    try {
      console.log('📡 Fetching paper from backend...');
      return await fetchPaperByIdFromBackend(id);
    } catch (error) {
      console.warn('⚠️ Backend failed, falling back to mock data:', error.message);
      backendAvailable = false;
    }
  }

  // Fallback to mock data
  console.log('📦 Using mock data for paper');
  return await fetchPaperByIdMock(id);
};

/**
 * Semantic search with automatic fallback
 */
export const semanticSearch = async (query, options = {}) => {
  if (backendAvailable) {
    try {
      console.log('📡 Performing semantic search on backend...');
      return await semanticSearchBackend(query, options);
    } catch (error) {
      console.warn('⚠️ Backend failed, falling back to mock search:', error.message);
      backendAvailable = false;
    }
  }

  // Fallback to mock semantic search
  console.log('📦 Using mock semantic search');
  return await semanticSearchMock(query, options);
};

/**
 * Force check backend status
 */
export const recheckBackend = async () => {
  return await checkBackend();
};

/**
 * Get backend status
 */
export const isBackendAvailable = () => backendAvailable;

export default {
  fetchPapers,
  fetchPaperById,
  semanticSearch,
  recheckBackend,
  isBackendAvailable
};
