import { sportsMock } from "../mocks/sports.mock.js";
import Sport from "../models/MongoDB/sport.model.mongoDB.js";
import chalk from "chalk";
const syncMock = async (): Promise<void> => {
  try {
    console.log(chalk.yellow("Checking if mock data..."));
    const existingSports = await Sport.find();

    if (existingSports.length === sportsMock.length) {
      console.log(chalk.green("Data is match, no need to insert mock data."));
      return;
    }

    console.warn(chalk.yellow("Data isn't match, inserting mock data..."));

    await Sport.deleteMany();

    console.info(chalk.yellow("Deleted all data."));

    await Sport.insertMany(sportsMock);
    console.log(chalk.green("Mock data inserted."));
  } catch (error) {
    console.error(chalk.red("Error inserting mock data", error));
    process.exit(1);
  }
};

export default syncMock;
