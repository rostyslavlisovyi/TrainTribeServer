import express from "express";
import { Router } from "express";
import { UploadFile, handleUploadError } from "../controllers/index.js";
import { upload } from "../middlewares/index.js";
import { authenticate } from "../middlewares/index.js";

const uploadRoute: Router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     description: Uploads an image file to the server. Only authenticated users can upload files.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (max 2MB, only image formats allowed)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FILE UPLOADED SUCCESSFULLY
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       description: Generated unique filename
 *                       example: image-1647853254123-123456789.jpg
 *                     path:
 *                       type: string
 *                       description: Path where the file is stored
 *                       example: uploads/image-1647853254123-123456789.jpg
 *                     mimetype:
 *                       type: string
 *                       description: MIME type of the file
 *                       example: image/jpeg
 *                     size:
 *                       type: integer
 *                       description: Size of the file in bytes
 *                       example: 102400
 *       400:
 *         description: Bad request, no file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: NO FILE UPLOADED
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       413:
 *         description: File too large (exceeds 2MB limit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FILE TOO LARGE
 *       422:
 *         description: Invalid file content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INVALID FILE CONTENT
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
uploadRoute.post(
  "/",
  authenticate,
  upload.single("image"),
  handleUploadError,
  UploadFile
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default uploadRoute;
