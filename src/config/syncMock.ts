import { citysMock } from "../mock/citys.mock.ts";
import CityModel from "../models/MongoDB/city.model.ts";
import chalk from "chalk";
const syncMock = async (): Promise<void> => {
  try {
    console.log(chalk.yellow("Checking if mock data..."));
    const existingCitys = await CityModel.find();

    if (existingCitys.length === citysMock.length) {
      console.log(chalk.green("Data is match, no need to insert mock data."));
      return;
    }

    console.warn(chalk.yellow("Data isn't match, inserting mock data..."));

    await CityModel.deleteMany();

    console.info(chalk.yellow("Deleted all data."));

    await CityModel.insertMany(citysMock);
    console.log(chalk.green("Mock data inserted."));
  } catch (error) {
    console.error(chalk.red("Error inserting mock data", error));
    process.exit(1);
  }
};

export default syncMock;
