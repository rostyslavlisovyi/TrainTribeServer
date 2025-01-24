import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
export const validateUserData: ValidationChain[] = [
  body("email").optional().isEmail().withMessage("EMAIL INVALID TYPE"),
  body("username").optional().isString().withMessage("USERNAME INVALID TYP"),
  body("first_name")
    .optional()
    .isString()
    .withMessage("FIRST NAME INVALID TYPE"),
  body("last_name").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image_url").optional().isString().withMessage("IMAGE_URL INVALID TYP"),
  body("latitude").optional().isNumeric().withMessage("LATITUDE INVALID TYP"),
  body("longitude").optional().isNumeric().withMessage("LONGITUDE INVALID TYP"),
  body("sport").optional().isArray().withMessage("SPORT IS REQUIRED"),
  body("sport.*").isString().withMessage("SPORT INVALID TYPE"),
  body("sport")
    .optional()
    .isLength({ min: 1 })
    .withMessage("SPORT IS REQUIRED"),
  body("training_created")
    .optional()
    .isArray()
    .withMessage("TRAINING_CREATED IS REQUIRED"),
  body("training_created.*")
    .isString()
    .withMessage("TRAINING_CREATED INVALID TYPE"),
  body("training_join")
    .optional()
    .isArray()
    .withMessage("TRAINING_JOIN IS REQUIRED"),
  body("training_join.*").isString().withMessage("TRAINING_JOIN INVALID TYPE")
];
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
      message: "INVALID INPUTS TYPE"
    });
    return;
  }
  next();
};
