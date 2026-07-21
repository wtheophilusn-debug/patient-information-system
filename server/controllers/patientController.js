const Patient = require('../models/Patient');

const getPatients = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { patientNumber: { $regex: q, $options: 'i' } },
            { firstName:     { $regex: q, $options: 'i' } },
            { lastName:      { $regex: q, $options: 'i' } },
            { phone:         { $regex: q, $options: 'i' } },
          ],
        }
      : {};
    const patients = await Patient.find(filter).sort('-createdAt');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.userId) delete body.userId;
    const patient = await Patient.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient };
