import express, { Request, Router } from "express";

function getLeaderboardController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.leaderboardController;
}

const leaderboardRoutes: Router = express.Router();

/**
 * @swagger
 * /leaderboard/list:
 *   get:
 *     summary: Get the monthly leaderboard
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by first or last name
 *     responses:
 *       200:
 *         description: A list of users on the leaderboard for the current month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                       totalPoints:
 *                         type: number
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       image:
 *                         type: object
 *       500:
 *         description: Internal server error
 */
leaderboardRoutes.get("/list", (req, res) =>
  getLeaderboardController(req).getMonthlyLeaderboard(req, res)
);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLeaderboard:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the leaderboard entry.
 *         user:
 *           type: string
 *           description: Reference to the User who earned the points.
 *         points:
 *           type: number
 *           description: The number of points awarded in this entry.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the points entry was created.
 */

export default leaderboardRoutes;
