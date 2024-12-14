import express from "express";
import { Router } from "express";
import UploadFile from "../controllers/upload.controller.js";
import upload from "../middlewares/upload.middleware.js";

const uploadRoute: Router = express.Router({ mergeParams: true });

// POST: Upload file
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload file
 *     tags:
 *       - Upload
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
 *                   example: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 */
uploadRoute.post("/", upload.single("image"), UploadFile);

export default uploadRoute;
