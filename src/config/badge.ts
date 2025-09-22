// NOTE: keep it updated with the FE app, has the same object

export const BADGE_REVIEW_THRESHOLDS: Record<number, number> = {
  1: 10, // 0 -> 1: up to 10 reviews
  2: 500, // 1 -> 2: 11-500 reviews
  3: 1000, // 2 -> 3: 501-1000 reviews
  4: 3000, // 3 -> 4: 1001-3000 reviews
  5: 10000 // 4 -> 5: 3001-10000 reviews
};

export const BADGE_TRAINING_THRESHOLDS: Record<number, number> = {
  1: 10, // 0 -> 1: 10 trainings
  2: 100, // 1 -> 2: 100 trainings
  3: 500, // 2 -> 3: 500 trainings
  4: 1000, // 3 -> 4: 1000 trainings
  5: 3000 // 4 -> 5: more than 3000 trainings
};
