import express from "express";
import { Router } from "express";
import { GetSportById } from "../controllers/sport.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const sportRoute: Router = express.Router({ mergeParams: true });

// GER: Get all sports
/**
 * @swagger
 * /sports:
 *   get:
 *     summary: Get all sports
 *     tags:
 *       - Sports
 *     responses:
 *       200:
 *         description: A list of all sports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sport'
 *       404:
 *         description: No sports found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No sports found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                    type: string
 *                    example: Internal server error
 */
sportRoute.get("/", authenticate, GetSportById);

export default sportRoute;
