const express = require('express');
const router = require('./routes/user')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//PASSPORT CONFIG
require('./config/passport')(passport)
//DB CONFIG
const db = require('./config/keys')

//CONNECT TO MONGO
mongoose.connect(`mongodb://${db.HOST}:${db.PORT}/${db.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB...");
  })
  .catch(err => {
    console.error("Connection error", err);
  });


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//BODYPARSER
app.use(express.urlencoded({ extended : false}));

//EXPRESS SESSION
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}))

//CONNECT FLASH
app.use(flash());

//GLOBAL VARS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})
//ROUTES
app.use('/user' , router);
app.use('/', require('./routes/welcome'));

//PORT
const PORT = process.env.PORT || 5000;

//CONNECT TO SERVER
app.listen(PORT, () => {
    console.log(`Server is Listening PORT ${PORT}`);
});