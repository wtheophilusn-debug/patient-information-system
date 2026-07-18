const router = require('express').Router();
const { addConsultation, getConsultations, updateConsultation, deleteConsultation } = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', authorize('Doctor', 'Administrator'), addConsultation);
router.get('/:patientId', getConsultations);
router.put('/:id', authorize('Doctor', 'Administrator'), updateConsultation);
router.delete('/:id', authorize('Administrator'), deleteConsultation);

module.exports = router;
