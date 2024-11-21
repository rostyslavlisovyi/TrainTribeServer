import mongoose, { Schema } from "mongoose";

import { ISport } from "../../interfaces/sport.interfaces";

const SportSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

const SportModel = mongoose.model<ISport>("Sport", SportSchema);

export default SportModel;
