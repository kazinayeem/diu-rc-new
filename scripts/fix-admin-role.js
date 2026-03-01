/**
 * One-time migration: upgrades any admin with role "admin" or "moderator"
 * to "super-admin" so they can access the Manage Admins panel.
 *
 * Usage: node scripts/fix-admin-role.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  // Use a loose schema so we can read/write any role value
  const AdminSchema = new mongoose.Schema({}, { strict: false });
  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema, 'admins');

  const result = await Admin.updateMany(
    { role: { $in: ['admin', 'moderator'] } },
    { $set: { role: 'super-admin', permissions: [] } }
  );

  console.log(`✅ Updated ${result.modifiedCount} admin(s) to role "super-admin"`);

  const all = await Admin.find({}).select('name email role');
  console.log('\nCurrent admins:');
  all.forEach(a => console.log(`  - ${a.name} (${a.email}) → ${a.role}`));

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
