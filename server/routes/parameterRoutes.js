const router = require('express').Router();
const { addParameter, getParameters, updateParameter } = require('../controllers/parameterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', authorize('Nurse', 'Administrator'), addParameter);
router.get('/:patientId', getParameters);
router.put('/:id', authorize('Nurse', 'Administrator'), updateParameter);

module.exports = router;
