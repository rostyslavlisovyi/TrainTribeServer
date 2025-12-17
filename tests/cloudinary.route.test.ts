import express from "express";
import request from "supertest";
import type { AwilixContainer } from "awilix";
import cloudinaryRoute from "../src/routes/cloudinary.route.js";
import { CloudinaryController } from "../src/controllers/cloudinary.controller.js";

const createApp = () => {
  const cloudinaryService = {
    upload: jest.fn().mockResolvedValue({
      secure_url: "https://cdn.example.com/image.jpg",
      public_id: "public-id"
    }),
    delete: jest.fn().mockResolvedValue({ result: "ok" })
  };

  const controller = new CloudinaryController(cloudinaryService as never);

  const container = {
    resolve: () => controller
  } as unknown as AwilixContainer;

  const app = express();
  app.use((req, _res, next) => {
    (req as any).container = container;
    next();
  });
  app.use("/cloudinary", cloudinaryRoute);

  return { app, cloudinaryService };
};

describe("Cloudinary routes", () => {
  it("uploads a file and returns Cloudinary data", async () => {
    const { app, cloudinaryService } = createApp();

    const response = await request(app)
      .post("/cloudinary/upload")
      .field("folder", "avatars")
      .attach("file", Buffer.from("fake"), "file.png")
      .expect(200);

    expect(cloudinaryService.upload).toHaveBeenCalledTimes(1);
    expect(cloudinaryService.upload.mock.calls[0][1]).toBe("avatars");
    expect(response.body.data.public_id).toBe("public-id");
  });

  it("rejects upload without a file", async () => {
    const { app, cloudinaryService } = createApp();

    const response = await request(app)
      .post("/cloudinary/upload")
      .field("folder", "avatars")
      .expect(400);

    expect(response.body.message).toBe("NO FILE UPLOADED");
    expect(cloudinaryService.upload).not.toHaveBeenCalled();
  });

  it("deletes an asset by public id", async () => {
    const { app, cloudinaryService } = createApp();

    const response = await request(app)
      .delete("/cloudinary/image-123")
      .expect(200);

    expect(cloudinaryService.delete).toHaveBeenCalledWith("image-123");
    expect(response.body.data.result).toBe("ok");
  });
});
