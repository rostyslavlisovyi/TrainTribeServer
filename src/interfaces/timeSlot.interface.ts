import { DaysOfTheWeekEnum, TimeSlotsEnum } from "../types/enums.js";

export interface ITimeSlot {
  day: DaysOfTheWeekEnum;
  startTime: TimeSlotsEnum;
  endTime: TimeSlotsEnum;
}
