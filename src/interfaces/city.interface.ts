import mongoose, { Document, HydratedDocument } from "mongoose";
import { IGeoLocation } from "./geoLocation.interface.js";

export interface ICity extends Document<mongoose.Types.ObjectId> {
  istatCode: string;
  region: string;
  province: string;
  name: string;
  location?: IGeoLocation;
}

export type CityDocument = HydratedDocument<ICity>;
