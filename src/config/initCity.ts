import axios from "axios";
import chalk from "chalk";
import * as XLSX from "xlsx";
import { ICity } from "../interfaces/city.interface.ts";
import CityModel from "../models/MongoDB/city.model.ts";

const initCity = async (
  options: { forceUpdateData: boolean } = { forceUpdateData: false }
): Promise<Error | string> => {
  try {
    const existingCitys = await CityModel.find();

    if (options.forceUpdateData === false && existingCitys.length > 0) {
      console.log(chalk.green("Data is not empty, skipping initialization."));
      return;
    }

    console.log(chalk.yellow("Downloading Excel file..."));
    const urlInstat =
      "https://www.istat.it/wp-content/uploads/2024/09/Elenco-comuni-italiani.xlsx";

    const response = await axios({
      method: "get",
      url: urlInstat,
      responseType: "arraybuffer"
    });

    console.log(chalk.yellow("Parsing Excel file..."));
    const workbook = XLSX.read(response.data, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cities: Partial<ICity>[] = jsonData.map((row: any) => ({
      istatCode: row["Codice Comune formato alfanumerico"],
      region: row["Denominazione Regione"],
      name: row["Denominazione in italiano"],
      province:
        row[
          // eslint-disable-next-line max-len
          "Denominazione dell'Unità territoriale sovracomunale \r\n(valida a fini statistici)"
        ]
    }));

    console.log(chalk.green(`Processed ${cities.length} cities`));

    // ✅ Chiamata SPARQL a Wikidata
    console.log(chalk.yellow("Fetching coordinates from Wikidata..."));
    const sparqlQuery = `
      SELECT ?istat ?coordinate
      WHERE {
        ?item p:P31/ps:P31/wdt:P279* wd:Q747074.
        OPTIONAL { ?item wdt:P635 ?istat. }
        OPTIONAL { ?item wdt:P625 ?coordinate. }
        
      }
`;
    const sparqlUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}&format=json`;
    const sparqlResponse = await axios.get(sparqlUrl, {
      headers: {
        "User-Agent": "NodeJS-App",
        Accept: "application/json"
      }
    });

    const results = sparqlResponse.data.results.bindings;

    const wikidataMap = new Map<
      string,
      { latitude?: number; longitude?: number }
    >();

    for (const r of results) {
      const istat = r.istat?.value;
      let latitude, longitude;

      if (r.coordinate?.value) {
        const coords = r.coordinate.value
          .replace("Point(", "")
          .replace(")", "")
          .split(" ");
        longitude = parseFloat(coords[0]);
        latitude = parseFloat(coords[1]);
      }

      if (istat) {
        wikidataMap.set(istat, { latitude, longitude });
      }
    }
    cities = cities.map((city) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const extra = wikidataMap.get(city.istatCode!);
      return extra ? { ...city, ...extra } : city;
    });

    console.log(chalk.green("Dati arricchiti con Wikidata"));
    console.log(
      chalk.yellow(
        "Cities without coordinates:",
        cities.filter((x) => !x.latitude || !x.longitude)
      )
    );
    await CityModel.deleteMany({});
    console.log(chalk.yellow("Old data cleared. Inserting new data..."));
    await CityModel.insertMany(cities);
    console.log(chalk.green("Inserted", cities.length, "cities"));
    return "City data initialized successfully.";
  } catch (error) {
    console.error(chalk.red("Error processing mock data:", error));
    return error as Error;
  }
};

export default initCity;
