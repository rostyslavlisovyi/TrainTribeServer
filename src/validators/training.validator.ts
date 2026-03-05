import { body } from "express-validator";

const allowedFrequencies = ["daily", "weekly", "monthly"] as const;

type Frequency = (typeof allowedFrequencies)[number];

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

export const validateTrainingRecurrence = [
  body("isRecurring").optional().isBoolean().toBoolean(),
  body("recurrence").custom((value, { req }) => {
    const isRecurring = normalizeBoolean(req.body.isRecurring);
    if (!isRecurring) {
      return true;
    }

    if (!value || typeof value !== "object") {
      throw new Error("recurrence is required when training is recurring");
    }

    const frequency: Frequency = value.frequency ?? "weekly";
    if (!allowedFrequencies.includes(frequency)) {
      throw new Error("recurrence.frequency must be daily, weekly or monthly");
    }

    const interval = Number(value.interval ?? 1);
    if (!Number.isInteger(interval) || interval < 1) {
      throw new Error("recurrence.interval must be a positive integer");
    }

    if (frequency === "weekly" && value.daysOfWeek) {
      if (!Array.isArray(value.daysOfWeek)) {
        throw new Error("recurrence.daysOfWeek must be an array of numbers");
      }
      const invalidDay = value.daysOfWeek.some(
        (day: unknown) => !Number.isInteger(day) || day < 0 || day > 6
      );
      if (invalidDay) {
        throw new Error("recurrence.daysOfWeek must contain values between 0 and 6");
      }
    }

    if (frequency === "monthly" && value.dayOfMonth !== undefined) {
      const day = Number(value.dayOfMonth);
      if (!Number.isInteger(day) || day < 1 || day > 31) {
        throw new Error("recurrence.dayOfMonth must be between 1 and 31");
      }
    }

    if (!value.endDate) {
      throw new Error("recurrence.endDate is required for recurring trainings");
    }

    return true;
  })
];
