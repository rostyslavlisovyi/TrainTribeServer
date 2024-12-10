import { Router } from "express";
import {
  GetUserById,
  CreateUser,
  UpdateUser,
  DeleteUser
} from "../controllers/user.controller.js";
import express from "express";
import authenticate from "../middlewares/auth.middleware.js";

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
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
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
 *                 example: test@test
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: test
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: test
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: test
 *               image_url:
 *                 type: string
 *                 description: The image URL
 *                 example: https://test.com/test.jpg
 *               latitude:
 *                 type: number
 *                 description: The latitude of the user
 *                 example: 0
 *               longitude:
 *                 type: number
 *                 description: The longitude of the user
 *                 example: 0
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
 *                       example: test
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
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRoute.post("/", authenticate, CreateUser);

// PUT: Update user by ID
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
 *                 example: 5f7f5f4b7f6c8a2b3c8b4f7f
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: test@test
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: test
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: test
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: test
 *               image_url:
 *                 type: string
 *                 description: The image URL
 *                 example: https://test.com/test.jpg
 *               latitude:
 *                 type: number
 *                 description: The latitude of the user
 *                 example: 0
 *               longitude:
 *                 type: number
 *                 description: The longitude of the user
 *                 example: 0
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
 *                       example: test
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
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRoute.put("/", authenticate, UpdateUser);

// DELETE: Delete user by ID
/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user by ID
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
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRoute.delete("/", authenticate, DeleteUser);

export default userRoute;
