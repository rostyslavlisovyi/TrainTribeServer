import type { Express } from "express";
import * as Sentry from "@sentry/node";

export type MiddlewareError = {
  output?: { statusCode?: number | string };
  status?: number | string;
  statusCode?: number | string;
  status_code?: number | string;
};

const shouldCaptureError = (error: MiddlewareError): boolean => {
  const statusCandidate =
    error?.status ??
    error?.statusCode ??
    error?.status_code ??
    error?.output?.statusCode;

  if (statusCandidate === undefined) {
    return true;
  }

  const statusNumber =
    typeof statusCandidate === "number"
      ? statusCandidate
      : Number(statusCandidate);

  if (Number.isNaN(statusNumber)) {
    return true;
  }

  return statusNumber >= 500;
};

export const registerSentryHandlers = (app: Express): void => {
  Sentry.setupExpressErrorHandler(app, {
    shouldHandleError: shouldCaptureError
  });
};
