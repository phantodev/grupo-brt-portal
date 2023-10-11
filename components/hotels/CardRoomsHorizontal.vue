<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { IRooms } from '../../types/Hotels';
import { useFormatCurrency } from '../../composables/useFormatCurrency';
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
const toast = useToast();
const props = defineProps({
  idHotel: {
    type: Number,
    required: true,
  },
  nameHotel: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  adtQtd: {
    type: Number,
    required: true,
  },
  chdQtd: {
    type: Number,
    required: true,
  },
  recommended: {
    type: [Boolean, null] as any,
    default: null,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  breakfastIncluded: {
    type: Boolean,
    required: true,
  },
  prePayment: {
    type: Boolean,
    required: true,
  },
  avaibleRoomsQtd: {
    type: Number,
    required: true,
  },
  isNonRefundable: {
    type: Boolean,
    required: true,
  },
  price: {
    type: [Number, null] as any,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  selectedAllRooms: {
    type: Boolean,
    required: true,
    default: false,
  },
  rooms: {
    type: Array<IRooms>,
    required: true,
  },
});

function handleRoomInPinia() {
  const hotelIndex = searchStore.hotelSelectedWithRooms.findIndex((hotel) => hotel.id === props.idHotel);

  // Aqui verificamos se o total de Hotéis selecionado é 8, este foi o limite combinado com Wellington.
  // Se o hotel não existir na lista e o limite de 8 hotéis for atingido
  if (hotelIndex === -1 && searchStore.hotelSelectedWithRooms.length === 8) {
    toast.error('Você chegou ao limite de 8 hotéis por cotação!');
    const checkboxElement = document.getElementById(`checkbox-${props.id}`) as HTMLInputElement;

    if (checkboxElement) {
      checkboxElement.checked = false;
    }
    return;
  }

  const room = { id: props.id };

  if (hotelIndex >= 0) {
    const roomIndex = searchStore.hotelSelectedWithRooms[hotelIndex].rooms.findIndex((r) => r.id === props.id);

    if (roomIndex >= 0) {
      // Se o quarto já existir, remova-o
      searchStore.hotelSelectedWithRooms[hotelIndex].rooms.splice(roomIndex, 1);

      // Se não houver mais quartos no hotel, remova o hotel também
      if (searchStore.hotelSelectedWithRooms[hotelIndex].rooms.length === 0) {
        searchStore.hotelSelectedWithRooms.splice(hotelIndex, 1);
      }
    } else {
      // Se o quarto não existir, adicione-o
      searchStore.hotelSelectedWithRooms[hotelIndex].rooms.push(room);
    }
  } else {
    // Se o hotel não existir, adicione o hotel e o quarto
    searchStore.hotelSelectedWithRooms.push({
      id: props.idHotel,
      name: props.nameHotel,
      rooms: [room],
    });
  }
}
</script>
<template>
  <div class="flex-grow flex bg-white px-4 py-2 items-center rounded-md mb-2">
    <div class="flex flex-col rounded-lg flex-grow">
      <div class="text-sm font-bold flex items-start gap-1 mb-1">
        <Icon v-if="props.recommended" name="material-symbols:verified-rounded" color="#00b9ff" size="1.5rem" />{{
          props.description
        }}

        <div class="flex items-center">
          <Icon name="fa6-solid:child-reaching" size="1rem" color="#4B5563" v-for="person in props.adtQtd" />
          <Icon name="fa6-solid:child" size="0.9rem" color="#4B5563" v-for="child in props.chdQtd" />
        </div>
        <div class="text-red-600 font-bold" v-if="props.avaibleRoomsQtd < 5">ÚLTIMAS UNIDADES</div>
        <div class="flex items-center text-xs font-normal" v-if="props.avaibleRoomsQtd > 5">
          Qtd Disponível:
          <strong>
            <span class="text-lime-700 ml-1">
              {{ props.avaibleRoomsQtd }}
            </span>
          </strong>
        </div>
      </div>
      <div class="text-xs flex items-center gap-2">
        <div class="flex items-center gap-2">
          <Icon
            name="streamline:food-drinks-tea-cup-herbal-cook-tea-tisane-cup-drink-cooking-nutrition-mug-food"
            size="0.9rem"
            color="#114E8C"
          /><span v-if="props.breakfastIncluded">Com Café da Manhã</span>
          <span v-else>Sem Café da Manhã</span>
        </div>
        <div
          v-if="props.prePayment"
          class="flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full"
        >
          Pagamento Imediato
        </div>
        <div class="bg-red-100 text-red-600 px-4 py-[2px] rounded-full text-[10px]" v-if="props.isNonRefundable">
          Não Reembolsável
        </div>
        <div class="bg-lime-100 text-lime-600 px-4 py-[2px] rounded-full text-[10px]" v-else>Reembolsável</div>
      </div>
    </div>
    <div class="outline-none focus:outline-none flex items-center">
      <div class="flex gap-1 items-center justify-center text-lg font-bold mr-4">
        {{ props.currency }}
        {{ useFormatCurrency(props.price) }}
      </div>
      <input type="checkbox" :id="'checkbox-' + props.id" @click="handleRoomInPinia" />
    </div>
  </div>
</template>
<style scoped>
input[type='checkbox'] {
  width: 1.5rem !important;
  height: 1.5rem !important;
}
</style>
