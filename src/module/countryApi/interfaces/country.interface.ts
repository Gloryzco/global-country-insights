export interface NativeName {
    official: string;
    common: string;
  }
  
  export interface Currencies {
    name: string;
    symbol: string;
  }
  
  export interface Flags {
    png: string;
    svg: string;
    alt: string;
  }
  
  export interface CoatOfArms {
    png: string;
    svg: string;
  }
  
  export interface ICountry {
    commonName: string;
    officialName: string;
    nativeName: Record<string, NativeName>;
    cca2: string;
    cca3: string;
    region: string;
    subregion: string;
    languages: Record<string, string>;
    population: number;
    currencies: Currencies;
    capital: string[];
    latlng: [number, number];
    landlocked: boolean;
    borderingCountries: string[];
    area: number;
    flags: Flags;
    coatOfArms: CoatOfArms;
  }
  