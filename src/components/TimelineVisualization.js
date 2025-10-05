import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartArea, FaCalendarAlt } from 'react-icons/fa';

const TimelineVisualization = ({ papers }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (!papers || papers.length === 0) return;

    // Group papers by year
    const yearMap = {};
    papers.forEach(paper => {
      if (paper.publicationDate) {
        const year = new Date(paper.publicationDate).getFullYear();
        if (year >= 2000 && year <= 2025) {
          if (!yearMap[year]) {
            yearMap[year] = { year, count: 0, categories: {} };
          }
          yearMap[year].count++;
          const category = paper.category || 'General';
          yearMap[year].categories[category] = (yearMap[year].categories[category] || 0) + 1;
        }
      }
    });

    const timeline = Object.values(yearMap).sort((a, b) => a.year - b.year);
    setTimelineData(timeline);
  }, [papers]);

  const maxCount = Math.max(...timelineData.map(d => d.count), 1);

  return (
    <div className="bg-slate-800/40 border border-indigo-800/30 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <FaChartArea className="mr-2 text-blue-400" />
        Research Timeline (2000-2025)
      </h3>

      {timelineData.length > 0 ? (
        <>
          {/* Timeline Chart */}
          <div className="relative mb-16 mt-8">
            {/* Y-axis label */}
            <div className="absolute -left-12 top-0 bottom-0 flex items-center">
              <span className="text-xs text-gray-400 transform -rotate-90 whitespace-nowrap">
                Number of Papers
              </span>
            </div>

            {/* Chart container with proper spacing */}
            <div className="h-64 relative pl-8 pr-4">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-xs text-gray-500 w-8 text-right mr-2">
                      {Math.round((maxCount * (4 - i)) / 4)}
                    </span>
                    <div className="flex-1 border-t border-gray-700/30"></div>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 pl-10 flex items-end justify-between gap-1">
                {timelineData.map((data, index) => {
                  const height = (data.count / maxCount) * 100;
                  return (
                    <div key={data.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                      {/* Count on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        <span className="text-xs font-semibold text-blue-300 bg-slate-900/80 px-2 py-1 rounded">
                          {data.count}
                        </span>
                      </div>

                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.6, delay: index * 0.02 }}
                        className={`w-full rounded-t cursor-pointer transition-all ${
                          selectedYear === data.year
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/50'
                            : 'bg-gradient-to-t from-indigo-800 to-indigo-600 hover:from-blue-700 hover:to-blue-500'
                        }`}
                        onClick={() => setSelectedYear(selectedYear === data.year ? null : data.year)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex items-start justify-between gap-1 pl-10 mt-2">
              {timelineData.map((data) => (
                <div key={data.year} className="flex-1 text-center">
                  <span className="text-xs text-gray-400">{data.year}</span>
                </div>
              ))}
            </div>

            {/* X-axis line */}
            <div className="border-t border-gray-700 mt-1 ml-10"></div>
          </div>

          {/* Year Details */}
          {selectedYear && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-indigo-800/20 rounded-lg p-5"
            >
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-400 mr-2" />
                <h4 className="text-lg font-semibold text-white">
                  {selectedYear} - {timelineData.find(d => d.year === selectedYear)?.count} publications
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(timelineData.find(d => d.year === selectedYear)?.categories || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div key={category} className="bg-slate-800/60 border border-indigo-800/20 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1 truncate">{category}</p>
                      <p className="text-lg font-semibold text-white">{count}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-lg p-4">
              <p className="text-sm text-blue-300 mb-1 font-medium">Peak Year</p>
              <p className="text-3xl font-bold text-white">
                {timelineData.reduce((max, d) => d.count > max.count ? d : max, timelineData[0])?.year}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {timelineData.reduce((max, d) => d.count > max.count ? d : max, timelineData[0])?.count} papers
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-lg p-4">
              <p className="text-sm text-purple-300 mb-1 font-medium">Total Publications</p>
              <p className="text-3xl font-bold text-white">
                {timelineData.reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Across {timelineData.length} years
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-lg p-4">
              <p className="text-sm text-green-300 mb-1 font-medium">Average per Year</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(timelineData.reduce((sum, d) => sum + d.count, 0) / timelineData.length)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Publications annually
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <FaCalendarAlt size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No timeline data available</p>
          <p className="text-sm mt-2">Papers without publication dates are not shown</p>
        </div>
      )}
    </div>
  );
};

export default TimelineVisualization;
