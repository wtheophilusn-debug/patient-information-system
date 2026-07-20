const router = require('express').Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/doctors', async (req, res) => {
  const User = require('../models/User');
  const doctors = await User.find({ role: 'Doctor' }).select('fullName');
  res.json(doctors);
});
router.get('/patients-list', async (req, res) => {
  const User = require('../models/User');
  const patients = await User.find({ role: 'Patient' }).select('fullName username');
  res.json(patients);
});
router.use(authorize('Administrator'));
router.route('/').get(getUsers).post(createUser);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
