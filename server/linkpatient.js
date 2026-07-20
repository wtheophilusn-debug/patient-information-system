require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Patient = require('./models/Patient');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const patient1 = await User.findOne({ username: 'patient1' });
  await Patient.updateOne({ patientNumber: 'P0001' }, { userId: patient1._id });
  console.log('P0001 John Doe linked to patient1');
  process.exit();
};

run().catch(err => { console.error(err); process.exit(1); });
