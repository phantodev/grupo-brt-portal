interface Price {
  Currency: string;
  Value: number;
}

interface CancellationPolicy {
  StartDate: string;
  EndDate: string;
  date: string;
  Price: Price;
}

export interface ICancellationPolicies extends Array<CancellationPolicy> {}
