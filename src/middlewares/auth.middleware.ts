import type { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

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

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractBearerToken(req);
    const decodedToken = await getAuth().verifyIdToken(token);

    req.auth = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "UNAUTHORIZED" });
  }
};
