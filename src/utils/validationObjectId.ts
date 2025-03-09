import mongoose from "mongoose";

export const validationId = (id: string): {isValid:boolean; message?:string} => {
  if (!mongoose.isValidObjectId(id)) {
    return {
      isValid: false,
      message: "INVALID _id FORMAT"
    };
  }
  return { isValid: true };
};
