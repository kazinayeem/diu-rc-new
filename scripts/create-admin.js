/**
 * Script to create the first admin user
 * 
 * Usage: node scripts/create-admin.js
 * 
 * Make sure to set MONGODB_URI in your environment or .env.local file
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['super-admin', 'admin', 'moderator'], default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in .env.local');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin with email admin@example.com already exists');
      console.log('   To create a new admin, change the email in this script');
      await mongoose.disconnect();
      process.exit(0);
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'super-admin',
      isActive: true,
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('\n📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

