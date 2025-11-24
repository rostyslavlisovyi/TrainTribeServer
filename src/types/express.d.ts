import type { DecodedIdToken } from "firebase-admin/auth";
import { Request } from "express";

declare module "express" {
  export interface Request {
    validatedId?: string;
    auth?: DecodedIdToken;
  }
}
