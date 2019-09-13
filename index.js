const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(helmet());
app.use(cors());
//connect db
mongoose.connect(
process.env.DB_CONNECT, 
{ useNewUrlParser: true, useUnifiedTopology: true },
() => console.log('connect to db!'));

// import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//middleware
//app.use(express.json());

app.use('/uploads', express.static('public/uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// route middlerware
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running in port ${port}`)
})