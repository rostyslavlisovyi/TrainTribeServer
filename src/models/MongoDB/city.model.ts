import mongoose, { Model, Schema } from "mongoose";
import { ICity } from "../../interfaces/index.js";

const CitySchema: Schema = new Schema(
  {
    istatCode: { type: String, required: true, unique: true },
    province: { type: String },
    region: { type: String },
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  {
    timestamps: true
  }
);

const CityModel: Model<ICity> = mongoose.model<ICity>("City", CitySchema);

export default CityModel;
