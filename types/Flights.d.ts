export interface IRoom {
  adult: number;
  children: number;
}

export interface IFlights {
  value: number;
  currency: string;
  ADT: string;
  netFare: boolean;
  baggageAllowed: boolean;
  totalTaxas: number;
  total: number;
  container: IContainer[];
}
export interface IContainer {
  id: number;
  identificadorViagem: string;
  from: string;
  to: string;
  provider_id: string;
  company: string;
  companyProvider: string;
  companyName: string;
  companyLogo: string;
  negotiatedFareCode: null | string;
  roundTrip: boolean;
  marketingAirline: string;
  marketingAirlineName: string;
  totalPriceWithMarkup: number;
  totalPrice: number;
  currency: string;
  baggageAllowed: boolean;
  breakdowns: IBreakdown[];
  departure: IJourney[];
  return: IJourney[];
}

export interface IBreakdown {
  passenger: {
    type: string;
    quantity: number;
    ref: number;
  };
  baseFare: IFare;
  equivFare: IFare;
  totalFare: ITotalFare;
  taxes: ITax[];
}

export interface IFare {
  currency: string;
  value: number;
  valueWithMarkup: number;
}

export interface ITotalFare extends Fare {
  valuetax: number;
}

export interface ITax {
  amount: number;
  currency: string;
  quantity: number;
}

export interface IJourney {
  flightNumber: string;
  stopQuantity: number;
  duration: string;
  cabin: string;
  family: string;
  baggage: IBaggage;
  bookingCode: string;
  rph: number;
  etckt: null | string;
  comment: string;
  fareInfo: IFareInfo;
  departure: IFlightDetails;
  arrival: IFlightDetails;
}

export interface IBaggage {
  code: string;
  description: string;
  allowed: boolean;
  peso: number;
  unidade: string;
  quantity: number;
}

export interface IFareInfo {
  bookingCodeKeys: string;
  bookingCodeValues: string;
  bookingCodeValue: string;
}

export interface IFlightDetails {
  operatingAirline: string;
  operatingAirlineCode: string;
  marketingAirline: string;
  marketingAirlineCode: string;
  marketingAirlineName: string;
  equipment: string;
  date: string;
  time: string;
  locationCode: string;
  locationName: string;
}
