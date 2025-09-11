import { body, ValidationChain } from "express-validator";
import {
  SportsEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../types/enums.js";

export const validateUserCreation: ValidationChain[] = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("EMAIL IS REQUIRED")
    .isEmail()
    .withMessage("EMAIL INVALID TYPE")
    .normalizeEmail(),

  body("authId")
    .exists({ checkFalsy: true })
    .withMessage("authId IS REQUIRED")
    .isString()
    .withMessage("authId INVALID TYPE"),

  body("firstName")
    .optional()
    .isString()
    .withMessage("FIRST NAME INVALID TYPE"),
  body("lastName").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image").optional().isObject().withMessage("IMAGE INVALID TYPE"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("DATE OF BIRTH INVALID TYPE"),
  body("city").optional().isMongoId().withMessage("CITY INVALID ID"),

  body("sports")
    .optional()
    .isArray()
    .withMessage("SPORTS MUST BE AN ARRAY")
    .custom((sports) =>
      sports.every((sport: string) =>
        Object.values(SportsEnum).includes(sport as SportsEnum)
      )
    )
    .withMessage("INVALID SPORT VALUE"),

  body("trainingLevel")
    .optional()
    .isIn(Object.values(TrainingLevelEnum))
    .withMessage("trainingLevel NOT ALLOWED"),

  body("trainingGoal")
    .optional()
    .isArray()
    .withMessage("trainingGoal MUST BE AN ARRAY")
    .custom((goals) =>
      goals.every((goal: string) =>
        Object.values(TrainingGoalEnum).includes(goal as TrainingGoalEnum)
      )
    )
    .withMessage("INVALID trainingGoal VALUE"),

  body("athleteBio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("athleteBio TOO LONG"),

  body("lastOnboardingStep")
    .optional()
    .isString()
    .withMessage("lastOnboardingStep INVALID TYPE"),
  body("hasCompletedOnboarding")
    .optional()
    .isBoolean()
    .withMessage("hasCompletedOnboarding MUST BE BOOLEAN"),
  body("privacySettings")
    .optional()
    .isBoolean()
    .withMessage("privacySettings MUST BE BOOLEAN")
];

export const validateUserUpdate: ValidationChain[] = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("EMAIL INVALID TYPE")
    .normalizeEmail(),
  body("authId").optional().isString().withMessage("authId INVALID TYPE"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("FIRST NAME INVALID TYPE"),
  body("lastName").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image").optional().isObject().withMessage("IMAGE INVALID TYPE"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("DATE OF BIRTH INVALID TYPE"),
  body("city").optional().isMongoId().withMessage("CITY INVALID ID"),

  body("sports")
    .optional()
    .isArray()
    .withMessage("SPORTS MUST BE AN ARRAY")
    .custom((sports) =>
      sports.every((sport: string) =>
        Object.values(SportsEnum).includes(sport as SportsEnum)
      )
    )
    .withMessage("INVALID SPORT VALUE"),

  body("trainingLevel")
    .optional()
    .isIn(Object.values(TrainingLevelEnum))
    .withMessage("trainingLevel NOT ALLOWED"),
  body("trainingGoal")
    .optional()
    .isArray()
    .withMessage("trainingGoal MUST BE AN ARRAY")
    .custom((goals) =>
      goals.every((goal: string) =>
        Object.values(TrainingGoalEnum).includes(goal as TrainingGoalEnum)
      )
    )
    .withMessage("INVALID trainingGoal VALUE"),

  body("athleteBio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("athleteBio TOO LONG"),

  body("lastOnboardingStep")
    .optional()
    .isString()
    .withMessage("lastOnboardingStep INVALID TYPE"),
  body("hasCompletedOnboarding")
    .optional()
    .isBoolean()
    .withMessage("hasCompletedOnboarding MUST BE BOOLEAN"),
  body("privacySettings")
    .optional()
    .isBoolean()
    .withMessage("privacySettings MUST BE BOOLEAN")
];
