import { Document, ObjectId, HydratedDocument } from "mongoose";
export interface ISport extends Document {
  name: string;
}
export interface ISportMongoDB extends ISport, Document {
  _id: ObjectId;
}

export type SportDocument = HydratedDocument<ISport>;
