import fetch from "node-fetch";
import { IGeocode } from "../interfaces/index.js";

export class GeocodeService {
  private baseUrl = "https://nominatim.openstreetmap.org";

  async geocode(search: string, language = "it") {
    const url =
      `${this.baseUrl}/search?` +
      `format=json&q=${encodeURIComponent(search)}&` +
      `addressdetails=1&accept-language=${language}&countrycodes=it`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrainTribe API Server",
        Referer: process.env.APP_URL || ""
      }
    });
    return (await response.json()) as IGeocode[];
  }

  async reverse(lat: string, lon: string, language = "it") {
    const url =
      `${this.baseUrl}/reverse?` +
      `format=json&lat=${lat}&lon=${lon}&` +
      `addressdetails=1&accept-language=${language}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrainTribe API Server",
        Referer: process.env.APP_URL || ""
      }
    });
    return (await response.json()) as IGeocode;
  }
}
