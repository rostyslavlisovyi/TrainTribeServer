import { Document, ObjectId } from "mongoose";
export interface IUser extends Document {
  email: string;
  password_hashed: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  sport?: ObjectId[];
  image_url?: string;
  latitude?: number;
  longitude?: number;
  training_created?: ObjectId[];
  training_join?: ObjectId[];
}

export interface IUserMongoDB extends IUser, Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
