const { auth } = require("express-oauth2-jwt-bearer");

const authenticate = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256"
});

module.exports = authenticate;
