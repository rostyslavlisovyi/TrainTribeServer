import { CloudinaryService } from "../src/services/cloudinary.service.js";

jest.mock("cloudinary", () => ({
  v2: {
    utils: {
      api_sign_request: jest.fn((data, secret) => "test-signature")
    }
  }
}));

describe("CloudinaryService", () => {
  const service = new CloudinaryService();

  beforeEach(() => {
    process.env.CLOUDINARY_BASE_FOLDER_UPLOAD = "base";
    process.env.CLOUDINARY_API_SECRET = "secret";
    process.env.CLOUDINARY_API_KEY = "api-key";
    process.env.CLOUDINARY_CLOUD_NAME = "cloud-name";
    jest.clearAllMocks();
  });

  describe("getSignatureUpload", () => {
    it("returns signature with base folder only", async () => {
      const result = await service.getSignatureUpload();

      expect(result.signature).toBe("test-signature");
      expect(result.apiKey).toBe("api-key");
      expect(result.cloudName).toBe("cloud-name");
      expect(result.folder).toBe("base");
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("returns signature with subfolder", async () => {
      const result = await service.getSignatureUpload("avatars");

      expect(result.folder).toBe("base/avatars");
      expect(result.signature).toBe("test-signature");
    });
  });

  describe("getSignatureDelete", () => {
    it("returns signature for delete operation", async () => {
      const result = await service.getSignatureDelete("public-id-123");

      expect(result.signature).toBe("test-signature");
      expect(result.apiKey).toBe("api-key");
      expect(result.cloudName).toBe("cloud-name");
      expect(result.timestamp).toBeGreaterThan(0);
    });
  });
});

