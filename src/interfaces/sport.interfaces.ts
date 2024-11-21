import { Document, ObjectId } from "mongoose";

export interface ISport extends Document {
  name: string;
}
export interface ISportMongoDB extends ISport, Document {
  _id: ObjectId;
}
