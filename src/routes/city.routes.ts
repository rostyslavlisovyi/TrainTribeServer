import express, { Request, Router } from "express";
import { CityController } from "../controllers/index.js";

const cityRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<CityController>("cityController");
/**
 * @swagger
 * /city/list:
 *   post:
 *     summary: Get a list of cities with pagination and filtering
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageNum:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *               pageSize:
 *                 type: integer
 *                 description: Number of items per page
 *                 default: 10
 *               populate:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Fields to populate in the response
 *               name:
 *                 type: string
 *                 description: Filter cities by name
 *               province:
 *                 type: string
 *                 description: Filter cities by province
 *     responses:
 *       200:
 *         description: A paginated list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of cities
 *                     pageSize:
 *                       type: integer
 *                       description: Number of cities per page
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

cityRoute.post("/list", (req, res) => controller(req).list(req, res));

/**
 * @swagger
 * /city/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Fields to populate in the response
 *     responses:
 *       200:
 *         description: City details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
cityRoute.get("/:id", (req, res) => controller(req).get(req, res));

/**
 * @swagger
 * /city:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, name, latitude, longitude, province]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The numeric identifier of the city
 *               name:
 *                 type: string
 *                 description: The name of the city
 *               latitude:
 *                 type: number
 *                 description: The latitude coordinate of the city
 *               longitude:
 *                 type: number
 *                 description: The longitude coordinate of the city
 *               province:
 *                 type: string
 *                 description: The province where the city is located
 *               population:
 *                 type: integer
 *                 description: The population of the city
 *     responses:
 *       201:
 *         description: City created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
cityRoute.post("/", (req, res) => controller(req).create(req, res));

/**
 * @swagger
 * /city/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Fields to populate in the response
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the city
 *               latitude:
 *                 type: number
 *                 description: The latitude coordinate of the city
 *               longitude:
 *                 type: number
 *                 description: The longitude coordinate of the city
 *               province:
 *                 type: string
 *                 description: The province where the city is located
 *               population:
 *                 type: integer
 *                 description: The population of the city
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
cityRoute.put("/:id", (req, res) => controller(req).update(req, res));

/**
 * @swagger
 * /city/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *     responses:
 *       204:
 *         description: City deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
cityRoute.delete("/:id", (req, res) => controller(req).delete(req, res));

export default cityRoute;
