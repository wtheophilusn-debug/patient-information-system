const router = require('express').Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/doctors', async (req, res) => {
  const User = require('../models/User');
  const doctors = await User.find({ role: 'Doctor' }).select('fullName');
  res.json(doctors);
});
router.use(authorize('Administrator'));
router.route('/').get(getUsers).post(createUser);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
