const express = require('express');
const AnswerController = require('../controllers/AnswerController');
const {
  authentication,
  isTeacher,
  isStudent,
} = require('../middleware/authentication');

const router = express.Router();

router.post('/', authentication, AnswerController.create);

router.post('/answers/:answerId/like', AnswerController.likeAnswer);

router.post('/answers/:answerId/dislike', AnswerController.dislikeAnswer);

router.get('/all', authentication, AnswerController.getAllAnswers);

router.put('/update', authentication, AnswerController.updateAnswer);

router.delete(
  '/delete/:answerId',
  authentication,
  AnswerController.deleteAnswer
);

module.exports = router;
