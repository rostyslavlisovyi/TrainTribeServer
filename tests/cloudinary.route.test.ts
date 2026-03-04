import express, { Request } from "express";
import request from "supertest";
import { CloudinaryController } from "../src/controllers/cloudinary.controller.js";
import type { RequestContext } from "../src/context/requestContext.js";
import cloudinaryRoute from "../src/routes/cloudinary.route.js";

const createApp = () => {
  const cloudinaryService = {
    getSignatureUpload: jest.fn().mockResolvedValue({
      timestamp: Math.round(Date.now() / 1000),
      signature: "test-signature",
      apiKey: "api-key",
      cloudName: "cloud-name",
      folder: "base/avatars"
    }),
    getSignatureDelete: jest.fn().mockResolvedValue({
      timestamp: Math.round(Date.now() / 1000),
      signature: "test-signature",
      apiKey: "api-key",
      cloudName: "cloud-name"
    })
  };

  const controller = new CloudinaryController(cloudinaryService as never);

  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { context: RequestContext }).context = {
      auth: undefined,
      services: {} as never,
      controllers: {
        cloudinaryController: () => controller
      }
    } as RequestContext;
    next();
  });
  app.use("/cloudinary", cloudinaryRoute);

  return { app, cloudinaryService };
};

describe("Cloudinary routes", () => {
  it("returns signature for upload", async () => {
    const { app, cloudinaryService } = createApp();

    const response = await request(app)
      .post("/cloudinary/signature-upload")
      .send({ folder: "avatars" })
      .expect(200);

    expect(cloudinaryService.getSignatureUpload).toHaveBeenCalledTimes(1);
    expect(response.body.data.folder).toBe("base/avatars");
  });

  it("returns signature for delete", async () => {
    const { app, cloudinaryService } = createApp();

    const response = await request(app)
      .post("/cloudinary/signature-delete")
      .send({ publicId: "image-123" })
      .expect(200);

    expect(cloudinaryService.getSignatureDelete).toHaveBeenCalledTimes(1);
    expect(response.body.data.signature).toBe("test-signature");
  });
});
