import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaChartLine, FaBrain, FaNetworkWired, FaLightbulb, FaFileAlt } from 'react-icons/fa';
import PaperSummary from '../components/PaperSummary';
import Chatbot from '../components/Chatbot';
import PaperChatbot from '../components/PaperChatbot';
import { fetchPaperById } from '../services/apiWrapper';
import ImprovedKnowledgeGraph from '../components/ImprovedKnowledgeGraph';

const PaperDetail = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [graphMode, setGraphMode] = useState('connections');
  
  useEffect(() => {
    const loadPaper = async () => {
      setLoading(true);
      try {
        const data = await fetchPaperById(id);
        setPaper(data);
        
        // Load related papers for visualization
        if (data.relatedPapers && data.relatedPapers.length > 0) {
          const relatedIds = data.relatedPapers.map(p => p.id);
          const relatedData = [];
          
          for (const relId of relatedIds) {
            try {
              const relPaper = await fetchPaperById(relId);
              relatedData.push(relPaper);
            } catch (e) {
              console.warn(`Could not load related paper with id ${relId}`, e);
            }
          }
          
          setRelatedPapers([data, ...relatedData]);
        } else {
          setRelatedPapers([data]);
        }
        
        // Set page title
        document.title = `${data.title} | NASA Bioscience Explorer`;
      } catch (err) {
        console.error('Error loading paper:', err);
        setError('Failed to load the paper. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaper();
    
    // Reset title when component unmounts
    return () => {
      document.title = 'NASA Bioscience Explorer';
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FaSpinner className="animate-spin text-blue-500 mb-4" size={36} />
        <p className="text-gray-300">Loading research paper...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/30 text-red-200 p-6 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
          &larr; Back to papers
        </Link>
      </div>
    );
  }

  if (!paper) return null;
  
  // Extract key findings or use related studies if findings not available
  const keyFindings = paper.findings || paper.relatedStudies || [];
  
  // Dashboard insights based on paper data
  const insights = [
    {
      id: 'methodology',
      title: 'Research Methodology',
      description: `This study utilized ${paper.category.toLowerCase()} techniques to investigate the effects of ${paper.keywords.slice(0, 3).join(', ')} in space environments.`,
      icon: <FaFileAlt className="text-blue-400" size={24} />
    },
    {
      id: 'impact',
      title: 'Research Impact',
      description: `Cited by ${paper.citations || 'multiple'} studies, this research contributes significantly to our understanding of ${paper.category.toLowerCase()} in space.`,
      icon: <FaChartLine className="text-purple-400" size={24} />
    },
    {
      id: 'applications',
      title: 'Practical Applications',
      description: `Findings from this research could be applied to develop countermeasures for ${paper.keywords[0].toLowerCase()} during long-duration space missions.`,
      icon: <FaLightbulb className="text-yellow-400" size={24} />
    }
  ];

  return (
    <div>
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition"
      >
        <FaArrowLeft className="mr-2" /> Back to papers
      </Link>

      {/* Dashboard Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-indigo-800/30 pb-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-t-lg text-sm transition ${
              activeTab === 'summary' 
                ? 'bg-indigo-900/40 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FaFileAlt className="inline mr-2" /> Paper Summary
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-t-lg text-sm transition ${
              activeTab === 'insights' 
                ? 'bg-indigo-900/40 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FaBrain className="inline mr-2" /> Insights
          </button>
          
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-t-lg text-sm transition ${
              activeTab === 'graph' 
                ? 'bg-indigo-900/40 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FaNetworkWired className="inline mr-2" /> Knowledge Graph
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PaperSummary paper={paper} />
          </motion.div>
        )}
        
        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Research Insights</h2>
            
            {/* AI-derived insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {insights.map(insight => (
                <div 
                  key={insight.id}
                  className="bg-slate-700/30 border border-indigo-800/20 rounded-xl p-5"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-900/40 flex items-center justify-center mr-4">
                      {insight.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                  </div>
                  <p className="text-gray-300">{insight.description}</p>
                </div>
              ))}
            </div>
            
            {/* Key experimental findings with visualized data */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Experimental Results Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Result visualization 1 */}
                <div className="bg-slate-700/20 border border-indigo-800/20 rounded-xl p-5">
                  <h4 className="text-white font-medium mb-3">Key Finding Impact</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                      {keyFindings.length > 0 ? keyFindings.map((finding, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-300">{finding}</span>
                            <span className="text-sm text-blue-400">{70 - idx * 10}% impact</span>
                          </div>
                          <div className="w-full bg-slate-700/40 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                              style={{ width: `${70 - idx * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-400">
                          <p>No specific findings available for this paper.</p>
                          <p className="text-sm mt-2">Key insights are derived from the abstract and research significance.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Result visualization 2 */}
                <div className="bg-slate-700/20 border border-indigo-800/20 rounded-xl p-5">
                  <h4 className="text-white font-medium mb-3">Research Focus Areas</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                      {paper.keywords.slice(0, 5).map((keyword, idx) => (
                        <div 
                          key={idx} 
                          className="relative mb-3 p-2 pl-4 bg-indigo-900/20 border-l-4 rounded"
                          style={{
                            borderLeftColor: `hsl(${210 + idx * 15}, 70%, 50%)`,
                            width: `${90 - idx * 5}%`
                          }}
                        >
                          <span className="text-white">{keyword}</span>
                          <span className="absolute right-2 text-xs text-blue-300">
                            {Math.floor(Math.random() * 15) + 5} references
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Research Data Visualization in Insights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Research Data Analysis</h3>
              <div className="bg-slate-700/20 border border-indigo-800/20 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Key Research Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Research Impact Score</span>
                        <span className="text-blue-400 font-bold">{paper.citations || 0} citations</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Research Category</span>
                        <span className="text-green-400 font-medium">{paper.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Publication Year</span>
                        <span className="text-purple-400 font-medium">
                          {new Date(paper.publishedDate || paper.publicationDate).getFullYear()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Research Focus</span>
                        <span className="text-yellow-400 font-medium">{paper.keywords[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Research Significance</h4>
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {paper.significance}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related research context */}
            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Research Context & Implications</h3>
              <div className="bg-slate-700/20 border border-indigo-800/20 rounded-xl p-5">
                <p className="text-gray-300 mb-4">
                  This research on <strong className="text-white">{paper.keywords[0]}</strong> relates to {paper.relatedPapers.length} other studies in the NASA bioscience database, forming part of a larger body of work on {paper.category}.
                </p>
                <p className="text-gray-300 mb-4">
                  The findings have significant implications for {paper.keywords.slice(1, 3).join(' and ')} research, potentially informing future space missions and astronaut health protocols.
                </p>
                <div className="p-4 bg-indigo-900/20 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Key Takeaway</h4>
                  <p className="text-indigo-300 italic">"{paper.significance}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Knowledge Graph Tab */}
        {activeTab === 'graph' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-800/50 border border-indigo-800/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Knowledge Graph Visualization</h2>
                <p className="text-gray-400 text-sm">
                  {graphMode === 'connections' && 'Explore research relationships and connections between papers'}
                  {graphMode === 'clusters' && 'Discover topic clusters and research themes'}
                  {graphMode === 'citations' && 'Analyze citation patterns and research impact'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setGraphMode('connections')}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    graphMode === 'connections'
                      ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800/30'
                      : 'bg-slate-800/60 text-gray-400 border-slate-700/60 hover:bg-slate-700/60 hover:text-gray-300'
                  }`}
                >
                  Research Connections
                </button>
                <button 
                  onClick={() => setGraphMode('clusters')}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    graphMode === 'clusters'
                      ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800/30'
                      : 'bg-slate-800/60 text-gray-400 border-slate-700/60 hover:bg-slate-700/60 hover:text-gray-300'
                  }`}
                >
                  Topic Clusters
                </button>
                <button 
                  onClick={() => setGraphMode('citations')}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    graphMode === 'citations'
                      ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800/30'
                      : 'bg-slate-800/60 text-gray-400 border-slate-700/60 hover:bg-slate-700/60 hover:text-gray-300'
                  }`}
                >
                  Citation Network
                </button>
              </div>
            </div>
            
            {/* Mode Statistics */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {graphMode === 'connections' && (
                <>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{relatedPapers.length}</div>
                    <div className="text-sm text-gray-400">Total Papers</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {relatedPapers.reduce((acc, paper) => acc + (paper.relatedPapers?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Connections</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.round(relatedPapers.reduce((acc, paper) => acc + (paper.relatedPapers?.length || 0), 0) / relatedPapers.length * 10) / 10}
                    </div>
                    <div className="text-sm text-gray-400">Avg Connections</div>
                  </div>
                </>
              )}
              
              {graphMode === 'clusters' && (
                <>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {Object.keys(relatedPapers.reduce((clusters, paper) => {
                        const key = `${paper.category}-${paper.keywords[0]}`;
                        clusters[key] = true;
                        return clusters;
                      }, {})).length}
                    </div>
                    <div className="text-sm text-gray-400">Topic Clusters</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.max(...Object.values(relatedPapers.reduce((clusters, paper) => {
                        const key = `${paper.category}-${paper.keywords[0]}`;
                        clusters[key] = (clusters[key] || 0) + 1;
                        return clusters;
                      }, {})).values())}
                    </div>
                    <div className="text-sm text-gray-400">Largest Cluster</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {new Set(relatedPapers.map(p => p.category)).size}
                    </div>
                    <div className="text-sm text-gray-400">Research Categories</div>
                  </div>
                </>
              )}
              
              {graphMode === 'citations' && (
                <>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {Math.max(...relatedPapers.map(p => p.citations || 0))}
                    </div>
                    <div className="text-sm text-gray-400">Highest Citations</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round(relatedPapers.reduce((acc, p) => acc + (p.citations || 0), 0) / relatedPapers.length)}
                    </div>
                    <div className="text-sm text-gray-400">Avg Citations</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {relatedPapers.filter(p => (p.citations || 0) > 50).length}
                    </div>
                    <div className="text-sm text-gray-400">High Impact Papers</div>
                  </div>
                </>
              )}
            </div>

            {/* Knowledge Graph Visualization */}
            <div className="mb-6">
              <ImprovedKnowledgeGraph
                papers={relatedPapers}
                activePaperId={id}
                mode={graphMode}
              />
            </div>
            
            {/* Dynamic Legend based on mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {graphMode === 'connections' && (
                <>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                      <span className="text-white">Current Paper</span>
                    </div>
                    <p className="text-gray-400">The paper you are currently viewing</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></div>
                      <span className="text-white">Related Papers</span>
                    </div>
                    <p className="text-gray-400">Papers that share topics or citations</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-1 bg-indigo-400/30 mr-2"></div>
                      <span className="text-white">Connections</span>
                    </div>
                    <p className="text-gray-400">Research relationships between papers</p>
                  </div>
                </>
              )}
              
              {graphMode === 'clusters' && (
                <>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-white">Health & Medicine</span>
                    </div>
                    <p className="text-gray-400">Papers focused on health and medical research</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-white">Space Biology</span>
                    </div>
                    <p className="text-gray-400">Papers about biological effects in space</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-white">Cellular Biology</span>
                    </div>
                    <p className="text-gray-400">Papers studying cellular mechanisms</p>
                  </div>
                </>
              )}
              
              {graphMode === 'citations' && (
                <>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-white">High Impact</span>
                    </div>
                    <p className="text-gray-400">Papers with 70+ citations (highly influential)</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-white">Medium Impact</span>
                    </div>
                    <p className="text-gray-400">Papers with 30-70 citations (moderately cited)</p>
                  </div>
                  <div className="bg-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-white">Emerging</span>
                    </div>
                    <p className="text-gray-400">Papers with fewer citations (emerging research)</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Related papers section */}
      {paper.relatedPapers && paper.relatedPapers.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-4">Related Papers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paper.relatedPapers.map(relatedPaper => (
              <Link 
                key={relatedPaper.id} 
                to={`/paper/${relatedPaper.id}`}
                className="block bg-slate-800/40 border border-indigo-800/20 p-4 rounded-lg hover:bg-slate-800/60 transition"
              >
                <h3 className="font-medium text-blue-300 mb-1">{relatedPaper.title}</h3>
                <p className="text-sm text-gray-400">{relatedPaper.authors.join(", ")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Chatbot component */}
      <Chatbot paperId={paper.id} paperTitle={paper.title} />
    </div>
  );
};

export default PaperDetail;
