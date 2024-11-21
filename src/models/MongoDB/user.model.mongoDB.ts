import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interfaces/user.interfaces";

const UserSchema: Schema = new Schema(
  {
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    sports: [{ type: Schema.Types.ObjectId, ref: "Sport", required: true }],
    password_hashed: { type: String, required: true },
    image_url: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    training_created: [{ type: Schema.Types.ObjectId, ref: "Training" }],
    training_join: [{ type: Schema.Types.ObjectId, ref: "Training" }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
