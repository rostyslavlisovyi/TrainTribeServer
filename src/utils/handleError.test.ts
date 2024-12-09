import handleError from "./handleError.ts";
import { Response } from "express";

describe("handleError", () => {
    it("should log the error and send a 500 response with the default message", () => {
        const mockError = new Error("Test error");

        // Mock the `Response` object
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Mock `console.error`
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        // Call the function
        handleError(mockRes, mockError);

        // Assertions
        expect(consoleSpy).toHaveBeenCalledWith(mockError);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "INTERNAL SERVER ERROR" });

        // Clean up mock
        consoleSpy.mockRestore();
    });

    it("should log the error and send a 500 response with a custom message", () => {
        const mockError = new Error("Another test error");
        const customMessage = "Custom error message";

        // Mock the `Response` object
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Mock `console.error`
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        // Call the function
        handleError(mockRes, mockError, customMessage);

        // Assertions
        expect(consoleSpy).toHaveBeenCalledWith(mockError);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: customMessage });

        // Clean up mock
        consoleSpy.mockRestore();
    });
});
