import { defineStore } from 'pinia';

export interface City {
  city: string;
}

export const useCityStore = defineStore('cityStore', {
  state: (): {
    cities: City[] | null;
    originCity: City | null;
    destinationCity: City | null;
  } => ({
    cities: [],
    originCity: null, // estado da cidade de origem
    destinationCity: null, // estado da cidade de destino
  }),
  actions: {
    async fetchCities() {
      const { data: cities } = await useFetch('https://back.brtoperadora.com.br/api/v1/destinations', {
        method: 'POST', // Especifique o método POST para enviar dados no corpo da requisição
        headers: {
          'Content-Type': 'application/json', // Defina o tipo de conteúdo como JSON
        },
        body: JSON.stringify({
          data: '',
          airports: false,
        }),
        transform(listCities: any): { city: string }[] {
          return listCities.data.map((item: any) => {
            return { city: item.city };
          });
        },
      });
      // NUNCA ESQUECER! Para acessar os valores do useFetch é apenas .value que é igual ao _rawValues
      this.cities = cities.value;
    },
  },
});
