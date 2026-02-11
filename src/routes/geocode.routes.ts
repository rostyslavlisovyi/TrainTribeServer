import express, { Request, Router } from "express";

function getGeocodeController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.geocodeController();
}

const geocodeRoutes: Router = express.Router();

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
geocodeRoutes.get("/search", (req, res) =>
  getGeocodeController(req).search(req, res)
);

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
geocodeRoutes.get("/reverse", (req, res) =>
  getGeocodeController(req).reverse(req, res)
);

export default geocodeRoutes;
