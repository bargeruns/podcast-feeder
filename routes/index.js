const router = require('express')();


router.get('/parse', require('./parse.js'));

router.get('/', (req, res) => {
  res.send('hello from the index route!');
});


module.exports = router;
