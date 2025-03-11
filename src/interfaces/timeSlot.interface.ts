import { DaysOfTheWeekEnum, TimeSlotsEnum } from "types/enums.ts";

export interface ITimeSlot {
  day: DaysOfTheWeekEnum;
  startTime: TimeSlotsEnum;
  endTime: TimeSlotsEnum;
}
