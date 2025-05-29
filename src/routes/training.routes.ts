import { Router } from "express";
import { TrainingController } from "../controllers/index.js";
import express from "express";
import container from "../container.js";

const trainingRoutes: Router = express.Router({ mergeParams: true });

const trainingController =
  container.resolve<TrainingController>("trainingController");

/**
 * @swagger
 * /training:
 *   get:
 *     summary: Get a list of all trainings
 *     tags: [Trainings]
 *     parameters:
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Fields to populate in the response (comma-separated)
 *     responses:
 *       200:
 *         description: A list of trainings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Training'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
trainingRoutes.post("/list", (req, res) => trainingController.list(req, res));

/**
 * @swagger
 * /training/{id}:
 *   get:
 *     summary: Get a training by ID
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Fields to populate in the response (comma-separated)
 *     responses:
 *       200:
 *         description: Training details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
trainingRoutes.get("/:id", (req, res) => trainingController.get(req, res));

/**
 * @swagger
 * /training:
 *   post:
 *     summary: Create a new training
 *     tags: [Trainings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date, address, latitude, longitude, sport, creator, difficultyLevel, duration]
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the training
 *               description:
 *                 type: string
 *                 description: Detailed description of the training
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the training
 *               address:
 *                 type: string
 *                 description: Physical address where the training takes place
 *               latitude:
 *                 type: string
 *                 description: Latitude coordinate of the training location
 *               longitude:
 *                 type: string
 *                 description: Longitude coordinate of the training location
 *               sport:
 *                 type: string
 *                 enum: [SWIMMING, CYCLING, RUNNING, WALKING, TRIATHLON]
 *                 description: Type of sport for the training
 *               creator:
 *                 type: string
 *                 description: ID of the user who created the training
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs who are participating in the training
 *               difficultyLevel:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *                 description: Difficulty level of the training
 *               duration:
 *                 type: number
 *                 description: Duration of the training in minutes
 *     responses:
 *       201:
 *         description: Training created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
trainingRoutes.post("/", (req, res) => trainingController.create(req, res));

/**
 * @swagger
 * /training/{id}:
 *   put:
 *     summary: Update a training by ID
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the training
 *               description:
 *                 type: string
 *                 description: Detailed description of the training
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the training
 *               address:
 *                 type: string
 *                 description: Physical address where the training takes place
 *               latitude:
 *                 type: string
 *                 description: Latitude coordinate of the training location
 *               longitude:
 *                 type: string
 *                 description: Longitude coordinate of the training location
 *               sport:
 *                 type: string
 *                 enum: [SWIMMING, CYCLING, RUNNING, WALKING, TRIATHLON]
 *                 description: Type of sport for the training
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs who are participating in the training
 *               difficultyLevel:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *                 description: Difficulty level of the training
 *               duration:
 *                 type: number
 *                 description: Duration of the training in minutes
 *     responses:
 *       200:
 *         description: Training updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
trainingRoutes.put("/:id", (req, res) => trainingController.update(req, res));

/**
 * @swagger
 * /training/{id}/like:
 *   post:
 *     summary: Add a like to a training
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID liking the training
 *     responses:
 *       200:
 *         description: Training returned with updated likes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 */
trainingRoutes.post("/:id/like", (req, res) =>
  trainingController.addLike(req, res)
);

/**
 * @swagger
 * /training/{id}/participants:
 *   post:
 *     summary: Add a participant to a training
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to add as participant
 *     responses:
 *       200:
 *         description: Training returned with added participant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 */
trainingRoutes.post("/:id/participants", (req, res) =>
  trainingController.addParticipant(req, res)
);

/**
 * @swagger
 * /training/{id}/likeremove:
 *   delete:
 *     summary: Remove a like from a training
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID removing the like
 *     responses:
 *       200:
 *         description: Training returned with likes removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 */
trainingRoutes.delete("/:id/likeremove", (req, res) =>
  trainingController.removeLike(req, res)
);

/**
 * @swagger
 * /training/{id}/participants/{userId}:
 *   delete:
 *     summary: Remove a participant from a training
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove from participants
 *     responses:
 *       200:
 *         description: Training returned with removed participant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 */
trainingRoutes.delete("/:id/participants/:userId", (req, res) =>
  trainingController.removeParticipant(req, res)
);

/**
 * @swagger
 * /training/{id}:
 *   delete:
 *     summary: Delete a training by ID
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Training deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Training deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
trainingRoutes.delete("/:id", (req, res) =>
  trainingController.delete(req, res)
);

trainingRoutes.post("/:id/comments", (req, res) =>
  trainingController.addComment(req, res)
);

/**
 * @swagger
 * /training/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 description: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
trainingRoutes.put("/comments/:commentId", (req, res) =>
  trainingController.updateComment(req, res)
);

/**
 * @swagger
 * /training/{id}/comments/{commentId}:
 *   delete:
 *     summary: Remove a comment from a training
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 */
trainingRoutes.delete("/:id/comments/:commentId", (req, res) =>
  trainingController.removeComment(req, res)
);

/**
 * @swagger
 * /training/{id}/status:
 *   patch:
 *     summary: Change training status
 *     description: Only the creator can change status. When status becomes 'completed', points are awarded to creator (5) and participants (1) if there's at least one participant.
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, status]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user (must be the creator)
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: New status for the training
 *     responses:
 *       200:
 *         description: Status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Training'
 *       400:
 *         description: Bad request or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Only the creator can change the status"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
trainingRoutes.patch("/:id/status", (req, res) =>
  trainingController.changeStatus(req, res)
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Training:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - address
 *         - latitude
 *         - longitude
 *         - sport
 *         - creator
 *         - difficultyLevel
 *         - duration
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the training
 *         title:
 *           type: string
 *           description: The title of the training
 *         description:
 *           type: string
 *           description: Detailed description of the training
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time of the training
 *         address:
 *           type: string
 *           description: Physical address where the training takes place
 *         latitude:
 *           type: string
 *           description: Latitude coordinate of the training location
 *         longitude:
 *           type: string
 *           description: Longitude coordinate of the training location
 *         sport:
 *           type: string
 *           enum: [SWIMMING, CYCLING, RUNNING, WALKING, TRIATHLON]
 *           description: Type of sport for the training
 *         creator:
 *           type: string
 *           description: ID of the user who created the training
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who are participating in the training
 *         difficultyLevel:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *           description: Difficulty level of the training
 *         duration:
 *           type: number
 *           description: Duration of the training in minutes
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the training
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of comment IDs linked to the training
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the training was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the training was last updated
 */

export default trainingRoutes;
