const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Enhance paper with AI-generated metadata
 * @param {Object} paper - Paper object with title and abstract
 * @returns {Promise<Object>} Enhanced metadata
 */
async function enhancePaperWithAI(paper) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this NASA space biology research paper and provide structured metadata:

Title: ${paper.title}
Abstract: ${paper.abstract || 'No abstract available'}

Please provide the following in JSON format:
1. keywords: Array of 5-8 relevant keywords
2. category: One of ["Health & Medicine", "Space Biology", "Cellular Biology", "Biotechnology", "Engineering & Technology", "Radiation", "Plant Biology", "Microbiology"]
3. significance: 1-2 sentence summary of research significance (max 200 chars)
4. researchArea: Specific research focus (e.g., "bone loss", "immune response")

Return ONLY valid JSON, no markdown or code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let metadata;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      metadata = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response, using fallback');
      metadata = generateFallbackMetadata(paper);
    }

    return {
      keywords: metadata.keywords || [],
      category: metadata.category || 'General',
      significance: metadata.significance || '',
      researchArea: metadata.researchArea || '',
      success: true
    };

  } catch (error) {
    console.error('❌ Gemini AI error:', error.message);
    return {
      ...generateFallbackMetadata(paper),
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate fallback metadata from title/abstract
 * @param {Object} paper - Paper object
 * @returns {Object} Fallback metadata
 */
function generateFallbackMetadata(paper) {
  const title = paper.title.toLowerCase();
  const abstract = (paper.abstract || '').toLowerCase();

  // Simple keyword extraction
  const keywords = [];
  const keywordPatterns = [
    'microgravity', 'space', 'radiation', 'bone', 'muscle', 'cell',
    'gene', 'protein', 'immune', 'cardiovascular', 'plant', 'arabidopsis',
    'drosophila', 'mice', 'ISS', 'spaceflight', 'NASA'
  ];

  keywordPatterns.forEach(keyword => {
    if (title.includes(keyword) || abstract.includes(keyword)) {
      keywords.push(keyword);
    }
  });

  // Simple category detection
  let category = 'General';
  if (title.includes('bone') || title.includes('muscle') || title.includes('health')) {
    category = 'Health & Medicine';
  } else if (title.includes('cell') || title.includes('cellular')) {
    category = 'Cellular Biology';
  } else if (title.includes('plant') || title.includes('arabidopsis')) {
    category = 'Plant Biology';
  } else if (title.includes('radiation')) {
    category = 'Radiation';
  } else if (title.includes('gene') || title.includes('rna') || title.includes('dna')) {
    category = 'Biotechnology';
  }

  return {
    keywords: keywords.slice(0, 8),
    category,
    significance: `Research on ${keywords[0] || 'space biology'} relevant to space exploration.`,
    researchArea: keywords[0] || 'space biology'
  };
}

/**
 * Batch enhance papers with AI
 * @param {Array} papers - Array of papers
 * @param {number} batchSize - Number of papers to process at once
 * @returns {Promise<Array>} Enhanced papers
 */
async function enhancePapersBatch(papers, batchSize = 10) {
  const results = [];

  for (let i = 0; i < papers.length; i += batchSize) {
    const batch = papers.slice(i, i + batchSize);
    console.log(`🤖 AI enhancing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(papers.length/batchSize)}`);

    const batchResults = await Promise.all(
      batch.map(paper => enhancePaperWithAI(paper))
    );

    results.push(...batchResults);

    console.log(`✅ Enhanced ${Math.min(i + batchSize, papers.length)}/${papers.length} papers`);

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < papers.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}

module.exports = { enhancePaperWithAI, enhancePapersBatch };
