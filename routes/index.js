const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Question = require("../models/question");
const User= require("../models/user")

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    
    
  })
);

router.post("/dashboard", async (req, res)=>{

let correctAnswers=[];
let answers=Object.values(req.body)


try{
const getQuestions = await Question.find({});

getQuestions.forEach(answers=>{
correctAnswers.push(answers.correct_answer)})
let score = answers.filter(element => correctAnswers.includes(element)).length

const user = await User.findOne(req.user);
user.score.push(score)

await user.save();

res.redirect("/");

}catch { res.redirect('/questions')}

})






module.exports = router;


