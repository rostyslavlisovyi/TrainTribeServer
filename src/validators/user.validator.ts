import { body, ValidationChain } from "express-validator";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingGoalEnum
} from "../types/enums.js";

export const validateUserCreation: ValidationChain[] = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("EMAIL IS REQUIRED")
    .isEmail()
    .withMessage("EMAIL INVALID TYPE")
    .normalizeEmail(),

  body("auth_id")
    .exists({ checkFalsy: true })
    .withMessage("AUTH_ID IS REQUIRED")
    .isString()
    .withMessage("AUTH_ID INVALID TYPE"),

  body("username").optional().isString().withMessage("USERNAME INVALID TYPE"),
  body("first_name")
    .optional()
    .isString()
    .withMessage("FIRST NAME INVALID TYPE"),
  body("last_name").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image_url").optional().isURL().withMessage("IMAGE_URL INVALID TYPE"),
  body("date_of_birth")
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

  body("training_level")
    .optional()
    .isIn(Object.values(TrainingLevelEnum))
    .withMessage("TRAINING_LEVEL NOT ALLOWED"),

  body("training_goal")
    .optional()
    .isArray()
    .withMessage("TRAINING_GOAL MUST BE AN ARRAY")
    .custom((goals) =>
      goals.every((goal: string) =>
        Object.values(TrainingGoalEnum).includes(goal as TrainingGoalEnum)
      )
    )
    .withMessage("INVALID TRAINING_GOAL VALUE"),

  body("completed_trainings")
    .optional()
    .isInt({ min: 0 })
    .withMessage("COMPLETED_TRAININGS MUST BE A NON-NEGATIVE INTEGER"),
  body("social_number")
    .optional()
    .isString()
    .withMessage("SOCIAL_NUMBER INVALID TYPE"),
  body("athlete_bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("ATHLETE_BIO TOO LONG"),

  body("training_created")
    .optional()
    .isArray()
    .withMessage("TRAINING_CREATED MUST BE AN ARRAY"),
  body("training_created.*")
    .isMongoId()
    .withMessage("TRAINING_CREATED INVALID ID"),
  body("training_join")
    .optional()
    .isArray()
    .withMessage("TRAINING_JOIN MUST BE AN ARRAY"),
  body("training_join.*").isMongoId().withMessage("TRAINING_JOIN INVALID ID"),

  body("last_onboarding_step")
    .optional()
    .isString()
    .withMessage("LAST_ONBOARDING_STEP INVALID TYPE"),
  body("has_completed_onboarding")
    .optional()
    .isBoolean()
    .withMessage("HAS_COMPLETED_ONBOARDING MUST BE BOOLEAN"),
  body("privacy_settings")
    .optional()
    .isBoolean()
    .withMessage("PRIVACY_SETTINGS MUST BE BOOLEAN")
];

export const validateUserUpdate: ValidationChain[] = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("EMAIL INVALID TYPE")
    .normalizeEmail(),
  body("auth_id").optional().isString().withMessage("AUTH_ID INVALID TYPE"),
  body("username").optional().isString().withMessage("USERNAME INVALID TYPE"),
  body("first_name")
    .optional()
    .isString()
    .withMessage("FIRST NAME INVALID TYPE"),
  body("last_name").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image_url").optional().isURL().withMessage("IMAGE_URL INVALID TYPE"),
  body("date_of_birth")
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

  body("training_level")
    .optional()
    .isIn(Object.values(TrainingLevelEnum))
    .withMessage("TRAINING_LEVEL NOT ALLOWED"),
  body("training_goal")
    .optional()
    .isArray()
    .withMessage("TRAINING_GOAL MUST BE AN ARRAY")
    .custom((goals) =>
      goals.every((goal: string) =>
        Object.values(TrainingGoalEnum).includes(goal as TrainingGoalEnum)
      )
    )
    .withMessage("INVALID TRAINING_GOAL VALUE"),

  body("completed_trainings")
    .optional()
    .isInt({ min: 0 })
    .withMessage("COMPLETED_TRAININGS MUST BE A NON-NEGATIVE INTEGER"),
  body("social_number")
    .optional()
    .isString()
    .withMessage("SOCIAL_NUMBER INVALID TYPE"),
  body("athlete_bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("ATHLETE_BIO TOO LONG"),

  body("training_created")
    .optional()
    .isArray()
    .withMessage("TRAINING_CREATED MUST BE AN ARRAY"),
  body("training_created.*")
    .isMongoId()
    .withMessage("TRAINING_CREATED INVALID ID"),
  body("training_join")
    .optional()
    .isArray()
    .withMessage("TRAINING_JOIN MUST BE AN ARRAY"),
  body("training_join.*").isMongoId().withMessage("TRAINING_JOIN INVALID ID"),

  body("last_onboarding_step")
    .optional()
    .isString()
    .withMessage("LAST_ONBOARDING_STEP INVALID TYPE"),
  body("has_completed_onboarding")
    .optional()
    .isBoolean()
    .withMessage("HAS_COMPLETED_ONBOARDING MUST BE BOOLEAN"),
  body("privacy_settings")
    .optional()
    .isBoolean()
    .withMessage("PRIVACY_SETTINGS MUST BE BOOLEAN")
];
