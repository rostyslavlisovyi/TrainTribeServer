import { citysMock } from "../mock/citys.mock.ts";
import { AbruzzoCityMock } from "../mock/AbruzzoCityMock.ts";
import { BasilicataCityMock } from "../mock/BasilicataCityMock.ts";
import { CalabriaCityMock } from "../mock/CalabriaCityMock.ts";
import { CampaniaCityMock } from "../mock/CampaniaCityMock.ts";
import { EmiliaRomagnaCityMock } from "../mock/EmiliaRomagnaCityMock.ts";
import { FriuliVeneziaGiuliaCityMock } from "../mock/FriuliVeneziaGiuliaCityMock.ts";
import { LazioCityMock } from "../mock/LazioCityMock.ts";
import { LiguriaCityMock } from "../mock/LiguriaCityMock.ts";
import { LombardiaCityMock } from "../mock/LombardiaCityMock.ts";
import { MarcheCityMock } from "../mock/MarcheCityMock.ts";
import { MoliseCityMock } from "../mock/MoliseCityMock.ts";
import { PiemonteCityMock } from "../mock/PiemonteCityMock.ts";
import { PugliaCityMock } from "../mock/PugliaCityMock.ts";
import { SardegnaCityMock } from "../mock/SardegnaCityMock.ts";
import { SiciliaCityMock } from "../mock/SiciliaCityMock.ts";
import { ToscanaCityMock } from "../mock/ToscanaCityMock.ts";
import { TrentinoAltoAdigeCityMock } from "../mock/TrentinoAltoAdigeCityMock.ts";
import { UmbriaCityMock } from "../mock/UmbriaCityMock.ts";
import { ValleDAostaCityMock } from "../mock/ValleDAostaCityMock.ts";
import { VenetoCityMock } from "../mock/VenetoCityMock.ts";

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

    // await CityModel.insertMany(citysMock);
    await CityModel.insertMany(AbruzzoCityMock);
    await CityModel.insertMany(BasilicataCityMock);
    await CityModel.insertMany(CalabriaCityMock);
    await CityModel.insertMany(CampaniaCityMock);
    await CityModel.insertMany(EmiliaRomagnaCityMock);
    await CityModel.insertMany(FriuliVeneziaGiuliaCityMock);
    await CityModel.insertMany(LazioCityMock);
    await CityModel.insertMany(LiguriaCityMock);
    await CityModel.insertMany(LombardiaCityMock);
    await CityModel.insertMany(MarcheCityMock);
    await CityModel.insertMany(MoliseCityMock);
    await CityModel.insertMany(PiemonteCityMock);
    await CityModel.insertMany(PugliaCityMock);
    await CityModel.insertMany(SardegnaCityMock);
    await CityModel.insertMany(SiciliaCityMock);
    await CityModel.insertMany(ToscanaCityMock);
    await CityModel.insertMany(TrentinoAltoAdigeCityMock);
    await CityModel.insertMany(UmbriaCityMock);
    await CityModel.insertMany(ValleDAostaCityMock);
    await CityModel.insertMany(VenetoCityMock);
    console.log(chalk.green("Mock data inserted."));
  } catch (error) {
    console.error(chalk.red("Error inserting mock data", error));
    process.exit(1);
  }
};

export default syncMock;
