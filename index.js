const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv');
const app = express();

app.use('/', require(`${__dirname}/routes/index.js`));
app.use('/parse', require(`${__dirname}/routes/parse.js`));

app.listen(process.env.PORT || 3030, () => {
  console.log('App listening!');
});
