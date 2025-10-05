const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

/**
 * Parse the NASA publications CSV file
 * @returns {Promise<Array>} Array of papers with title and link
 */
function parsePublicationsCSV() {
  return new Promise((resolve, reject) => {
    const papers = [];
    const csvPath = path.join(__dirname, '../..', 'public', 'data', 'SB_publication_PMC.csv');

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return reject(new Error(`CSV file not found at ${csvPath}`));
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Clean up the data - handle BOM in headers
        const title = row.Title || row.title || row['﻿Title'] || '';
        const link = row.Link || row.link || '';

        if (title && link) {
          papers.push({
            title: title.trim(),
            pmcLink: link.trim()
          });
        }
      })
      .on('end', () => {
        console.log(`✅ Parsed ${papers.length} papers from CSV`);
        resolve(papers);
      })
      .on('error', (error) => {
        console.error('❌ Error parsing CSV:', error);
        reject(error);
      });
  });
}

module.exports = { parsePublicationsCSV };
