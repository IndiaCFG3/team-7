const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const Response = require('../models/studentresponse')
   const accountSid = 'AC62178b714e87388c73230191b64af411'
const authToken = '97e4fa38efe0e2f665f715288dd7b988'

const client = require('twilio')(accountSid, authToken);

const User = require('../models/user');


// Validation Schema
const teacherSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

    password: Joi.string().required(),

  confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
  sub1:Joi.string().required(),
  sub2:Joi.string().required()
});




// Authorization 
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Sorry, but you must be registered first!');
    res.redirect('/');
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'Sorry, but you are already logged in!');
    res.redirect('/');
  } else {
    return next();
  }
};

router.route('response')
 .post(isNotAuthenticated,(req,res)=>{
  // const ans1=A
  // const ans2=B
  // const ans3=C

  const response=['A','B','C']
  
})

router.route('/forms')
.get((req,res)=>{
  res.render('forms')
})
.post(async(req,res,next)=>{
  try{
    console.log(req.body.subject)
    message=`${req.body.subject}`
 

client.messages.create({

    to: '+917707901217',
    from: '+17348871176',
    body: 'Q1->3+3=?;Q2->3*4=?'

})

.then((message) => console.log(message.sid));
     req.flash('success', 'form submit Successfully');

  }catch(error){
    next(error);
  }
});

router.route('/whatsapp_form')
.get((req,res)=>{
  res.render('whatsapp_form')
})
.post(async(req,res,next)=>{
  try{
    console.log(req.body.subject)
     req.flash('success', 'form submit Successfully');

  }catch(error){
    next(error);
  }
});
router.route('/progressPage')
.get((req,res)=>{
  res.render('progressPage')
})


router.route('/qforms')
.get((req,res)=>{
  res.render('qforms')

})
.post(async(req,res,next)=>{
  try{
    // console.log(req.body.subject)
    message=`${req.body.subject}`
    console.log(message)

    console.log(req.body.answer)
  

client.messages.create({

    to: '+917707901217',
    from: '+12512999122',
    body: 'asdfghj'

})

.then((message) => console.log(message.sid));
     req.flash('success', 'form submit Successfully');

  }catch(error){
    next(error);
  }
});




router.route('/qwhatsapp_form')
.get(isNotAuthenticated,(req,res)=>{
  res.render('qwhatsapp_form')
})
.post(async(req,res,next)=>{
  try{
    console.log(req.body.subject)
          console.log(req.body.answer)

     req.flash('success', 'form submit Successfully');

  }catch(error){
    next(error);
  }
});




router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, teacherSchema);
      console.log(result)
      if (result.error) {
        req.flash('error', 'Data is not valid. Please try again.');
        res.redirect('/users/register');
        return;
      }

      // Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/register');
        return;
      }

      // Hash the password
      const hash = await User.hashPassword(result.value.password);


      // Save user to DB
      delete result.value.confirmationPassword;
      result.value.password = hash;

      const newUser = await new User(result.value); 
      console.log('newUser', newUser);
      await newUser.save();


      req.flash('success', 'Please check your email.');
      res.redirect('/users/login');
    } catch(error) {
      next(error);
    }
  });

router.route('/login')
  .get(isNotAuthenticated, (req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.route('/dashboard')
  .get(isAuthenticated, (req, res) => {
    res.render('dashboard', {
      username: req.user.username
    });
  });


router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out. Hope to see you soon!');
    res.redirect('/');
  });

module.exports = router;