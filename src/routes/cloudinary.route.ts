import express, { Router } from "express";
import container from "../container.js";
import { CloudinaryController } from "../controllers/index.js";
import { authenticate, upload } from "../middlewares/index.js";

const cloudinaryRoute: Router = express.Router();
const cloudinaryController = container.resolve<CloudinaryController>(
  "cloudinaryController"
);

/**
 * @swagger
 * /cloudinary/upload:
 *   post:
 *     summary: Upload an image file to Cloudinary
 *     tags: [Cloudinary]
 *     security:
 *       - bearerAuth: []
 *     description: Uploads an image file to Cloudinary. Only authenticated users can upload files.
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
 *         description: File uploaded successfully to Cloudinary
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
 *                     url:
 *                       type: string
 *                       description: Cloudinary URL of the uploaded file
 *                     public_id:
 *                       type: string
 *                       description: Cloudinary public ID of the uploaded file
 */
cloudinaryRoute.post(
  "/upload",
  authenticate,
  upload.single("file"),
  (req, res) => cloudinaryController.upload(req, res)
);

/**
 * @swagger
 * /cloudinary/{public_id}:
 *   delete:
 *     summary: Delete an image from Cloudinary
 *     tags: [Cloudinary]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes an image from Cloudinary using its public ID
 *     parameters:
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary public ID of the image to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FILE DELETED SUCCESSFULLY
 */
cloudinaryRoute.delete("/:public_id", authenticate, (req, res) =>
  cloudinaryController.delete(req, res)
);
export default cloudinaryRoute;
