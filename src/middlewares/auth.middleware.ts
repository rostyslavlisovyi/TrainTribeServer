import { auth } from "express-oauth2-jwt-bearer";

export const authenticate = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_DOMAIN,
  tokenSigningAlg: "RS256"
});
