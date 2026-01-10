export interface IGeocode {
  place_id: number;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  category: string;
  address?: IGeocodeAddress;
}

export interface IGeocodeAddress {
  house_number?: string;
  road?: string;
  residential?: string;
  neighbourhood?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}
