const Parameter = require('../models/Parameter');

const addParameter = async (req, res) => {
  try {
    const param = await Parameter.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json(param);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getParameters = async (req, res) => {
  try {
    const params = await Parameter.find({ patientId: req.params.patientId })
      .populate('recordedBy', 'fullName')
      .sort('-createdAt');
    res.json(params);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateParameter = async (req, res) => {
  try {
    const param = await Parameter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!param) return res.status(404).json({ message: 'Record not found' });
    res.json(param);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addParameter, getParameters, updateParameter };
