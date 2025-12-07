import { asValue } from "awilix";
import { NextFunction, Request, Response } from "express";

export function authContainerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const auth = req.auth;
  try {
    req.container.register({
      auth: asValue(auth || null)
    });
  } catch (error) {
    console.error("❌ Error registering token:", error);
  }

  next();
}
