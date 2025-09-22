import mongoose, { Model, Schema } from "mongoose";
import { IComment } from "../../interfaces/index.js";

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const CommentModel: Model<IComment> = mongoose.model("Comment", CommentSchema);
export default CommentModel;
