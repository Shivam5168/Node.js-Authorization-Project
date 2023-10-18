const express = require('express');
const user = require('../models/user.model')
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
        user.findOne({email : email});
        res.render('login')
    }

    
});


module.exports = router;