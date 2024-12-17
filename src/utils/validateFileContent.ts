import { fileTypeFromBuffer } from "file-type";

const validateFileContent = async (fileBuffer: Buffer): Promise<boolean> => {
  const fileType = await fileTypeFromBuffer(fileBuffer);
  return fileType ? fileType.mime.startsWith("image/") : false;
};

export default validateFileContent;
