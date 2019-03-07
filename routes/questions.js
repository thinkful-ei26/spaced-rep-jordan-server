'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/userschema');
const passport = require('passport')

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }))

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  User.findOne({
      _id: userId
    })
    .then(user => {
      return res.json(user.questions);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/current', (req, res) => {

  const userId = req.user.id;
  let correctAnswer = '';
  let answeredCorrectly = false;
  let addingMasteredWord = '';
  let allMasteredWords = [];
  let attemptsForTheCurrentWord = 0;
  let numberOfCorrectGuessesForCurrentWord = 0;
  let currentWord = '';
  let response = '';

  User.findOne({
      _id: userId
    })
    .then(user => {

      user.questions[user.head].attempts = user.questions[user.head].attempts + 1;
      user.questions.set(0, user.questions[user.head]);

      currentWord = user.questions[user.head];
      response = `Sorry. The correct answer is: ${correctAnswer}`

      if (user.questions[user.head].answer === req.body.answer) {
        correctAnswer = user.questions[user.head].answer;
        answeredCorrectly = true;
        user.questions[user.head].score = user.questions[user.head].score + 1;
        user.questions.set(0, user.questions[user.head]);
      }
      else {
       return response
      }


      if (user.questions[user.head].m + 1 === user.questions.length || user.questions[user.head].m + 1 === user.questions.length - 1 && user.questions[user.head].answer === req.body.answer) {
        let index = user.questions.indexOf(undefined);
        addingMasteredWord = user.questions[user.head].text;

        user.masteredWords.push(addingMasteredWord);

        user.questions.shift();

        let length = user.questions.length;

        let adjustedArray = user.questions.map(question => {

          if (question.next > length + 3) {
            question.next = question.next - 2;
          }
          question.next = question.next - 1;
          if (question.m >= length / 2 && question.m > 1) {
            question.m = question.m - 1;
          }
          return question;
        });
        user.questions = adjustedArray
      }

      const tempObj1 = user.questions[user.head];
      const current = user.questions[user.head];

      if (correctAnswer === req.body.answer && user.questions[user.head].m + 1 !== user.questions.length && user.questions[user.head].m + 2 !== user.questions.length) {

        current.m = current.m * 2;

        tempObj1.m * 2;
        tempObj1.next += tempObj1.m;
        for (let i = 1; i <= current.m; i++) {

          if (i < user.questions.length) {
            user.questions[i].next = user.questions[i].next - 1;
            user.questions.set(user.questions[i].next - 1, user.questions[i])
          }
        }
        user.questions.set(tempObj1.m, tempObj1);
      } else {
        user.questions[0].m = 1;
        correctAnswer = "incorrect";

      };

      allMasteredWords = user.masteredWords;
      numberOfCorrectGuessesForCurrentWord = user.questions[0].score;
      attemptsForTheCurrentWord = user.questions[0].attempts;
      return user.save();

    })
    .then(() => res.json({
      currentWord,
      answeredCorrectly,
      correctAnswer,
      allMasteredWords,
      attemptsForTheCurrentWord,
      numberOfCorrectGuessesForCurrentWord
    }))
})

module.exports = router;