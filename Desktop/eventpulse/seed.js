const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for Seeding...');

    // Upsert Categories
    const categories = ['Music', 'Tech', 'Sports'];
    const categoryDocs = {};
    for (const catName of categories) {
      const doc = await Category.findOneAndUpdate(
        { name: catName },
        { name: catName },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryDocs[catName] = doc._id;
    }
    console.log('Categories Seeded: Music, Tech, Sports');

    // Upsert Admin User
    const adminPassword = await bcrypt.hash('Admin@123456', 10);
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@eventpulse.com' },
      {
        name: 'System Admin',
        email: 'admin@eventpulse.com',
        password: adminPassword,
        role: 'admin'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Admin User Seeded: admin@eventpulse.com`);

    // Upsert Sample Events
    const sampleEvents = [
      {
        title: 'Global Tech Summit 2026',
        description: 'Explore futuristic software development, AI, and cloud architectures.',
        date: new Date('2026-10-15T09:00:00.000Z'),
        city: 'Cairo',
        capacity: 100,
        category: categoryDocs['Tech']
      },
      {
        title: 'International Music Festival',
        description: 'A grand weekend celebration featuring global musical talent.',
        date: new Date('2026-11-20T18:00:00.000Z'),
        city: 'Alexandria',
        capacity: 250,
        category: categoryDocs['Music']
      },
      {
        title: 'National Marathon 2026',
        description: 'Annual city marathon promoting health and athletic excellence.',
        date: new Date('2026-12-05T06:00:00.000Z'),
        city: 'Giza',
        capacity: 500,
        category: categoryDocs['Sports']
      }
    ];

    for (const evt of sampleEvents) {
      await Event.findOneAndUpdate(
        { title: evt.title },
        evt,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Sample Events Seeded Successfully!');

    console.log('Database Seeding Finished without duplicates.');
    process.exit(0);
  } catch (err) {
    console.error('Database Seeding Failed:', err);
    process.exit(1);
  }
};

seed();
