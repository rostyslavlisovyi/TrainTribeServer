import mongoose, { Model, Schema } from "mongoose";
import { ICity } from "../../interfaces/index.js";

const CitySchema: Schema = new Schema<ICity>(
  {
    istatCode: { type: String, required: true, unique: true },
    province: { type: String },
    region: { type: String },
    name: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

CitySchema.index({ location: "2dsphere" });

const CityModel: Model<ICity> = mongoose.model<ICity>("City", CitySchema);

export default CityModel;
