const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // working with form
const cors = require('cors'); // need to call other domain

// DB Config
require('./config/db');

const app = express();

const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable cors
app.use(cors());
app.use('/poll', poll);

const port = 3000;

//Start Server
app.listen(port, () => console.log(`Server start on port ${port}`));