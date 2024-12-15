import express from "express";
import { Router } from "express";
import { UploadFile, handleUploadError } from "../controllers/upload.controller.js";
import upload from "../middlewares/upload.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

const uploadRoute: Router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded
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
 *                       example: image-123456789.jpg
 *                     path:
 *                       type: string
 *                       example: uploads/image-123456789.jpg
 *                     mimetype:
 *                       type: string
 *                       example: image/jpeg
 *                     size:
 *                       type: number
 *                       example: 204800
 *       400:
 *         description: Bad Request - File validation error or no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "NO FILE UPLOADED"
 *                     - "ONLY IMAGES ARE ALLOWED"
 *                   example: "NO FILE UPLOADED"
 *       413:
 *         description: Payload Too Large - File size exceeds the limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FILE TOO LARGE
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED ACCESS
 *       500:
 *         description: Internal Server Error - Unexpected error during upload
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

export default uploadRoute;
