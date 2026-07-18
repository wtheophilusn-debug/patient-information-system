const router = require('express').Router();
const { getPatients, getPatient, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(getPatients)
  .post(authorize('Receptionist', 'Administrator'), createPatient);
router.route('/:id')
  .get(getPatient)
  .put(authorize('Receptionist', 'Administrator'), updatePatient)
  .delete(authorize('Administrator'), deletePatient);

module.exports = router;
