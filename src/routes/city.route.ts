import { Router } from "express";
import {
  getCityById,
  getCities,
  getCityByNames
} from "../controllers/city.controller.js";
import express from "express";

const userRoute: Router = express.Router();
// GET: Get all citys
/**
 * @swagger
 * /city:
 *   get:
 *     summary: Get all cities
 *     tags:
 *       - City
 *     responses:
 *       200:
 *         description: List of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
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
userRoute.get("/", getCities);

// GET: Get city by ID
/**
 * @swagger
 * /city/id:
 *   get:
 *     summary: Get city by ID
 *     tags:
 *       - City
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The city ID
 *         example: 67543795b67ad667d26e3bdc
 *     responses:
 *       200:
 *         description: City object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CITY ID IS REQUIRED
 *       404:
 *         description: City not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CITY NOT FOUND
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
userRoute.get("/id", getCityById);
// GET: Get city by name
/**
 * @swagger
 * /city/name:
 *   get:
 *     summary: Get city by name
 *     tags:
 *       - City
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The city name
 *         example: London
 *     responses:
 *       200:
 *         description: City object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CITY NAME IS REQUIRED
 *       404:
 *         description: City not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CITY NOT FOUND
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
userRoute.get("/name", getCityByNames);

export default userRoute;
