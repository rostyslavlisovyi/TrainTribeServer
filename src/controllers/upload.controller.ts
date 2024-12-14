import { Request, Response } from "express";
import chalk from "chalk";
const UploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  console.info(chalk.green("File uploaded successfully"));
  res.status(200).json({ message: "File uploaded successfully" });
};

export default UploadFile;
