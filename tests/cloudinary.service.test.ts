import { Writable } from "stream";
import { CloudinaryService } from "../src/services/cloudinary.service.js";

const uploadStreamMock = jest.fn();
const destroyMock = jest.fn();

jest.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload_stream: (...args: unknown[]) => uploadStreamMock(...args),
      destroy: (...args: unknown[]) => destroyMock(...args)
    }
  }
}));

const mockUploadStream = (result: unknown, error: Error | null = null) => {
  uploadStreamMock.mockImplementation((_options, callback) => {
    const stream = new Writable({
      write(_chunk, _encoding, done) {
        callback(error, result);
        done();
      }
    });
    return stream;
  });
};

describe("CloudinaryService", () => {
  const service = new CloudinaryService();
  const baseFile = {
    buffer: Buffer.from("file"),
    fieldname: "file",
    originalname: "file.png",
    encoding: "7bit",
    mimetype: "image/png",
    size: 4,
    destination: "",
    filename: "",
    path: ""
  } as Express.Multer.File;

  beforeEach(() => {
    process.env.CLOUDINARY_BASE_FOLDER_UPLOAD = "base";
    jest.clearAllMocks();
  });

  it("uploads a file with the correct folder", async () => {
    const expected = { secure_url: "https://cdn/test", public_id: "pid" };
    mockUploadStream(expected);

    const result = await service.upload(baseFile, "avatars");

    expect(result).toEqual(expected);
    expect(uploadStreamMock).toHaveBeenCalledTimes(1);
    const options = uploadStreamMock.mock.calls[0][0];
    expect(options.asset_folder).toBe("base/avatars");
  });

  it("rejects when Cloudinary returns an error", async () => {
    mockUploadStream(null, new Error("upload failed"));

    await expect(service.upload(baseFile, undefined)).rejects.toThrow(
      "upload failed"
    );
  });

  it("deletes an asset by public id", async () => {
    destroyMock.mockResolvedValue({ result: "ok" });

    const response = await service.delete("public-id");

    expect(destroyMock).toHaveBeenCalledWith("public-id");
    expect(response).toEqual({ result: "ok" });
  });
});
