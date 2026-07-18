const Appointment = require('../models/Appointment');

const addAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const filter = req.user.role === 'Patient'
      ? { patientId: req.user._id }
      : req.user.role === 'Doctor'
      ? { doctorId: req.user._id }
      : {};
    const appts = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName patientNumber')
      .populate('doctorId', 'fullName')
      .sort('-appointmentDate');
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('patientId', 'firstName lastName patientNumber')
      .populate('doctorId', 'fullName');
    if (!appt) return res.status(404).json({ message: 'Not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) return res.status(404).json({ message: 'Not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment };
