require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String, role: String }, { strict: false }));
  const user = await User.findOne({ username: 'patient1' });
  console.log('Stored password:', user.password);
  const match = await bcrypt.compare('Pass@123', user.password);
  console.log('Manual bcrypt compare:', match);
  process.exit();
};

check().catch(err => { console.error(err); process.exit(1); });
