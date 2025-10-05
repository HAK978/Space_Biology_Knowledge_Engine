const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape abstract and metadata from PMC article page
 * @param {string} pmcUrl - The PMC article URL
 * @returns {Promise<Object>} Scraped data
 */
async function scrapePMCArticle(pmcUrl) {
  try {
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(pmcUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Extract abstract
    let abstract = '';
    const abstractSection = $('.abstract');
    if (abstractSection.length > 0) {
      // Remove unwanted elements
      abstractSection.find('.title').remove();
      abstract = abstractSection.text().trim();
    }

    // Fallback: try different abstract selectors
    if (!abstract) {
      abstract = $('#abstract').text().trim() ||
                 $('div[id*="abstract"]').text().trim() ||
                 $('.abstracts').text().trim();
    }

    // Extract authors
    const authors = [];
    $('.contrib-group .name, .authors .author').each((i, elem) => {
      const author = $(elem).text().trim();
      if (author) authors.push(author);
    });

    // Extract publication date
    let publicationDate = null;
    const dateText = $('meta[name="citation_publication_date"]').attr('content') ||
                     $('meta[name="citation_date"]').attr('content') ||
                     $('.fm-vol-iss-date').text().trim() ||
                     $('.publication-date').text().trim() ||
                     $('.pub-date').text().trim();

    if (dateText) {
      const parsedDate = new Date(dateText);
      if (!isNaN(parsedDate.getTime())) {
        publicationDate = parsedDate;
      }
    }

    // Extract metadata
    const metadata = {
      doi: $('meta[name="citation_doi"]').attr('content') || '',
      pmcId: extractPMCId(pmcUrl),
      pmid: $('meta[name="citation_pmid"]').attr('content') || '',
      journal: $('meta[name="citation_journal_title"]').attr('content') || '',
      volume: $('meta[name="citation_volume"]').attr('content') || '',
      issue: $('meta[name="citation_issue"]').attr('content') || '',
      pages: $('meta[name="citation_firstpage"]').attr('content') || ''
    };

    return {
      abstract: abstract.substring(0, 5000), // Limit abstract length
      authors: authors.slice(0, 20), // Limit number of authors
      publicationDate,
      metadata,
      success: true
    };

  } catch (error) {
    console.error(`❌ Error scraping ${pmcUrl}:`, error.message);
    return {
      abstract: '',
      authors: [],
      publicationDate: null,
      metadata: {},
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract PMC ID from URL
 * @param {string} url - PMC URL
 * @returns {string} PMC ID
 */
function extractPMCId(url) {
  const match = url.match(/PMC(\d+)/);
  return match ? `PMC${match[1]}` : '';
}

/**
 * Scrape multiple PMC articles in batches
 * @param {Array} papers - Array of papers with pmcLink
 * @param {number} batchSize - Number of papers to process at once
 * @returns {Promise<Array>} Array of scraped data
 */
async function scrapePMCBatch(papers, batchSize = 5) {
  const results = [];

  for (let i = 0; i < papers.length; i += batchSize) {
    const batch = papers.slice(i, i + batchSize);
    console.log(`📥 Scraping batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(papers.length/batchSize)}`);

    const batchResults = await Promise.all(
      batch.map(paper => scrapePMCArticle(paper.pmcLink))
    );

    results.push(...batchResults);

    // Progress update
    console.log(`✅ Processed ${Math.min(i + batchSize, papers.length)}/${papers.length} papers`);
  }

  return results;
}

module.exports = { scrapePMCArticle, scrapePMCBatch };
