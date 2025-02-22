const express = require('express');
const DoubtController = require('../controllers/DoubtController');
const {
  authentication,
  isTeacher,
  isStudent,
} = require('../middleware/authentication');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  '/',
  authentication,
  upload.single('image'),
  DoubtController.createDoubt
);

router.put(
  '/doubts',
  authentication,
  isTeacher,
  upload.single('image'),
  DoubtController.updateDoubt
);
router.put(
  '/id/:_id',
  authentication,
  isTeacher,
  DoubtController.updateDoubtById
);
router.put(
  '/update/:topic',
  authentication,
  isTeacher,
  DoubtController.updateDoubtByTopic
);
router.put(
  '/resolved/:doubtId',
  authentication,
  isStudent,
  DoubtController.markDoubtAsResolved
);
router.put(
  '/unresolved/:doubtId',
  authentication,
  isStudent,
  DoubtController.markDoubtAsUnresolved
);

router.get(
  '/all/doubts',
  authentication,
  isTeacher,
  DoubtController.getAllDoubts
);
router.get(
  '/all/all',
  authentication,
  isTeacher,
  DoubtController.getEverything
);
router.get('/search/:text', authentication, DoubtController.searchDoubts);
// router.get('/:_id', DoubtController.getDoubtById);

router.delete('/doubts/:doubtId', DoubtController.deleteDoubt);

module.exports = router;
