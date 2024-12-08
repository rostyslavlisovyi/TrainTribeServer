import { Document, HydratedDocument, ObjectId } from "mongoose";
export interface IUser extends Document {
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  sport?: ObjectId[];
  training_created?: ObjectId[];
  training_join?: ObjectId[];
}

// export interface IUserMongoDB extends IUser, Document {
//   _id: ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type UserDocument = HydratedDocument<IUser>;
