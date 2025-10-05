/**
 * Export utilities for NASA Bioscience Explorer
 */

/**
 * Export papers to CSV
 */
export const exportToCSV = (papers, filename = 'nasa_papers.csv') => {
  if (!papers || papers.length === 0) {
    alert('No papers to export');
    return;
  }

  const headers = ['Title', 'Authors', 'Category', 'Keywords', 'Publication Date', 'Citations', 'Abstract', 'Link'];

  const csvContent = [
    headers.join(','),
    ...papers.map(paper => [
      `"${(paper.title || '').replace(/"/g, '""')}"`,
      `"${(paper.authors || []).join('; ').replace(/"/g, '""')}"`,
      `"${(paper.category || 'General').replace(/"/g, '""')}"`,
      `"${(paper.keywords || []).join(', ').replace(/"/g, '""')}"`,
      `"${paper.publicationDate || 'N/A'}"`,
      paper.citations || 0,
      `"${(paper.abstract || '').substring(0, 500).replace(/"/g, '""')}"`,
      `"${paper.pdfUrl || paper.doi || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export research summary to text
 */
export const exportToText = (papers, filename = 'nasa_research_summary.txt') => {
  if (!papers || papers.length === 0) {
    alert('No papers to export');
    return;
  }

  const content = `
NASA Space Biology Research Summary
Generated: ${new Date().toLocaleString()}
Total Papers: ${papers.length}

========================================

${papers.map((paper, index) => `
${index + 1}. ${paper.title}
   Authors: ${(paper.authors || []).join(', ')}
   Category: ${paper.category || 'General'}
   Keywords: ${(paper.keywords || []).join(', ')}
   Citations: ${paper.citations || 0}

   Abstract:
   ${paper.abstract || 'No abstract available'}

   Link: ${paper.pdfUrl || paper.doi || 'N/A'}

----------------------------------------
`).join('\n')}

========================================
End of Report
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export category statistics to JSON
 */
export const exportStatsToJSON = (papers, filename = 'nasa_stats.json') => {
  if (!papers || papers.length === 0) {
    alert('No papers to export');
    return;
  }

  const categoryCount = {};
  const keywordCount = {};

  papers.forEach(paper => {
    const category = paper.category || 'General';
    categoryCount[category] = (categoryCount[category] || 0) + 1;

    (paper.keywords || []).forEach(keyword => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });
  });

  const stats = {
    generatedAt: new Date().toISOString(),
    totalPapers: papers.length,
    categories: Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    topKeywords: Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    papers: papers.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      keywords: p.keywords,
      citations: p.citations
    }))
  };

  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy research summary to clipboard
 */
export const copyToClipboard = async (papers) => {
  if (!papers || papers.length === 0) {
    alert('No papers to copy');
    return false;
  }

  const summary = `NASA Space Biology Research (${papers.length} papers):\n\n${papers.slice(0, 10).map((p, i) =>
    `${i + 1}. ${p.title}\n   Category: ${p.category || 'General'}\n   ${p.keywords?.join(', ') || ''}`
  ).join('\n\n')}${papers.length > 10 ? `\n\n... and ${papers.length - 10} more papers` : ''}`;

  try {
    await navigator.clipboard.writeText(summary);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
