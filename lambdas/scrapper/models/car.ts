export interface Car {
  description: string;
  make: string;
  model: string;
  version: string;
  makeUrl: string;
  modelUrl: string;
  versionUrl: string;
  makeModel: string;
  makeModelVersion: string;
  concatedVersionName: string;
  photo: string;
  photos: string[];
  co2Emissions: number;
  energyLabel: EnergyLabel;
  hpPower: number;
  kwPower: number;
  fuelType: FuelType;
  compoundedFuelType: FuelType;
  bodyStyle: string;
  bodyStyleDescription: string;
  transmissionType: TransmissionType;
  transmissionDescription: TransmissionDescription;
  consumerPrice: number;
  actionModelCode: string;
  tags: Tag[];
  licensePlate: string;
  firstRegistrationDate: string;
  lastKnownMileage: number;
  location: Location;
  occasionPrice: number;
  productionYear: number;
  offeredSince: string;
}

export enum FuelType {
  Diesel = 'Diesel',
  Hybride = 'Hybride',
  Petrol = 'Petrol',
}

export enum EnergyLabel {
  C = 'C',
  Cero = 'CERO',
  Eco = 'ECO',
}

export enum Location {
  Algete = 'Algete',
  SantaPerpetuaDeLaMogoda = 'Santa Perpetua de la Mogoda',
}

export enum Tag {
  TagNew = 'TAG_NEW',
  TagReserved = 'TAG_RESERVED',
}

export enum TransmissionDescription {
  Aut6 = 'AUT6',
  Aut7 = 'AUT7',
  Aut8 = 'AUT8',
  Aut9 = 'AUT9',
  Cvt = 'CVT',
  Man5 = 'MAN5',
  Man6 = 'MAN6',
}

export enum TransmissionType {
  Automatic = 'Automatic',
  Manual = 'Manual',
}
