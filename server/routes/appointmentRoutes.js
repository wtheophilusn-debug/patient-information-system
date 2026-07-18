const router = require('express').Router();
const { addAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getAppointments).post(authorize('Doctor', 'Administrator'), addAppointment);
router.route('/:id')
  .get(getAppointment)
  .put(authorize('Doctor', 'Administrator'), updateAppointment)
  .delete(authorize('Administrator'), deleteAppointment);

module.exports = router;
