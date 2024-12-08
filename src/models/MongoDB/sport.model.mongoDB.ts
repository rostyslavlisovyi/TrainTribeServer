import mongoose, { Schema, Model } from "mongoose";
import { ISportMongoDB } from "../../interfaces/sport.interfaces.js";

const SportSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

const SportModel: Model<ISportMongoDB> = mongoose.model<ISportMongoDB>(
  "Sport",
  SportSchema
);

export default SportModel;
