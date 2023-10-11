export interface Pax {
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  room: string;
}

interface Room {
  roomId: string;
  paxes: Pax[];
}

interface Hotel {
  hotelId: number;
  rooms: Room[];
}

export interface ListPaxes extends Array<Hotel> {}

export interface ISavePaxes {
  budgetId: number;
  hotels: Hotel[];
}
