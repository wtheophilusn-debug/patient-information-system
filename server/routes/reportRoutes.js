const router = require('express').Router();
const { patientReport, consultationReport, appointmentReport, userReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Administrator', 'Doctor'));
router.get('/patients',      patientReport);
router.get('/consultations', consultationReport);
router.get('/appointments',  appointmentReport);
router.get('/users',         userReport);

module.exports = router;
