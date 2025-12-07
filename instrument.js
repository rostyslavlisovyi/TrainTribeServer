// Initializes Sentry before any other modules are loaded (see src/index.ts).
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

dotenv.config();

const parseSampleRate = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const environment = process.env.NODE_ENV ?? "development";
const defaultTraceRate = environment === "production" ? 0.2 : 1;
const defaultProfileRate = environment === "production" ? 0.1 : 1;

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ??
    "https://90d5e93c1530d89dff3a687f6cc7d109@o4510277415796736.ingest.de.sentry.io/4510308645797968",
  environment,
  sendDefaultPii: true,
  integrations: [
    Sentry.expressIntegration(),
    Sentry.httpIntegration({ tracing: true }),
    Sentry.mongooseIntegration()
  ],
  tracesSampleRate: parseSampleRate(
    process.env.SENTRY_TRACES_SAMPLE_RATE,
    defaultTraceRate
  ),
  profilesSampleRate: parseSampleRate(
    process.env.SENTRY_PROFILES_SAMPLE_RATE,
    defaultProfileRate
  )
});
