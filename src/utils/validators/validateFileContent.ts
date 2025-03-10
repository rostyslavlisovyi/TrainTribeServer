import { fileTypeFromBuffer } from "file-type";

export const validateFileContent = async (
  fileBuffer: Buffer
): Promise<boolean> => {
  const fileType = await fileTypeFromBuffer(fileBuffer);
  return fileType ? fileType.mime.startsWith("image/") : false;
};
