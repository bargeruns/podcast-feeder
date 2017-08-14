const _ = require('lodash');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require('superagent');

const authData = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: process.env.AUDIENCE
};

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://bearguns.auth0.com/.well-known/jwks.json"
  }),
  audience: 'rss-parser',
  issuer: "https://bearguns.auth0.com/",
  algorithms: ['RS256']
});

function guard(req, res, next) {
  switch(req.path) {
  case '/api/parse': {
    const scope = 'read:feeds';
    if (!_.includes(req.user.scope, scope)) {
      return res.status(403).json({message: 'Forbidden'});
    }
    return next();
  }
  }
}

function getAccessToken(req, res, next) {
  request
    .post('https://bearguns.auth0.com/oauth/token')
    .send(authData)
    .end((err, res) => {
      if(req.body.access_token) {
        req.access_token = res.body.access_token;
        return next();
      }
      return res.status(401).json({message: 'Unauthorized'});
    });
}

module.exports = {
  jwtCheck,
  guard,
  getAccessToken
};
