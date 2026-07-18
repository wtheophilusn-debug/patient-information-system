require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ username: 'admin' });
  if (existing) { console.log('Admin already exists'); process.exit(); }
  await User.create({ fullName: 'System Admin', username: 'admin', email: 'admin@pis.com', password: 'Admin@123', role: 'Administrator' });
  console.log('Admin created — username: admin, password: Admin@123');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
