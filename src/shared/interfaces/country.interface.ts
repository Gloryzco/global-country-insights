export interface IName {
  common?: string;
  official?: string;
  nativeName: INativeName;
}

export interface INativeName {
  [key: string]: {
    official?: string;
    common?: string;
  };
}

export interface ICurrency {
  [key: string]: {
    name?: string;
    symbol?: string;
  };
}

export interface ILanguages {
  [key: string]: string;
}

export interface ITranslations {
  [key: string]: {
    official?: string;
    common?: string;
  };
}

export interface IDemonym {
  [key: string]: {
    female?: string;
    male?: string;
  };
}

export interface IMaps {
  googleMaps?: string;
  openStreetMaps?: string;
}

export interface IFlags {
  png?: string;
  svg?: string;
}

export interface ICapitalInfo {
  latlng?: [number, number];
}

export interface ICar {
  signs?: string[];
  side?: string;
}

export interface IIDD {
  root?: string;
  suffixes?: string[];
}

export interface ICoatOfArms {
  [key: string]: any;
}

export interface ICountry {
  name?: IName;
  tld?: string[];
  cca2?: string;
  ccn3?: string;
  cca3?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: ICurrency;
  idd?: IIDD;
  capital?: string[];
  altSpellings?: string[];
  region?: string;
  languages?: ILanguages;
  translations?: ITranslations;
  latlng?: [number, number];
  landlocked?: boolean;
  area?: number;
  demonyms?: IDemonym;
  flag?: string;
  maps?: IMaps;
  population?: number;
  car?: ICar;
  timezones?: string[];
  continents?: string[];
  flags?: IFlags;
  coatOfArms?: ICoatOfArms;
  startOfWeek?: string;
  capitalInfo?: ICapitalInfo;
}
