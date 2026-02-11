import { NextFunction, Request, Response } from "express";
import { buildRequestContext } from "../context/requestContext.js";

export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  req.context = buildRequestContext(req.auth);
  next();
}
