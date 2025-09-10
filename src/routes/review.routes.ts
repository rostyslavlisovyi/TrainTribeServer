import express, { Router } from "express";
import container from "../container.js";
import { ReviewController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

const reviewRoutes: Router = express.Router({ mergeParams: true });

const reviewController =
  container.resolve<ReviewController>("reviewController");

reviewRoutes.post("/list", authenticate, (req, res) =>
  reviewController.list(req, res)
);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [training, reviewedUser, stars, comment]
 *             properties:
 *               training:
 *                 type: string
 *                 description: ID of the training being reviewed
 *               reviewedUser:
 *                 type: string
 *                 description: ID of the user being reviewed (usually training creator)
 *               stars:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Star rating (1-5)
 *               comment:
 *                 type: string
 *                 description: Text comment for the review
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Optional array of images
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
reviewRoutes.post("/", authenticate, (req, res) =>
  reviewController.create(req, res)
);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     description: Only the reviewer can update their own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stars:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated star rating
 *               comment:
 *                 type: string
 *                 description: Updated comment text
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Updated images array
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
reviewRoutes.put("/:id", authenticate, (req, res) =>
  reviewController.updateReview(req, res)
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Only the reviewer can delete their own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
reviewRoutes.delete("/:id", authenticate, (req, res) =>
  reviewController.deleteReview(req, res)
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - training
 *         - reviewer
 *         - reviewedUser
 *         - stars
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the review
 *         training:
 *           type: string
 *           description: ID of the training being reviewed
 *         reviewer:
 *           type: string
 *           description: ID of the user who wrote the review
 *         reviewedUser:
 *           type: string
 *           description: ID of the user being reviewed
 *         stars:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Star rating (1-5) given by the reviewer
 *         comment:
 *           type: string
 *           description: Text comment provided with the review
 *         images:
 *           type: array
 *           items:
 *             type: object
 *           description: Optional array of images attached to the review
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was last updated
 */

export default reviewRoutes;
