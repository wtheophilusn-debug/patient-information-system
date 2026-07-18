const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  patientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  weight:      { type: Number },
  height:      { type: Number },
  temperature: { type: Number },
  recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Parameter', parameterSchema);
