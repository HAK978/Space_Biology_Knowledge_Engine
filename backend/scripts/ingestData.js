const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Paper = require('../models/Paper');
const { parsePublicationsCSV } = require('../utils/csvParser');
const { scrapePMCBatch } = require('../utils/pmcScraper');
const { enhancePapersBatch } = require('../utils/geminiEnhancer');

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Main data ingestion function
 */
async function ingestData() {
  try {
    console.log('🚀 Starting data ingestion process...\n');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nasa_bioscience';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected\n');

    // Step 1: Parse CSV
    console.log('📄 Step 1: Parsing CSV file...');
    const parsedPapers = await parsePublicationsCSV();
    console.log(`✅ Found ${parsedPapers.length} papers\n`);

    // Step 2: Scrape PMC for abstracts (limit to first 100 for testing, then do all)
    const LIMIT = process.env.SCRAPE_LIMIT ? parseInt(process.env.SCRAPE_LIMIT) : 100;
    const papersToProcess = parsedPapers.slice(0, LIMIT);

    console.log(`📥 Step 2: Scraping PMC for ${papersToProcess.length} papers...`);
    const scrapedData = await scrapePMCBatch(papersToProcess, 5);
    console.log(`✅ Scraping complete\n`);

    // Merge parsed and scraped data
    const mergedPapers = papersToProcess.map((paper, index) => ({
      ...paper,
      ...scrapedData[index]
    }));

    // Step 3: Enhance with AI
    console.log('🤖 Step 3: Enhancing papers with Gemini AI...');
    const enhancedData = await enhancePapersBatch(mergedPapers, 10);
    console.log('✅ AI enhancement complete\n');

    // Merge AI-enhanced data
    const finalPapers = mergedPapers.map((paper, index) => ({
      title: paper.title,
      pmcLink: paper.pmcLink,
      abstract: paper.abstract || '',
      authors: paper.authors || [],
      keywords: enhancedData[index].keywords || [],
      category: enhancedData[index].category || 'General',
      publicationDate: paper.publicationDate,
      significance: enhancedData[index].significance || '',
      metadata: paper.metadata || {},
      processingStatus: paper.success ? 'completed' : 'failed'
    }));

    // Step 4: Save to database
    console.log('💾 Step 4: Saving to database...');

    // Clear existing data (optional - comment out if you want to keep old data)
    await Paper.deleteMany({});
    console.log('🗑️  Cleared existing papers');

    // Insert papers
    const inserted = await Paper.insertMany(finalPapers, { ordered: false });
    console.log(`✅ Inserted ${inserted.length} papers into database\n`);

    // Statistics
    const stats = {
      total: inserted.length,
      byCategory: await Paper.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      withAbstracts: await Paper.countDocuments({ abstract: { $ne: '' } }),
      processingStatus: await Paper.aggregate([
        { $group: { _id: '$processingStatus', count: { $sum: 1 } } }
      ])
    };

    console.log('📊 Statistics:');
    console.log(`   Total papers: ${stats.total}`);
    console.log(`   Papers with abstracts: ${stats.withAbstracts}`);
    console.log('\n   By category:');
    stats.byCategory.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count}`);
    });

    console.log('\n✅ Data ingestion complete!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error during data ingestion:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  ingestData();
}

module.exports = { ingestData };
