const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const  { ensureAuthentiated } = require('../config/auth');
const config = require('../config/forget.config');
const router = express.Router();

//Login page
router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/dashboard', (req, res) => 
    res.render('dashboard')
)

router.get('/forgetPassword', (req, res) => {
    res.render('forget');
})

//Register Page
router.get('/register', (req, res) => {
    res.render('register');
});


//Register Data to DB
router.post('/register', (req, res) => {

    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg : 'Please fill in all fields'})
    }

    else if(password != password2){
        errors.push({msg : 'Password do not match'});
    }

    else if(password.length < 3){
        errors.push({msg : 'Password Should be at least 3 Character'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        User.findOne({email : email})
         .then(user => {
            if(user){
                errors.push({msg : 'Email is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name, 
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then( user => {
                            req.flash('success_msg', 'You are now register and can login.');
                            res.redirect('/user/login')})
                        .catch(err => console.log(err));
                    })
                })
            }
         });
    }
});

//Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : 'dashboard',
        failureRedirect : '/user/login',
        failureFlash : true
    })(req, res, next);
});

//Forget Password Link
const sendResetPasswordMail = async (name, email, token, res) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // Use port 465 for SSL
        secure: true,
        auth: {
          user: config.email, // Replace with your email
          pass: config.password, // Use the App Password generated for your email
        },
      });
  
      const mailOptions = {
        from: config.email, // Replace with your email
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Hi ${name},</p><p>Please copy the link to reset your password: <a href="http://localhost:7000/api/forgetpassword?token=${token}">Reset Password</a></p>`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send({ success: false, msg: error.message });
        } else {
          console.log('Mail has been sent:', info.response);
          res.status(200).send({ success: true, msg: 'Email sent successfully' });
        }
      });
    } catch (error) {
      res.status(500).send({ success: false, msg: error.message });
    }
  };


//Forget Password
 router.post('/forgetPassword', (req, res) => {
    const {  email } = req.body;
    User.findOne({email : email})
    .then(user => {
        if(user){
            const randomStringValue = randomString.generate();
            User.updateOne({ email : email }, { $set : { token : randomStringValue }});
            console.log(randomStringValue);
        }
        else{
            res.render('forget', {message : "User email is incorrect."})
        }
    })
})

module.exports = router;