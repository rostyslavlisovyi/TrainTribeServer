import express, { Request, Router } from "express";
import { GeocodeController } from "../controllers/index.js";

const geocodeRoutes: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<GeocodeController>("geocodeController");

/**
 * @swagger
 * /geocode/search:
 *   get:
 *     summary: Search for locations by address
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address to geocode
 *     responses:
 *       200:
 *         description: A list of geocoded locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Geocode'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
geocodeRoutes.get("/search", (req, res) => controller(req).search(req, res));

/**
 * @swagger
 * /geocode/reverse:
 *   get:
 *     summary: Get location details from coordinates
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: string
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: string
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Location details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Geocode'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
geocodeRoutes.get("/reverse", (req, res) => controller(req).reverse(req, res));

export default geocodeRoutes;
