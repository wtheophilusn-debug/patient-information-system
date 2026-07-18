const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientNumber: { type: String, unique: true },
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  gender:     { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob:        { type: Date, required: true },
  phone:      { type: String, required: true },
  sector:     { type: String, required: true },
  district:   { type: String, required: true },
  province:   { type: String, required: true },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

patientSchema.pre('save', async function () {
  if (this.patientNumber) return;
  const count = await mongoose.model('Patient').countDocuments();
  this.patientNumber = 'P' + String(count + 1).padStart(4, '0');
});

module.exports = mongoose.model('Patient', patientSchema);
