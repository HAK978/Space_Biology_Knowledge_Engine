import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaperTile from '../components/PaperTile';
import TimelineVisualization from '../components/TimelineVisualization';
import { FaFilter, FaSpinner, FaStar } from 'react-icons/fa';
import { fetchPapers } from '../services/apiWrapper';

// Generate random stars for background
const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      size: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5
    });
  }
  return stars;
};

const Home = () => {
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store all papers for timeline
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const location = useLocation();
  const [stars] = useState(() => generateStars(50));

  // Category options
  const categories = [
    { id: 'all', name: 'All Papers' },
    { id: 'Health & Medicine', name: 'Health & Medicine' },
    { id: 'Biotechnology', name: 'Biotechnology' },
    { id: 'Plant Biology', name: 'Plant Biology' },
    { id: 'Cellular Biology', name: 'Cellular Biology' },
    { id: 'Radiation', name: 'Radiation' },
    { id: 'General', name: 'General' }
  ];

  // Load all papers once for timeline
  useEffect(() => {
    const loadAllPapers = async () => {
      try {
        const data = await fetchPapers(null, null); // Get all papers without filters
        setAllPapers(data);
      } catch (error) {
        console.error('Error loading all papers:', error);
      }
    };
    loadAllPapers();
  }, []);

  // Load filtered/sorted papers for display
  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get('search');

        const categoryFilter = activeFilter === 'all' ? null : activeFilter;

        let data = await fetchPapers(searchTerm, categoryFilter);

        // Apply sorting
        if (sortBy === 'citations') {
          data = data.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        } else if (sortBy === 'title') {
          data = data.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'recent') {
          data = data.sort((a, b) => {
            const dateA = a.publicationDate ? new Date(a.publicationDate) : new Date(0);
            const dateB = b.publicationDate ? new Date(b.publicationDate) : new Date(0);
            return dateB - dateA;
          });
        }

        setPapers(data);
      } catch (error) {
        console.error('Error loading papers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPapers();
  }, [location.search, activeFilter, sortBy]);

  return (
    <div className="relative">
      {/* Stars background */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12 mt-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            NASA Bioscience Research Explorer
          </motion.h1>
          <motion.p
            className="text-gray-300 max-w-3xl mx-auto text-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover groundbreaking space biology research enabling human exploration of the Moon and Mars
          </motion.p>
        </div>

        {/* Timeline Visualization - Show all 572 papers */}
        <div className="mb-12">
          <TimelineVisualization papers={allPapers} />
        </div>

        {/* Filter and Sort */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filter tabs */}
          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              <div className="flex items-center mr-2 text-indigo-300">
                <FaFilter className="mr-2" />
                <span className="text-sm">Filter:</span>
              </div>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeFilter === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/60 text-gray-300 hover:bg-slate-700/60'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

          {/* Sort options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-indigo-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-800/60 text-white border border-indigo-800/30 rounded-lg text-sm focus:outline-none focus:border-indigo-600/50"
            >
              <option value="recent">Most Recent</option>
              <option value="citations">Most Cited</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Papers grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-blue-500 mr-3" size={24} />
            <span className="text-blue-300">Loading research papers...</span>
          </div>
        ) : (
          papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map(paper => (
                <PaperTile key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FaStar className="text-yellow-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
};

export default Home;
