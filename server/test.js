require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete and recreate patient1
  await User.deleteOne({ username: 'patient1' });
  
  const hashed = await bcrypt.hash('Pass@123', 10);
  await User.create({ fullName: 'Patient One', username: 'patient1', email: 'patient1@pis.com', password: hashed, role: 'Patient' });
  
  // Verify login works
  const user = await User.findOne({ username: 'patient1' });
  const match = await bcrypt.compare('Pass@123', user.password);
  console.log('Password match:', match);
  console.log('Patient1 created successfully');
  process.exit();
};

test().catch(err => { console.error(err); process.exit(1); });
