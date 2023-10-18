const express = require('express');
const router = require('./routes/user')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');


const app = express();

//DB CONFIG
const db = require('./config/keys')

//CONNECT TO MONGO
mongoose
  .connect(`mongodb://${db.HOST}:${db.PORT}/${db.DB}`, {
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


//ROUTES
app.use('/user' , router);
app.use('/', require('./routes/welcome'));

//PORT
const PORT = process.env.PORT || 5000;

//CONNECT TO SERVER
app.listen(PORT, () => {
    console.log(`Server is Listening PORT ${PORT}`);
});