const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const { ensureAuthenticated } = require('../config/auth');
// All questions Route
router.get("/",ensureAuthenticated, async (req, res) => {

  try {
    const questions = await Question.find({})
   
    questions.forEach(question =>{
      
      question.answers.sort(() => Math.random() - 0.5);
    })
    
    
    res.render('questions/index', { data: questions ,user: req.user})
      
       
  } catch { res.redirect('/')}
});

// new question route
router.get("/new",ensureAuthenticated, (req, res) => {
  res.render("questions/new", { question: new Question() ,user: req.user});
});

// Create question route
router.post("/",ensureAuthenticated, async (req, res) => {

  const question = new Question({
    
    question: req.body.question,
    correct_answer: req.body.a,
    answers:[req.body.a,req.body.b,req.body.c,req.body.d]
    
  });
  try {
    await question.save()
    res.redirect(`/`)
    
  } catch {
    res.render('questions/new', {errorMessage: 'Error, make sure you fill all fields' })
  } 
});

module.exports = router;
