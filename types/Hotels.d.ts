export interface IHotels {
  id: number;
  name: string;
  provider: string;
  address: string;
  city: number;
  type: string;
  description: string;
  recommended: boolean;
  category: number;
  mainImage: string;
  streetView: string | null;
  gmaps: string | null;
  images: string[];
  tripAdvisorUrl: string | null;
  tripAdvisor: string | null;
  bestPrice: {
    Currency: string;
    Value: number;
    TotalValueWithoutMarkup: number;
  };
  rooms: IRooms[];
}

export interface IRooms {
  specialOffer: string | null;
  recommended: boolean | null;
  id: string;
  avaibleRoomsQtd: number;
  rateType: string;
  avaliable?: true;
  description: string;
  isNonRefundable: boolean;
  breakfastIncluded: boolean;
  boardDescription: string;
  plans: IPlans[];
  breakdownSales: IBreakdowns;
  RPH: number;
  price: {
    perRoom: IPrice;
    total: IPrice;
    totalWithoutMarkup: IPrice;
  };
  prePayment: boolean;
  adtQtd: number;
  chdQtd: number;
  childrenAge: number[];
  qtd: number;
  commission: {
    currency: string;
    percent: number;
    value: number;
  };
}

export interface IPlans {
  name: string;
  id: string | null;
  code: string | null;
  currency: string | null;
  description: string | null;
  additionalDetailName: string;
  additionalDetail: string;
  cancelPenalty: {
    nonRefundable: boolean;
    name: string;
    description: string;
  };
  guarantee: {
    name: string;
    description: string;
  };
  paymentPolicies: {
    type: number;
  }[];
}

export interface IBreakdowns {
  plan: number;
  values: {
    currency: string;
    value: number;
    valueWithoutMarkup: number;
  }[];
  total: {
    currency: string;
    total: number;
    totalWithoutMarkup: number;
  };
}

export interface IPrice {
  Currency: string;
  Value: number;
}

export interface HotelCriteria {
  destination: string;
  dates: [string, string];
  rooms: number;
  pax: number[];
  children: number[];
  childrenAges: Record<string, any>;
  chd: number;
  inf: number;
}

export interface UserChoice {
  consultant: string;
  criteria: {
    hotels: HotelCriteria[];
    flights: any; // substitua 'any' pelo tipo correto, se conhecido
    services: any; // substitua 'any' pelo tipo correto, se conhecido
  };
  items: {
    hotel: any[]; // substitua 'any' pelo tipo correto, se conhecido
    flight: any[]; // substitua 'any' pelo tipo correto, se conhecido
    service: any[]; // substitua 'any' pelo tipo correto, se conhecido
  };
}
