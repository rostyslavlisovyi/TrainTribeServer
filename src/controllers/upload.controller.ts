import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import multer from "multer";
import validateFileContent from "../utils/validateFileContent.js";
import path from "path";
import fs from "fs/promises";
export const UploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "NO FILE UPLOADED" });
      return;
    }
    const isValidateFileContent = await validateFileContent(req.file.buffer);
    if (!isValidateFileContent) {
      res.status(422).json({ message: "INVALID FILE CONTENT" });
      return;
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${req.file.fieldname}-${uniqueSuffix}${fileExtension}`;

    const filePath = path.join("uploads", fileName);
    await fs.writeFile(filePath, req.file.buffer);

    console.info(chalk.green(`File ${fileName} uploaded successfully`));
    res.status(200).json({
      message: "FILE UPLOADED SUCCESSFULLY",
      file: {
        filename: fileName,
        path: filePath,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    return;
  }
};

export const handleUploadError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ message: "FILE TOO LARGE" });
    } else {
      res.status(400).json({ message: error.message });
    }
  } else if (error instanceof Error) {
    res.status(400).json({ message: error.message });
  } else {
    next();
  }
};
