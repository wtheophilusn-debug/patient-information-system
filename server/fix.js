require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const fix = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteOne({ username: 'patient1' });
  console.log('Deleted patient1 user');
  process.exit();
};

fix().catch(err => { console.error(err); process.exit(1); });
