import jwt, { JwtPayload } from "jsonwebtoken";
import * as process from "process";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";

export const generateToken = (
  payload: object,
  secret: string = JWT_SECRET,
  expiresIn: string = JWT_EXPIRATION
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const validateToken = (token: string): JwtPayload & {id:string} | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & {id:string};
  } catch (error) {
    console.error("Error validating token", error);
    return null;
  }
};

export const refreshTokens = (token: string): string | JwtPayload | null => {
  const decodedToken = validateToken(token);
  if (!decodedToken) {
    return null;
  }
  const { exp, iat, ...payload } = decodedToken as JwtPayload;
  return generateToken(payload);
};
