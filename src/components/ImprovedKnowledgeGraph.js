import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { FaExpand, FaCompress, FaRedo } from 'react-icons/fa';

const ImprovedKnowledgeGraph = ({ papers, activePaperId, mode = 'connections' }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const graphRef = React.useRef();

  // Enhanced color schemes with gradients
  const colorSchemes = {
    connections: {
      default: '#6366f1',
      active: '#3b82f6',
      hover: '#60a5fa',
      link: 'rgba(99, 102, 241, 0.3)'
    },
    clusters: {
      'Health & Medicine': '#ef4444',
      'Biotechnology': '#3b82f6',
      'Plant Biology': '#10b981',
      'Cellular Biology': '#f59e0b',
      'Radiation': '#a855f7',
      'General': '#06b6d4',
      link: 'rgba(139, 92, 246, 0.15)'
    },
    citations: {
      high: '#f43f5e',
      medium: '#f59e0b',
      low: '#64748b',
      link: 'rgba(99, 102, 241, 0.4)'
    }
  };

  // Generate graph data
  useEffect(() => {
    if (!papers || papers.length === 0) return;

    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Limit to reasonable number for performance
    const limitedPapers = papers.slice(0, 50);

    // Create nodes
    limitedPapers.forEach((paper, idx) => {
      const citations = paper.citations || 0;
      const maxCitations = Math.max(...limitedPapers.map(p => p.citations || 0));

      let nodeColor = colorSchemes.connections.default;
      let nodeSize = 5;

      if (mode === 'clusters') {
        nodeColor = colorSchemes.clusters[paper.category] || colorSchemes.clusters.General;
        nodeSize = 6;
      } else if (mode === 'citations') {
        const normalized = maxCitations > 0 ? citations / maxCitations : 0;
        if (normalized > 0.7) nodeColor = colorSchemes.citations.high;
        else if (normalized > 0.3) nodeColor = colorSchemes.citations.medium;
        else nodeColor = colorSchemes.citations.low;
        nodeSize = 4 + normalized * 6;
      }

      if (paper.id === activePaperId) {
        nodeColor = colorSchemes.connections.active;
        nodeSize += 3;
      }

      const node = {
        id: paper.id,
        name: paper.title.substring(0, 50) + '...',
        title: paper.title,
        category: paper.category || 'General',
        keywords: paper.keywords || [],
        citations: citations,
        val: nodeSize,
        color: nodeColor,
        paper: paper
      };

      nodes.push(node);
      nodeMap.set(paper.id, node);
    });

    // Create links based on mode
    if (mode === 'connections') {
      // Connect papers based on related papers
      limitedPapers.forEach(paper => {
        if (paper.relatedPapers && Array.isArray(paper.relatedPapers)) {
          paper.relatedPapers.forEach(related => {
            const sourceNode = nodeMap.get(paper.id);
            const targetNode = nodeMap.get(related.id);
            if (sourceNode && targetNode) {
              links.push({
                source: paper.id,
                target: related.id,
                value: 1
              });
            }
          });
        }
      });

      // If no related papers, connect by shared keywords
      if (links.length === 0) {
        nodes.forEach((sourceNode, i) => {
          nodes.slice(i + 1).forEach(targetNode => {
            const sharedKeywords = sourceNode.keywords.filter(k =>
              targetNode.keywords.some(tk => tk.toLowerCase() === k.toLowerCase())
            ).length;

            if (sharedKeywords > 0) {
              links.push({
                source: sourceNode.id,
                target: targetNode.id,
                value: sharedKeywords / 2
              });
            }
          });
        });
      }
    } else if (mode === 'clusters') {
      // Connect nodes within same category
      const categorized = {};
      nodes.forEach(node => {
        if (!categorized[node.category]) {
          categorized[node.category] = [];
        }
        categorized[node.category].push(node);
      });

      Object.values(categorized).forEach(categoryNodes => {
        if (categoryNodes.length > 1) {
          categoryNodes.forEach((source, i) => {
            categoryNodes.slice(i + 1).forEach(target => {
              links.push({
                source: source.id,
                target: target.id,
                value: 1
              });
            });
          });
        }
      });
    } else if (mode === 'citations') {
      // Connect papers based on keywords and citations
      nodes.forEach((source, i) => {
        nodes.slice(i + 1).forEach(target => {
          const sharedKeywords = source.keywords.filter(k =>
            target.keywords.includes(k)
          ).length;
          const sameCategory = source.category === target.category;

          if (sharedKeywords >= 2 || sameCategory) {
            const strength = (sharedKeywords * 0.5 + (sameCategory ? 0.3 : 0));
            if (strength > 0.3) {
              links.push({
                source: source.id,
                target: target.id,
                value: strength
              });
            }
          }
        });
      });
    }

    setGraphData({ nodes, links });
  }, [papers, activePaperId, mode]);

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);

    // Highlight connected nodes and links
    const connectedNodes = new Set();
    const connectedLinks = new Set();

    graphData.links.forEach(link => {
      if (link.source.id === node.id || link.target.id === node.id) {
        connectedLinks.add(link);
        connectedNodes.add(link.source.id);
        connectedNodes.add(link.target.id);
      }
    });

    setHighlightNodes(connectedNodes);
    setHighlightLinks(connectedLinks);
  }, [graphData]);

  // Handle node hover
  const handleNodeHover = useCallback((node) => {
    setHoverNode(node || null);
  }, []);

  // Enhanced paint node with glow effects
  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 11 / globalScale;
    const isHighlighted = highlightNodes.has(node.id) || node.id === hoverNode?.id;

    // Draw glow for highlighted nodes
    if (isHighlighted || node.id === activePaperId) {
      const gradient = ctx.createRadialGradient(node.x, node.y, node.val, node.x, node.y, node.val * 2.5);
      gradient.addColorStop(0, node.color + '60');
      gradient.addColorStop(1, node.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.val * 2.5, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    // Draw main node circle with gradient
    const nodeGradient = ctx.createRadialGradient(
      node.x - node.val * 0.3,
      node.y - node.val * 0.3,
      node.val * 0.1,
      node.x,
      node.y,
      node.val
    );
    nodeGradient.addColorStop(0, node.color + 'FF');
    nodeGradient.addColorStop(1, node.color + 'CC');

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeGradient;
    ctx.fill();

    // Draw border
    if (isHighlighted || node.id === activePaperId) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5 / globalScale;
      ctx.shadowBlur = 10;
      ctx.shadowColor = node.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1 / globalScale;
      ctx.stroke();
    }

    // Draw label with shadow
    if (isHighlighted || node.id === activePaperId || globalScale > 1.5) {
      ctx.font = `${isHighlighted ? 'bold ' : ''}${fontSize}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, node.x, node.y + node.val + fontSize + 2);

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw citations badge for citation mode
    if (mode === 'citations' && node.citations > 0 && node.val > 5) {
      ctx.font = `bold ${Math.min(fontSize, 9)}px "Inter", sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.citations.toString(), node.x, node.y);
    }
  }, [highlightNodes, hoverNode, activePaperId, mode]);

  // Paint links
  const paintLink = useCallback((link, ctx, globalScale) => {
    const isHighlighted = highlightLinks.has(link);

    ctx.strokeStyle = isHighlighted
      ? 'rgba(96, 165, 250, 0.8)'
      : mode === 'clusters'
        ? colorSchemes.clusters.link
        : mode === 'citations'
          ? `rgba(59, 130, 246, ${link.value})`
          : colorSchemes.connections.link;

    ctx.lineWidth = isHighlighted ? 3 / globalScale : (link.value || 1) / globalScale;

    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.stroke();
  }, [highlightLinks, mode]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Reset view
  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  };

  return (
    <div className={`relative bg-gradient-to-br from-slate-900/80 via-indigo-950/50 to-slate-900/80 border border-indigo-600/20 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={resetView}
          className="bg-slate-800/90 hover:bg-indigo-700/90 text-white p-3 rounded-lg transition-all shadow-lg backdrop-blur-md border border-indigo-500/20 hover:border-indigo-400/40"
          title="Reset View"
        >
          <FaRedo />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-slate-800/90 hover:bg-indigo-700/90 text-white p-3 rounded-lg transition-all shadow-lg backdrop-blur-md border border-indigo-500/20 hover:border-indigo-400/40"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Graph */}
      <div className={isFullscreen ? 'h-screen' : 'h-[600px]'}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="title"
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
          cooldownTicks={100}
          onEngineStop={() => graphRef.current?.zoomToFit(400)}
          backgroundColor="transparent"
        />
      </div>

      {/* Info Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur-md border border-indigo-800/40 rounded-lg p-4 max-w-md shadow-xl">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
          <h3 className="text-white font-semibold mb-2 pr-6">{selectedNode.title}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Category:</span>
              <span className="text-blue-300">{selectedNode.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Citations:</span>
              <span className="text-purple-300">{selectedNode.citations}</span>
            </div>
            {selectedNode.keywords && selectedNode.keywords.length > 0 && (
              <div>
                <span className="text-gray-400">Keywords:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.keywords.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      {mode === 'clusters' && (
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-md border border-indigo-800/40 rounded-lg p-4 shadow-xl">
          <h4 className="text-white font-semibold mb-3 text-sm">Categories</h4>
          <div className="space-y-2">
            {Object.entries(colorSchemes.clusters)
              .filter(([key]) => key !== 'link')
              .map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-300 text-xs">{category}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {mode === 'citations' && (
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-md border border-indigo-800/40 rounded-lg p-4 shadow-xl">
          <h4 className="text-white font-semibold mb-3 text-sm">Citation Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorSchemes.citations.high }} />
              <span className="text-gray-300 text-xs">High Citations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorSchemes.citations.medium }} />
              <span className="text-gray-300 text-xs">Medium Citations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorSchemes.citations.low }} />
              <span className="text-gray-300 text-xs">Low Citations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedKnowledgeGraph;
