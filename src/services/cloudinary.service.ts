import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { IFileUpload } from "../interfaces/index.ts";

export class CloudinaryService {
  async upload(
    file: Express.Multer.File,
    folder?: string
  ): Promise<IFileUpload> {
    try {
      return new Promise((resolve, reject) => {
        const baseFolder = process.env.CLOUDINARY_BASE_FOLDER_UPLOAD;
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            asset_folder: baseFolder + (folder ? `/${folder}` : ""),
            resource_type: "auto"
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        );

        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to upload image: ${errorMessage}`);
    }
  }

  async delete(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      throw new Error(`Failed to delete image: ${errorMessage}`);
    }
  }
}
