import { Document, HydratedDocument } from "mongoose";

export interface ICity extends Document {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  population: number;
}

export type CityDocument = HydratedDocument<ICity>;
