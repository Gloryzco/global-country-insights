import { CountryDto } from "./country.dto";

export class RegionResponseDto {
    name: string;
    countries: CountryDto[];
    totalPopulation: number;
  }