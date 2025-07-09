import { ObjectId } from "mongoose";
export interface IParticipantAttendance {
  participant: ObjectId;
  attended: boolean;
}
