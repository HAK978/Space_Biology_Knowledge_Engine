import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaNetworkWired, FaBrain, FaLightbulb, FaFire } from 'react-icons/fa';

const DataMiningInsights = ({ papers }) => {
  const [insights, setInsights] = useState({
    trendingTopics: [],
    keywordCorrelations: [],
    emergingAreas: [],
    researchClusters: []
  });

  useEffect(() => {
    if (!papers || papers.length === 0) return;

    // Analyze trending topics based on frequency and recency
    const keywordFreq = {};
    const keywordYears = {};

    papers.forEach(paper => {
      const year = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 2020;
      (paper.keywords || []).forEach(keyword => {
        const kw = keyword.toLowerCase();
        keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
        if (!keywordYears[kw]) keywordYears[kw] = [];
        keywordYears[kw].push(year);
      });
    });

    // Find trending topics (high frequency + recent)
    const trending = Object.entries(keywordFreq)
      .map(([keyword, count]) => {
        const years = keywordYears[keyword];
        const avgYear = years.reduce((a, b) => a + b, 0) / years.length;
        const recency = avgYear - 2015; // Base year for recency calculation
        const trendScore = count * (1 + recency * 0.1);
        return { keyword, count, trendScore, avgYear: Math.round(avgYear) };
      })
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 8);

    // Find keyword co-occurrences (correlations)
    const coOccurrence = {};
    papers.forEach(paper => {
      const keywords = (paper.keywords || []).map(k => k.toLowerCase());
      for (let i = 0; i < keywords.length; i++) {
        for (let j = i + 1; j < keywords.length; j++) {
          const pair = [keywords[i], keywords[j]].sort().join(' + ');
          coOccurrence[pair] = (coOccurrence[pair] || 0) + 1;
        }
      }
    });

    const correlations = Object.entries(coOccurrence)
      .filter(([_, count]) => count >= 3)
      .map(([pair, count]) => ({ pair, count, strength: count / papers.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Identify emerging areas (topics with increasing frequency over time)
    const recentKeywords = {};
    const olderKeywords = {};

    papers.forEach(paper => {
      const year = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 2020;
      const isRecent = year >= 2020;
      (paper.keywords || []).forEach(keyword => {
        const kw = keyword.toLowerCase();
        if (isRecent) {
          recentKeywords[kw] = (recentKeywords[kw] || 0) + 1;
        } else {
          olderKeywords[kw] = (olderKeywords[kw] || 0) + 1;
        }
      });
    });

    const emerging = Object.keys(recentKeywords)
      .map(keyword => {
        const recentCount = recentKeywords[keyword] || 0;
        const olderCount = olderKeywords[keyword] || 0;
        const growthRate = olderCount > 0 ? (recentCount - olderCount) / olderCount : recentCount;
        return { keyword, recentCount, olderCount, growthRate };
      })
      .filter(item => item.growthRate > 0.5 && item.recentCount >= 3)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 6);

    // Create research clusters based on category + keyword combinations
    const clusterMap = {};
    papers.forEach(paper => {
      const category = paper.category || 'General';
      if (!clusterMap[category]) {
        clusterMap[category] = { keywords: {}, count: 0 };
      }
      clusterMap[category].count++;
      (paper.keywords || []).forEach(keyword => {
        const kw = keyword.toLowerCase();
        clusterMap[category].keywords[kw] = (clusterMap[category].keywords[kw] || 0) + 1;
      });
    });

    const clusters = Object.entries(clusterMap).map(([category, data]) => {
      const topKeywords = Object.entries(data.keywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([kw]) => kw);
      return {
        category,
        count: data.count,
        topKeywords,
        density: data.count / papers.length
      };
    }).sort((a, b) => b.count - a.count);

    setInsights({
      trendingTopics: trending,
      keywordCorrelations: correlations,
      emergingAreas: emerging,
      researchClusters: clusters
    });
  }, [papers]);

  const getStrengthColor = (strength) => {
    if (strength > 0.15) return 'from-red-500 to-orange-500';
    if (strength > 0.10) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-green-500';
  };

  const getGrowthColor = (rate) => {
    if (rate > 2) return 'from-green-500 to-emerald-500';
    if (rate > 1) return 'from-blue-500 to-cyan-500';
    return 'from-indigo-500 to-purple-500';
  };

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
            <FaFire className="text-orange-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Trending Research Topics</h3>
            <p className="text-sm text-gray-400">Based on frequency and recency analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.trendingTopics.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4 hover:border-orange-500/40 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-semibold capitalize">{topic.keyword}</h4>
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full">
                  {topic.count} papers
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaChartBar size={12} />
                <span>Peak activity: {topic.avgYear}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Keyword Correlations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
            <FaNetworkWired className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Research Topic Correlations</h3>
            <p className="text-sm text-gray-400">Frequently co-occurring research areas</p>
          </div>
        </div>
        <div className="space-y-3">
          {insights.keywordCorrelations.map((corr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-medium capitalize">{corr.pair}</h4>
                <span className="text-sm font-semibold text-purple-300">{corr.count} papers</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getStrengthColor(corr.strength)} rounded-full`}
                  style={{ width: `${Math.min(corr.strength * 500, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Correlation strength: {(corr.strength * 100).toFixed(1)}%
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Emerging Research Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-lg">
            <FaBrain className="text-green-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Emerging Research Areas</h3>
            <p className="text-sm text-gray-400">Topics with accelerating research activity</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.emergingAreas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4 hover:border-green-500/40 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-semibold capitalize">{area.keyword}</h4>
                <span className={`text-xs px-2 py-1 bg-gradient-to-r ${getGrowthColor(area.growthRate)} text-white rounded-full`}>
                  +{(area.growthRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div>
                  <span className="text-green-400">{area.recentCount}</span> recent
                </div>
                <div>
                  <span className="text-gray-500">{area.olderCount}</span> older
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Research Clusters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
            <FaLightbulb className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Research Clusters</h3>
            <p className="text-sm text-gray-400">Topic concentrations by research category</p>
          </div>
        </div>
        <div className="space-y-3">
          {insights.researchClusters.map((cluster, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{cluster.category}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Top themes: {cluster.topKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                  </p>
                </div>
                <span className="text-sm font-semibold text-blue-300">{cluster.count} papers</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${cluster.density * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DataMiningInsights;
