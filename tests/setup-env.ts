delete process.env.FIREBASE_PROJECT_ID;
delete process.env.FIREBASE_CLIENT_EMAIL;
delete process.env.FIREBASE_PRIVATE_KEY;

process.env.CRON_SECRET = process.env.CRON_SECRET || "test-secret";
process.env.APP_URL = process.env.APP_URL || "http://localhost:3000";
process.env.SENTRY_DSN =
  process.env.SENTRY_DSN || "https://example@sentry.io/1";
