const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms:         { type: String },
  diagnosis:        { type: String },
  prescription:     { type: String },
  consultationDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
