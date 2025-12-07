process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "test-project";
process.env.FIREBASE_CLIENT_EMAIL =
  process.env.FIREBASE_CLIENT_EMAIL || "test@example.com";
process.env.FIREBASE_PRIVATE_KEY =
  process.env.FIREBASE_PRIVATE_KEY ||
  "-----BEGIN PRIVATE KEY-----\\nTEST\\n-----END PRIVATE KEY-----\\n";
process.env.CRON_SECRET = process.env.CRON_SECRET || "test-secret";
process.env.APP_URL = process.env.APP_URL || "http://localhost:3000";
process.env.SENTRY_DSN = process.env.SENTRY_DSN || "https://example@sentry.io/1";
