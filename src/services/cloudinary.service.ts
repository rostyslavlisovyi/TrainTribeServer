import { v2 as cloudinary } from "cloudinary";

export class CloudinaryService {
  getSignatureUpload = async (
    folder?: string
  ): Promise<{
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  }> => {
    const baseFolder = process.env.CLOUDINARY_BASE_FOLDER_UPLOAD;
    const folderPath = baseFolder + (folder ? `/${folder}` : "");
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folderPath,
        transformation: "f_auto,q_auto,c_limit,w_1920"
      },
      process.env.CLOUDINARY_API_SECRET || ""
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY || "",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
      folder: folderPath
    };
  };

  getSignatureDelete = async (
    publicId: string
  ): Promise<{
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
  }> => {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: publicId
      },
      process.env.CLOUDINARY_API_SECRET || ""
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY || "",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || ""
    };
  };
}
