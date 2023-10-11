export interface IHotelToReserve {
  id: number;
  name: string;
  rooms: Room[];
}

export interface IRoom {
  id: number;
  description: string;
  pax: Pax[];
}

export interface IPax {
  name: string;
  cpf: string;
  email: string;
  gender: 'Masculino' | 'Feminino' | 'Não Informar';
  birthday: string;
}
