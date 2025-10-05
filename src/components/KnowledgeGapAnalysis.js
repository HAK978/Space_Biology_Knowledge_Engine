import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const KnowledgeGapAnalysis = ({ papers }) => {
  const [gaps, setGaps] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    if (!papers || papers.length === 0) return;

    // Analyze keyword frequency
    const keywordFreq = {};
    const categoryKeywords = {};

    papers.forEach(paper => {
      const category = paper.category || 'General';
      if (!categoryKeywords[category]) {
        categoryKeywords[category] = {};
      }

      (paper.keywords || []).forEach(keyword => {
        keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
        categoryKeywords[category][keyword] = (categoryKeywords[category][keyword] || 0) + 1;
      });
    });

    // Find under-researched areas (keywords with low frequency)
    const allKeywords = Object.entries(keywordFreq)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10);

    const identifiedGaps = allKeywords.map(([keyword, count]) => ({
      area: keyword,
      paperCount: count,
      priority: count < 5 ? 'High' : count < 10 ? 'Medium' : 'Low',
      suggestion: `Only ${count} paper${count === 1 ? '' : 's'} found on ${keyword}. This represents a potential research gap.`
    }));

    setGaps(identifiedGaps);

    // Find research opportunities (combinations not well studied)
    const commonAreas = ['microgravity', 'radiation', 'bone', 'muscle', 'immune', 'cell'];
    const researchOpportunities = [];

    commonAreas.forEach((area1, i) => {
      commonAreas.slice(i + 1).forEach(area2 => {
        const combinedCount = papers.filter(p =>
          (p.keywords || []).some(k => k.toLowerCase().includes(area1)) &&
          (p.keywords || []).some(k => k.toLowerCase().includes(area2))
        ).length;

        if (combinedCount < 3) {
          researchOpportunities.push({
            combination: `${area1} + ${area2}`,
            count: combinedCount,
            impact: 'High',
            description: `Cross-disciplinary research combining ${area1} and ${area2} effects`
          });
        }
      });
    });

    setOpportunities(researchOpportunities.slice(0, 6));
  }, [papers]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'from-red-500 to-red-600';
      case 'Medium': return 'from-orange-500 to-orange-600';
      case 'Low': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <FaLightbulb className="mr-3 text-yellow-400" size={24} />
          Knowledge Gap Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full border border-yellow-700/30">
            AI-Powered Insights
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Gaps */}
        <div>
          <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Under-Researched Areas
          </h4>
          <div className="space-y-3">
            {gaps.slice(0, 5).map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4 hover:border-slate-600/60 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold text-white capitalize text-base">{gap.area}</h5>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(gap.priority)} text-white shadow-sm`}>
                    {gap.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{gap.suggestion}</p>
                <div className="flex items-center text-xs text-blue-400 font-medium">
                  <FaSearch className="mr-1.5" size={12} />
                  {gap.paperCount} publication{gap.paperCount !== 1 ? 's' : ''}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Research Opportunities */}
        <div>
          <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
            <FaLightbulb className="mr-2" />
            Research Opportunities
          </h4>
          <div className="space-y-3">
            {opportunities.map((opp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-900/40 border border-slate-700/40 rounded-lg p-4 hover:border-slate-600/60 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold text-white text-base">{opp.combination}</h5>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                    {opp.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{opp.description}</p>
                <div className="text-xs font-medium text-green-400">
                  {opp.count === 0 ? '✨ No existing research' : `📊 ${opp.count} paper${opp.count === 1 ? '' : 's'}`}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/30 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="text-indigo-400 mt-0.5">
            <FaLightbulb size={20} />
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-base">Recommendations for Future Research</h4>
            <ul className="text-sm text-gray-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Focus on cross-disciplinary studies combining under-researched areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Investigate long-term effects of space conditions (gaps in longitudinal studies)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Develop countermeasures for identified high-priority gaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Collaborate across categories to fill knowledge gaps</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGapAnalysis;
