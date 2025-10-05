const mongoose = require('mongoose');
const Paper = require('./models/Paper');

mongoose.connect('mongodb://localhost:27017/nasa_bioscience')
  .then(async () => {
    const count = await Paper.countDocuments();
    const withAbstracts = await Paper.countDocuments({ abstract: { $ne: '' } });
    const categories = await Paper.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 DATABASE STATUS:');
    console.log('==================');
    console.log('✅ Total papers:', count);
    console.log('📝 With abstracts:', withAbstracts);
    console.log('\n📂 Categories:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Error:', err.message);
    process.exit(1);
  });
