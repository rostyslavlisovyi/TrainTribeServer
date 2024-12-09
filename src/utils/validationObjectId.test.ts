import validationId from "../utils/validationObjectId.ts";
import mongoose from "mongoose";

describe("validationId function", () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("should return true for a valid ObjectId", () => {
        const validId = new mongoose.Types.ObjectId().toString();
        const result = validationId(validId, res);
        expect(result).toBe(true);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return false for an invalid ObjectId", () => {
        const invalidId = "invalidObjectId";
        const result = validationId(invalidId, res);
        expect(result).toBe(false);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "INVALID ID FORMAT" });
    });
});
