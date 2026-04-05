const mongoose = require('mongoose');
require('dotenv').config();

const certificateSchema = new mongoose.Schema({}, { strict: false });
const Certificate = mongoose.model('Certificate', certificateSchema, 'certificates');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const count = await Certificate.countDocuments();
    console.log('\n📊 DATABASE STATISTICS');
    console.log('====================');
    console.log(`Total Certificates in DB: ${count}`);
    
    if (count > 0) {
      const sample = await Certificate.findOne().lean();
      console.log('\n📝 Sample Certificate Fields:');
      console.log(Object.keys(sample || {}).sort());
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDB();
