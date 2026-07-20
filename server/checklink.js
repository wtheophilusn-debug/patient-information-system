require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Patient = require('./models/Patient');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const patient1 = await User.findOne({ username: 'patient1' });
  console.log('patient1 _id:', patient1._id.toString());

  const patients = await Patient.find();
  for (const p of patients) {
    console.log(`${p.patientNumber} ${p.firstName} ${p.lastName} — userId: ${p.userId}`);
  }

  process.exit();
};

run().catch(err => { console.error(err); process.exit(1); });
