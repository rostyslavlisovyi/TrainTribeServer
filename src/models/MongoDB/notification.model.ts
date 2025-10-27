import mongoose, { Model, Schema } from "mongoose";
import { INotification } from "../../interfaces/index.js";
import { NotificationEnum } from "./../../types/enums.js";

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    triggeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(NotificationEnum),
      required: true
    },
    data: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: true
  }
);

// Index per contare velocemente notifiche non lette per utente
NotificationSchema.index({ user: 1, read: 1 });

// Index per ordinamento cronologico
NotificationSchema.index({ user: 1, createdAt: -1 });

const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
