import { NextFunction, Request, Response } from "express";

export function cronJobMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization || "";
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}
