import { Document, HydratedDocument, ObjectId } from "mongoose";
import { IGeoLocation } from "./geoLocation.interface.js";

export interface ICity extends Document<ObjectId> {
  istatCode: string;
  region: string;
  province: string;
  name: string;
  location?: IGeoLocation;
}

export type CityDocument = HydratedDocument<ICity>;
