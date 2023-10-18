const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')
const router = express.Router();

//Login page
router.get('/login', (req, res) => {
    res.render('login')
});


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
                        .then(res.redirect('/user/login'))
                        .catch(err => console.log(err));
                    })
                })
                
            }
         });
       
    }

    
});


module.exports = router;