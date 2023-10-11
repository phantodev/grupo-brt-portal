interface Address {
  city_id: number;
  street: string;
  street_add: string;
  district: string;
  zipcode: string;
  state_id: number;
  number: string;
  street_number: string;
}

interface Agency {
  estimate_sales: number;
  segment: number;
  cellphone: string;
  corporate_name: string;
  cpf_cnpj: string;
  privacy_policy_accept: boolean;
  site: string;
  name: string;
  phone: string;
}

interface User {
  cpf: string;
  password_confirmation: string;
  email_marketing_accept: boolean;
  email: string;
  password: string;
  how_did_you_meet: number;
  name: string;
}

interface Bank {
  account_digit: string;
  bank_id: number;
  client_name: string;
  account_number: string;
  account_type: string;
  agency: string;
  billing_email: string;
}

export interface IForm {
  address: Address;
  agency: Agency;
  user: User;
  bank: Bank;
}
