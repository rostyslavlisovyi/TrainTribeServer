import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = path.extname(file.originalname); // Get file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only images are allowed!")); // Reject file
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB file size limit
    },
});

export default upload;
