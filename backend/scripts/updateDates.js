const mongoose = require('mongoose');
const Paper = require('../models/Paper');
const { scrapePMCPage } = require('../utils/pmcScraper');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nasa_bioscience';

async function updatePublicationDates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Get all papers without publication dates
    const papers = await Paper.find({ publicationDate: null });
    console.log(`📄 Found ${papers.length} papers without publication dates`);

    let updated = 0;
    let failed = 0;

    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      console.log(`\n[${i + 1}/${papers.length}] Processing: ${paper.title.substring(0, 60)}...`);

      try {
        // Re-scrape the PMC page
        const scrapedData = await scrapePMCPage(paper.pmcLink);

        if (scrapedData.publicationDate) {
          paper.publicationDate = scrapedData.publicationDate;
          await paper.save();
          updated++;
          console.log(`✅ Updated: ${scrapedData.publicationDate.toISOString().split('T')[0]}`);
        } else {
          console.log(`⚠️  No date found`);
          failed++;
        }

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error updating ${paper.title}:`, error.message);
        failed++;
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${papers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePublicationDates();
