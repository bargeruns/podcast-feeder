const router = require('express')();

router.get('/', (req, res) => {
  res.send('Hello from the parse route!');
});

module.exports = router;
