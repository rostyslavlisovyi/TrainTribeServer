import Sport from "../models/MongoDB/sport.model.mongoDB.js";
import { sports } from "../mocks/sports.js";

export const syncMock = async (): Promise<void> => {
  console.log("Checking if mock data...");

  const existingSports = await Sport.find();

  if (existingSports.length === sports.length) {
    console.log("Data is match, no need to insert mock data.");
    return;
  }
  console.log("Data isn't match, inserting mock data...");
  await Sport.deleteMany();
  console.log("Deleted all data.");
  for (const sport of sports) {
    await Sport.create(sport);
  }
  console.log("Mock data inserted.");
};
