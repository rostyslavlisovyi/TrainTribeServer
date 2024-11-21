import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/jwt.utils";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decodedToken = validateToken(token);

    if (!decodedToken) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
