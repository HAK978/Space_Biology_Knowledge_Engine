import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFlask, FaBook, FaChartLine, FaLayerGroup } from 'react-icons/fa';
import axios from 'axios';

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    totalPapers: 0,
    categories: [],
    withAbstracts: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check if backend is available
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

        const [papersRes, categoryRes] = await Promise.all([
          axios.get(`${API_URL}/papers?limit=1`),
          axios.get(`${API_URL}/papers/categories/stats`)
        ]);

        setStats({
          totalPapers: papersRes.data.total || 0,
          categories: categoryRes.data || [],
          withAbstracts: Math.floor((papersRes.data.total || 0) * 0.93), // Estimate
          loading: false
        });
      } catch (error) {
        // Fallback to mock stats
        setStats({
          totalPapers: 20,
          categories: [
            { category: 'Health & Medicine', count: 6 },
            { category: 'Space Biology', count: 5 },
            { category: 'Cellular Biology', count: 4 },
            { category: 'Biotechnology', count: 3 },
            { category: 'Other', count: 2 }
          ],
          withAbstracts: 18,
          loading: false
        });
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <FaBook className="text-blue-400" size={28} />,
      label: 'Total Publications',
      value: stats.totalPapers,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FaFlask className="text-purple-400" size={28} />,
      label: 'With Abstracts',
      value: stats.withAbstracts,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FaLayerGroup className="text-green-400" size={28} />,
      label: 'Categories',
      value: stats.categories.length,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FaChartLine className="text-orange-400" size={28} />,
      label: 'Research Areas',
      value: stats.categories.length > 0 ? stats.categories.length : 6,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-800/40 rounded-xl p-6 animate-pulse">
            <div className="h-16 bg-slate-700/40 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-indigo-600/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} opacity-90`}>
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">{card.value.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-300">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <FaLayerGroup className="mr-3 text-blue-400" size={20} />
          Research Distribution by Category
        </h3>
        <div className="space-y-4">
          {stats.categories.slice(0, 6).map((cat, index) => {
            const percentage = Math.round((cat.count / stats.totalPapers) * 100);
            const colors = [
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-green-500 to-green-600',
              'from-orange-500 to-orange-600',
              'from-pink-500 to-pink-600',
              'from-yellow-500 to-yellow-600'
            ];
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{cat.category}</span>
                  <span className="text-sm font-semibold text-white">
                    {cat.count} <span className="text-gray-400">({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${colors[index]} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsDashboard;
