import mongoose, { Model, Schema } from "mongoose";
import { ICity } from "../../interfaces/city.interface.ts";

const CitySchema: Schema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    province: { type: String },
    population: { type: Number }
  },
  {
    timestamps: true
  }
);

const CityModel: Model<ICity> = mongoose.model<ICity>("City", CitySchema);

export default CityModel;
