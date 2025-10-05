import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaClipboardList } from 'react-icons/fa';

const MissionPlanningDashboard = ({ papers }) => {
  const [missionInsights, setMissionInsights] = useState({
    criticalRisks: [],
    countermeasures: [],
    readinessAssessment: [],
    recommendations: []
  });

  useEffect(() => {
    if (!papers || papers.length === 0) return;

    // Identify critical mission risks based on research
    const riskKeywords = {
      'bone loss': { severity: 'high', category: 'Skeletal Health', impact: 'Long-term missions' },
      'muscle atrophy': { severity: 'high', category: 'Muscular System', impact: 'Physical performance' },
      'radiation': { severity: 'critical', category: 'Radiation Exposure', impact: 'DNA damage, cancer risk' },
      'immune': { severity: 'high', category: 'Immune Function', impact: 'Infection susceptibility' },
      'cardiovascular': { severity: 'high', category: 'Cardiovascular', impact: 'Heart function decline' },
      'ocular': { severity: 'medium', category: 'Vision', impact: 'Spaceflight-associated neuro-ocular syndrome' },
      'circadian': { severity: 'medium', category: 'Sleep/Circadian', impact: 'Performance degradation' },
      'microgravity': { severity: 'high', category: 'Microgravity Effects', impact: 'Multiple system impacts' }
    };

    const risks = {};
    papers.forEach(paper => {
      const keywords = (paper.keywords || []).map(k => k.toLowerCase());
      const abstract = (paper.abstract || '').toLowerCase();

      Object.entries(riskKeywords).forEach(([keyword, data]) => {
        if (keywords.some(k => k.includes(keyword)) || abstract.includes(keyword)) {
          if (!risks[data.category]) {
            risks[data.category] = {
              ...data,
              evidenceCount: 0,
              relatedPapers: []
            };
          }
          risks[data.category].evidenceCount++;
          if (risks[data.category].relatedPapers.length < 3) {
            risks[data.category].relatedPapers.push(paper.title);
          }
        }
      });
    });

    const criticalRisks = Object.values(risks)
      .sort((a, b) => {
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        return severityOrder[b.severity] - severityOrder[a.severity] || b.evidenceCount - a.evidenceCount;
      })
      .slice(0, 6);

    // Identify potential countermeasures from research
    const countermeasureKeywords = [
      'exercise', 'nutrition', 'artificial gravity', 'shielding', 'drug therapy',
      'diet', 'supplements', 'training', 'monitoring', 'therapy'
    ];

    const countermeasures = {};
    papers.forEach(paper => {
      const keywords = (paper.keywords || []).map(k => k.toLowerCase());
      const text = `${paper.title} ${paper.abstract || ''}`.toLowerCase();

      countermeasureKeywords.forEach(cm => {
        if (keywords.some(k => k.includes(cm)) || text.includes(cm)) {
          if (!countermeasures[cm]) {
            countermeasures[cm] = { name: cm, papers: 0, category: paper.category };
          }
          countermeasures[cm].papers++;
        }
      });
    });

    const topCountermeasures = Object.values(countermeasures)
      .sort((a, b) => b.papers - a.papers)
      .slice(0, 8);

    // Mission readiness assessment by research area
    const categoryCount = {};
    const categoryRecency = {};

    papers.forEach(paper => {
      const cat = paper.category || 'General';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;

      if (paper.publicationDate) {
        const year = new Date(paper.publicationDate).getFullYear();
        if (!categoryRecency[cat] || year > categoryRecency[cat]) {
          categoryRecency[cat] = year;
        }
      }
    });

    const readiness = Object.entries(categoryCount).map(([category, count]) => {
      const recency = categoryRecency[category] || 2015;
      const coverage = Math.min((count / papers.length) * 10, 1);
      const freshness = Math.min((recency - 2015) / 10, 1);
      const readinessScore = (coverage * 0.6 + freshness * 0.4) * 100;

      let status = 'Low';
      if (readinessScore >= 70) status = 'High';
      else if (readinessScore >= 40) status = 'Medium';

      return { category, count, readinessScore, status, lastUpdate: recency };
    }).sort((a, b) => b.readinessScore - a.readinessScore);

    // Generate actionable recommendations
    const recommendations = [
      {
        priority: 'Critical',
        area: 'Radiation Protection',
        action: 'Develop and validate advanced radiation shielding materials',
        rationale: `${risks['Radiation Exposure']?.evidenceCount || 0} studies highlight radiation as a mission-critical risk`,
        timeline: 'Pre-launch requirement'
      },
      {
        priority: 'High',
        area: 'Bone & Muscle Health',
        action: 'Implement comprehensive exercise countermeasure protocols',
        rationale: 'Extensive evidence of musculoskeletal deconditioning in microgravity',
        timeline: 'Daily during mission'
      },
      {
        priority: 'High',
        area: 'Nutrition & Supplements',
        action: 'Design mission-specific nutritional programs',
        rationale: `${topCountermeasures.find(c => c.name === 'nutrition')?.papers || 0} papers support nutrition as key countermeasure`,
        timeline: 'Mission planning phase'
      },
      {
        priority: 'Medium',
        area: 'Psychological Support',
        action: 'Establish continuous behavioral health monitoring',
        rationale: 'Long-duration missions require robust mental health support',
        timeline: 'Throughout mission'
      },
      {
        priority: 'Medium',
        area: 'Environmental Monitoring',
        action: 'Deploy comprehensive health monitoring systems',
        rationale: 'Real-time health data critical for early intervention',
        timeline: 'Continuous'
      }
    ];

    setMissionInsights({
      criticalRisks,
      countermeasures: topCountermeasures,
      readinessAssessment: readiness,
      recommendations
    });
  }, [papers]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-600 to-orange-700';
      case 'medium': return 'from-yellow-600 to-yellow-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  const getReadinessColor = (status) => {
    switch (status) {
      case 'High': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-red-400 bg-red-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'from-red-500 to-red-600';
      case 'High': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center gap-3">
          <FaRocket className="text-blue-400" />
          Mission Planning Dashboard
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Actionable insights for mission architects, derived from 500+ NASA bioscience studies
        </p>
      </motion.div>

      {/* Critical Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-red-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
            <FaExclamationTriangle className="text-red-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Mission-Critical Risks</h3>
            <p className="text-sm text-gray-400">Identified from research evidence</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missionInsights.criticalRisks.map((risk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/50 border border-slate-700/40 rounded-lg p-4 hover:border-red-500/40 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-semibold">{risk.category}</h4>
                <span className={`text-xs px-2 py-1 bg-gradient-to-r ${getSeverityColor(risk.severity)} text-white rounded-full uppercase`}>
                  {risk.severity}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{risk.impact}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaShieldAlt size={12} />
                <span>{risk.evidenceCount} supporting studies</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Countermeasures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-green-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
            <FaCheckCircle className="text-green-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Validated Countermeasures</h3>
            <p className="text-sm text-gray-400">Evidence-based intervention strategies</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {missionInsights.countermeasures.map((cm, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/50 border border-slate-700/40 rounded-lg p-4 text-center hover:border-green-500/40 transition-all"
            >
              <p className="text-2xl font-bold text-green-400 mb-1">{cm.papers}</p>
              <p className="text-sm text-white capitalize font-medium">{cm.name}</p>
              <p className="text-xs text-gray-500 mt-1">{cm.category}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Readiness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
            <FaClipboardList className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Research Readiness Assessment</h3>
            <p className="text-sm text-gray-400">Knowledge maturity by category</p>
          </div>
        </div>
        <div className="space-y-3">
          {missionInsights.readinessAssessment.slice(0, 6).map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/50 border border-slate-700/40 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-white font-semibold">{area.category}</h4>
                  <p className="text-xs text-gray-400">Last updated: {area.lastUpdate}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getReadinessColor(area.status)}`}>
                  {area.status}
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${area.readinessScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{area.count} studies • {area.readinessScore.toFixed(0)}% readiness</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actionable Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
            <FaLightbulb className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Mission Recommendations</h3>
            <p className="text-sm text-gray-400">Prioritized action items for mission planning</p>
          </div>
        </div>
        <div className="space-y-4">
          {missionInsights.recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/50 border border-slate-700/40 rounded-lg p-5 hover:border-blue-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(rec.priority)} text-white`}>
                    {rec.priority}
                  </span>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{rec.area}</h4>
                    <p className="text-gray-300 mt-2">{rec.action}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                <p className="text-sm text-gray-400 mb-2"><span className="text-gray-300 font-medium">Rationale:</span> {rec.rationale}</p>
                <p className="text-xs text-blue-300"><span className="font-medium">Timeline:</span> {rec.timeline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MissionPlanningDashboard;
