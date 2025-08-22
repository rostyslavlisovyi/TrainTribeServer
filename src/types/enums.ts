import { UploadApiResponse } from "cloudinary";

/* eslint-disable no-unused-vars */
export enum SportsEnum {
  SWIMMING = "SWIMMING",
  CYCLING = "CYCLING",
  RUNNING = "RUNNING",
  WALKING = "WALKING",
  TRIATHLON = "TRIATHLON",
  HYROX = "HYROX"
}

export enum TrainingLevelEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum TrainingGoalEnum {
  RACE = "RACE",
  LOSE_WEIGHT = "LOSE_WEIGHT",
  STAY_FIT = "STAY_FIT",
  HAVE_FUN = "HAVE_FUN",
  OTHER = "OTHER"
}

export enum TrainingFrequencyEnum {
  BEGINNER = "1_2_PER_WEEK",
  INTERMEDIATE = "3_4_PER_WEEK",
  ADVANCED = "5_PLUS_PER_WEEK"
}

export enum DaysOfTheWeekEnum {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export enum TimeSlotsEnum {
  T_06_00 = "06:00",
  T_06_30 = "06:30",
  T_07_00 = "07:00",
  T_07_30 = "07:30",
  T_08_00 = "08:00",
  T_08_30 = "08:30",
  T_09_00 = "09:00",
  T_09_30 = "09:30",
  T_10_00 = "10:00",
  T_10_30 = "10:30",
  T_11_00 = "11:00",
  T_11_30 = "11:30",
  T_12_00 = "12:00",
  T_12_30 = "12:30",
  T_13_00 = "13:00",
  T_13_30 = "13:30",
  T_14_00 = "14:00",
  T_14_30 = "14:30",
  T_15_00 = "15:00",
  T_15_30 = "15:30",
  T_16_00 = "16:00",
  T_16_30 = "16:30",
  T_17_00 = "17:00",
  T_17_30 = "17:30",
  T_18_00 = "18:00",
  T_18_30 = "18:30",
  T_19_00 = "19:00",
  T_19_30 = "19:30",
  T_20_00 = "20:00",
  T_20_30 = "20:30",
  T_21_00 = "21:00",
  T_21_30 = "21:30",
  T_22_00 = "22:00"
}

export enum LanguageEnum {
  IT = "it",
  EN = "en"
}

export enum TrainingStatusEnum {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export type FileUpload = UploadApiResponse;
/* eslint-enable no-unused-vars */
