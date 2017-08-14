const _ = require('lodash');
const router = require('express')();
const rss = require('rss-to-json');
const request = require('superagent');

const auth = require('../auth.js');

router.post('/', auth.getAccessToken, (req, res) => {
  request.get('/')
    .set('Authorization', `Bearer ${req.access_token}`)
    .end((err, data) => {
      if(_.get(data, 'status') === 403) {
        return res.status(403).json({message: 'Forbidden'});
      }

      return res.status(data.statusCode).json(data.body);
    });
});

router.get('/', auth.getAccessToken, (req, res) => {
  const feed = req.query.feedUrl;
  if (!feed) {
    return res.status(400).json({message: 'Missing required property: feedUrl'});
  }

  rss.load('http://themainloop.libsyn.com/rss', (err, response) => {
    if (err) {
      console.log(err.toString());
      return res.status(500).json({message: err.toString()});
    }

    return res.status(200).json(response);
  });
});

module.exports = router;
