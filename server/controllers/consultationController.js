const Consultation = require('../models/Consultation');

const addConsultation = async (req, res) => {
  try {
    const consult = await Consultation.create({ ...req.body, doctorId: req.user._id });
    res.status(201).json(consult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getConsultations = async (req, res) => {
  try {
    const consults = await Consultation.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullName')
      .sort('-consultationDate');
    res.json(consults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateConsultation = async (req, res) => {
  try {
    const consult = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!consult) return res.status(404).json({ message: 'Consultation not found' });
    res.json(consult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteConsultation = async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addConsultation, getConsultations, updateConsultation, deleteConsultation };
