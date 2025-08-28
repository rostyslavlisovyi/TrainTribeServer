import { Document, HydratedDocument } from "mongoose";

export interface ICity extends Document {
  istatCode: string;
  region: string;
  province: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

export type CityDocument = HydratedDocument<ICity>;
