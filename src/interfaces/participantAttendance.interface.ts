import { IUser } from "./user.interface.ts";
export interface IParticipantAttendance {
  participant: IUser;
  attended: boolean;
}
