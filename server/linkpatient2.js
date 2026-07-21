require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Patient = require('./models/Patient');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const patient2 = await User.findOne({ username: 'patient2' });
  console.log('patient2 _id:', patient2._id.toString());

  // Link P0007 to patient2
  await Patient.updateOne({ patientNumber: 'P0007' }, { userId: patient2._id });
  console.log('P0007 Alodie NIYUMVA linked to patient2');

  // Verify
  const patients = await Patient.find({ userId: patient2._id });
  console.log('Patients linked to patient2:', patients.map(p => `${p.patientNumber} ${p.firstName} ${p.lastName}`));

  process.exit();
};

run().catch(err => { console.error(err); process.exit(1); });
