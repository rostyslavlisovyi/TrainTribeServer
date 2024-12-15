import { Router } from "express";
import {
  GetUserById,
  CreateUser,
  UpdateUser,
  DeleteUser
} from "../controllers/user.controller.js";
import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import {
  handleValidationErrors,
  validateUserData
} from "../middlewares/validation.middleware.js";

const userRoute: Router = express.Router();

// GET: Get user by ID
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The unique identifier of the user
 *                 example: 67543795b67ad667d26e3bdc
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID IS REQUIRED OR ONLY _ID FIELD IS ALLOWED
 *             examples:
 *               idRequired:
 *                 summary: ID is missing
 *                 value:
 *                   message: ID IS REQUIRED
 *               extraFields:
 *                 summary: Extra fields provided
 *                 value:
 *                   message: ONLY _ID FIELD IS ALLOWED
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER NOT FOUND
 *       422:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INVALID ID FORMAT
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL SERVER ERROR
 */
userRoute.get("/", authenticate, GetUserById);

// POST: Create new user
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - sport
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: test@test.com
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: testuser
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: Doe
 *               image_url:
 *                 type: string
 *                 description: The image URL
 *                 example: https://example.com/profile.jpg
 *               latitude:
 *                 type: number
 *                 description: The latitude of the user's location
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 description: The longitude of the user's location
 *                 example: -74.006
 *               sport:
 *                 type: array
 *                 description: The sports of the user
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the sport
 *                       example: 67543795b67ad667d26e3bdc
 *                     name:
 *                       type: string
 *                       description: The name of the sport
 *                       example: Football
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Includes missing fields or extra fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "ONLY ALLOWED FIELDS ARE ACCEPTED: email, username, first_name, last_name, image_url, latitude, longitude, sport"
 *                     - "EMAIL IS REQUIRED"
 *                   example: "ONLY ALLOWED FIELDS ARE ACCEPTED: email, username, first_name, last_name, image_url, latitude, longitude, sport"
 *             examples:
 *               extraFields:
 *                 summary: Extra fields provided in request body
 *                 value:
 *                   message: "ONLY ALLOWED FIELDS ARE ACCEPTED: email, username, first_name, last_name, image_url, latitude, longitude, sport"
 *               missingEmail:
 *                 summary: Missing required email field
 *                 value:
 *                   message: "EMAIL IS REQUIRED"
 *       409:
 *         description: Conflict - Duplicate user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER WITH THIS EMAIL ALREADY EXISTS
 *       422:
 *         description: Unprocessable Entity - Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INVALID INPUTS TYPE
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: The field with the validation error
 *                         example: email
 *                       message:
 *                         type: string
 *                         description: The validation error message
 *                         example: EMAIL INVALID TYPE
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL SERVER ERROR
 */
userRoute.post(
  "/",
  authenticate,
  validateUserData,
  handleValidationErrors,
  CreateUser
);
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The unique identifier of the user
 *                 example: 67543795b67ad667d26e3bdc
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: test@test.com
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: test_user
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: Doe
 *               image_url:
 *                 type: string
 *                 description: The image URL
 *                 example: https://example.com/profile.jpg
 *               latitude:
 *                 type: number
 *                 description: The latitude of the user's location
 *                 example: 37.7749
 *               longitude:
 *                 type: number
 *                 description: The longitude of the user's location
 *                 example: -122.4194
 *               sport:
 *                 type: array
 *                 description: The sports associated with the user
 *                 items:
 *                   type: string
 *                   example: 67543795b67ad667d26e3bdc
 *               training_created:
 *                 type: array
 *                 description: The trainings created by the user
 *                 items:
 *                   type: string
 *                   example: 67543795b67ad667d26e3bdc
 *               training_join:
 *                 type: array
 *                 description: The trainings joined by the user
 *                 items:
 *                   type: string
 *                   example: 67543795b67ad667d26e3bdc
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Includes missing `_id` or no fields for update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "ID IS REQUIRED"
 *                     - "NO FIELDS PROVIDED FOR UPDATE"
 *                   example: "ID IS REQUIRED"
 *             examples:
 *               missingId:
 *                 summary: ID is missing
 *                 value:
 *                   message: "ID IS REQUIRED"
 *               noFields:
 *                 summary: No fields provided for update
 *                 value:
 *                   message: "NO FIELDS PROVIDED FOR UPDATE"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER NOT FOUND
 *       422:
 *         description: Unprocessable Entity - Validation errors in request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "INVALID INPUTS TYPE"
 *                     - "UNPROCESSABLE ENTITY"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: The field with the validation error
 *                         example: email
 *                       message:
 *                         type: string
 *                         description: The validation error message
 *                         example: EMAIL INVALID TYPE
 *             examples:
 *               invalidFormData:
 *                 summary: Invalid form data
 *                 value:
 *                   message: "INVALID INPUTS TYPE"
 *                   errors:
 *                     - field: email
 *                       message: "EMAIL INVALID TYPE"
 *                     - field: latitude
 *                       message: "LATITUDE INVALID TYPE"
 *               invalidIdFormat:
 *                 summary: Invalid _id format
 *                 value:
 *                   message: "UNPROCESSABLE ENTITY"
 *                   errors:
 *                     - message: "INVALID ID FORMAT"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL SERVER ERROR
 */
userRoute.put(
  "/",
  authenticate,

  validateUserData,
  handleValidationErrors,
  UpdateUser
);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The unique identifier of the user to be deleted
 *                 example: 67543795b67ad667d26e3bdc
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER DELETED
 *       400:
 *         description: Bad Request - Includes missing `_id` or extra fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "ONLY _id IS ALLOWED"
 *                     - "ID IS REQUIRED"
 *                   example: "ONLY _id IS ALLOWED"
 *             examples:
 *               onlyIdAllowed:
 *                 summary: Only `_id` field is allowed
 *                 value:
 *                   message: "ONLY _id IS ALLOWED"
 *               missingId:
 *                 summary: ID is missing
 *                 value:
 *                   message: "ID IS REQUIRED"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER NOT FOUND
 *       422:
 *         description: Unprocessable Entity - Invalid `_id` format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: UNPROCESSABLE ENTITY
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: INVALID _id FORMAT
 *             examples:
 *               invalidIdFormat:
 *                 summary: Invalid `_id` format
 *                 value:
 *                   message: "UNPROCESSABLE ENTITY"
 *                   errors:
 *                     - message: "INVALID _id FORMAT"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL SERVER ERROR
 */
userRoute.delete("/", authenticate, DeleteUser);

export default userRoute;
