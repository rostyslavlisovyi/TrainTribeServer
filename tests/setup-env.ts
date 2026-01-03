process.env.FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID || "test-project";
process.env.FIREBASE_CLIENT_EMAIL =
  process.env.FIREBASE_CLIENT_EMAIL || "test@example.com";
process.env.FIREBASE_PRIVATE_KEY =
  process.env.FIREBASE_PRIVATE_KEY ||
  // eslint-disable-next-line max-len
  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKMwggSfAgEAAoIBAQDHVHBbXDjkcWsT\n2Fhk/Q2h8p97RcZK++QuHZcvGeRT/5a8qCiHdS/yatztpABXlnDiNIS051wQ7rds\nUFpR4Mkde/i54pD/du4CNlp39EXiqEcTdJ7wPNlLciLpCQsf4sC2126DBqSfYEA\n4gAVhGLpV8P6fFPHxfb9jDWhWofEG1l+7hEvRZq2mSyTw59dyMHEi9ZZodIOpNo9\n6yqz9XgzunD1zfja4uN4ZnH2DJV3FMXH27eg+n5vwu3niJ7BcVaaeVaQQgf12B7d\nfRHwDMDOvt9LYyHJOBVYSCwTzl8NJpyVJkjtzsgLOgTEMUqVt19pBPzK+BIViR+D\nnbMVtdxeAgMBAAECggEANh16V6VjhL5/twr/Pt1WqH8n+EMSTgu78yj4+dQVKId7\n4Y5gj7R+Vkla/azn3Mlivcay85MAe7i7isCWOVnIFYcceRy4wVSaKZUEf/ChgiO1z\nEu7TxLRzTJv8OLWJneCowbKRQhhLW09fEqh9Bq7NSeRcq3WgaxY6XZhKMQrnrYN7\nMFWQ8Sp/aHMoAN22FfchYSPPONgSQG8VuirW9mzFz9WZEsyIm6VpSfUp9cUS38TQ\nss46DqahipqH1+aYkTB/q27ORfTdq4YfcYa7XZjKNRuqpN9MGWT9Uu/eHOqAO3\n2FfghYTPPOOfTRG8WuirW9n0Fy9XZEszIm7VqTfV\n-----END PRIVATE KEY-----\n";
process.env.CRON_SECRET = process.env.CRON_SECRET || "test-secret";
process.env.APP_URL = process.env.APP_URL || "http://localhost:3000";
process.env.SENTRY_DSN =
  process.env.SENTRY_DSN || "https://example@sentry.io/1";
