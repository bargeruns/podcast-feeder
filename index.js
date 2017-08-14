const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const request = require('superagent');

const auth = require('./auth.js');

require('dotenv');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



const PORT = process.env.port || 3030;

app.use(auth.jwtCheck);
app.use(auth.guard);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Missing or invalid token.'});
  }
});

app.use('/api', require(`${__dirname}/routes/index.js`));
app.use('/parse', require(`${__dirname}/routes/parse.js`));

app.listen(PORT, () => {
  console.log('App listening!');
});
