export interface Status {
  name: string;
  description: string;
}

export interface DataItem {
  id: number;
  client: string;
  user: string;
  consultant: string;
  status: Status;
  created_at: string;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiResponse {
  data: DataItem[];
  links: Links;
  meta: Meta;
}
