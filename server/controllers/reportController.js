const Patient      = require('../models/Patient');
const Consultation = require('../models/Consultation');
const Appointment  = require('../models/Appointment');
const User         = require('../models/User');

const patientReport = async (req, res) => {
  try {
    const total       = await Patient.countDocuments();
    const byGender    = await Patient.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]);
    const byProvince  = await Patient.aggregate([{ $group: { _id: '$province', count: { $sum: 1 } } }]);
    const byDistrict  = await Patient.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }]);
    res.json({ total, byGender, byProvince, byDistrict });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const consultationReport = async (req, res) => {
  try {
    const total   = await Consultation.countDocuments();
    const monthly = await Consultation.aggregate([
      { $group: {
          _id: { year: { $year: '$consultationDate' }, month: { $month: '$consultationDate' } },
          count: { $sum: 1 },
      }},
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);
    res.json({ total, monthly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const appointmentReport = async (req, res) => {
  try {
    const total    = await Appointment.countDocuments();
    const byStatus = await Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    res.json({ total, byStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userReport = async (req, res) => {
  try {
    const total  = await User.countDocuments();
    const byRole = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    res.json({ total, byRole });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { patientReport, consultationReport, appointmentReport, userReport };
