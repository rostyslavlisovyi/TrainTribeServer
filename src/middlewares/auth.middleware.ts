import type { NextFunction, Request, RequestHandler, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { AuthResult, JWTPayload } from "express-oauth2-jwt-bearer";

import "../config/firebaseAdmin.js";

const extractBearerToken = (req: Request): string => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const match = authHeader.match(/^Bearer (.+)$/i);

  if (!match) {
    throw new Error("Invalid Authorization header format");
  }

  return match[1];
};

const buildAuthResult = (
  token: string,
  decodedToken: DecodedIdToken
): AuthResult => {
  const payload: JWTPayload = {
    ...decodedToken,
    sub: decodedToken.user_id ?? decodedToken.uid,
    aud: decodedToken.aud ?? decodedToken.firebase?.aud
  } as JWTPayload;

  return {
    header: {},
    payload,
    token
  };
};

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req);
    const decodedToken = await getAuth().verifyIdToken(token);

    req.auth = buildAuthResult(token, decodedToken);
    next();
  } catch (_error) {
    res.status(401).json({ message: "UNAUTHORIZED" });
  }
};
