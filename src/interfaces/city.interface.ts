import { Document, HydratedDocument, ObjectId } from "mongoose";

export interface ICity extends Document<ObjectId> {
  istatCode: string;
  region: string;
  province: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

export type CityDocument = HydratedDocument<ICity>;
