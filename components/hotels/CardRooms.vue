<script setup lang="ts">
import { useFormatCurrency } from '../../composables/useFormatCurrency';
import { useSearchStore } from '../../stores/SearchStore';
import { IHotels } from './../../types/Hotels';
const searchStore = useSearchStore();
const hotels: IHotels[] = searchStore.hotels;
const props = defineProps({
  hotelIndex: {
    type: Number,
    default: 0,
  },
  roomIndex: {
    type: Number,
    default: 0,
  },
});

function handleRoom() {
  console.log(
    'OBJETO QUARTO',
    JSON.stringify(hotels[props.hotelIndex].rooms[props.roomIndex])
  );
}
</script>

<template>
  <section class="wrapper-container-room">
    <div class="flex-1">
      <div class="container-title-room">
        <Icon
          name="material-symbols:verified-rounded"
          color="#00b9ff"
          size="1.5rem"
        />
        {{ hotels[props.hotelIndex].rooms[props.roomIndex].description }}
      </div>
      <div class="container-infos-room">
        <div
          class="container-items-rooms"
          v-if="
            hotels[props.hotelIndex].rooms[props.roomIndex].avaibleRoomsQtd > 5
          "
        >
          <Icon name="ph:bed" size="1rem" color="#4B5563" /><span
            >{{
              hotels[props.hotelIndex].rooms[props.roomIndex].avaibleRoomsQtd
            }}
            Quartos disponíveis</span
          >
        </div>
        <div class="container-items-rooms">
          <Icon
            name="streamline:food-drinks-tea-cup-herbal-cook-tea-tisane-cup-drink-cooking-nutrition-mug-food"
            size="0.9rem"
            color="#4B5563"
          /><span
            v-if="
              !hotels[props.hotelIndex].rooms[props.roomIndex].breakfastIncluded
            "
            >Café da Manhã Não Incluído</span
          >
          <span v-else>Café da Manhã Incluído</span>
        </div>
        <div class="container-items-rooms">
          <Icon
            name="material-symbols:attach-money"
            size="1rem"
            color="#4B5563"
          /><span
            v-if="
              !hotels[props.hotelIndex].rooms[props.roomIndex].isNonRefundable
            "
            >Reembolsável</span
          >
          <span v-else>Não Reembolsável</span>
        </div>
        <div
          class="container-items-rooms"
          v-if="hotels[props.hotelIndex].rooms[props.roomIndex].prePayment"
        >
          <Icon
            name="bi:exclamation-diamond"
            size="1rem"
            color="#4B5563"
          /><span>Pagamento Imediato</span>
        </div>
        <div class="container-items-rooms">
          <div class="container-adult-kids-icons">
            <Icon name="mdi:account-tie" size="1.2rem" color="#4B5563" /><span
              >x 2</span
            >
          </div>
          <div class="container-adult-kids-icons">
            <Icon
              name="solar:user-hands-bold"
              size="0.9rem"
              color="#4B5563"
            /><span>x 2</span>
          </div>
        </div>
        <div
          class="bg-green-100 text-green-800 text-[10px] rounded-full px-3 w-fit"
        >
          Cancelmento Grátis
        </div>
        <div
          v-if="
            hotels[props.hotelIndex].rooms[props.roomIndex].avaibleRoomsQtd < 5
          "
          class="bg-red-100 text-red-800 text-[10px] rounded-full px-3 w-fit"
        >
          Ultimas Unidades
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="price">
        BRL
        {{
          useFormatCurrency(
            hotels[props.hotelIndex].rooms[props.roomIndex].price.total.Value
          )
        }}
      </div>
      <button type="submit" class="btn-secondary" @click="handleRoom">
        SELECIONAR QUARTO
      </button>
    </div>
  </section>
</template>
<style scoped>
.container-adult-kids-icons {
  @apply flex gap-1 items-center;
}
.container-items-rooms {
  @apply text-xs flex items-center gap-1;
}
.container-infos-room {
  @apply mt-2 flex flex-col gap-2;
}
.container-title-room {
  @apply text-sm font-bold;
}
.container-room {
  @apply font-bold text-xs bg-red-500 rounded-md text-white p-2 text-center;
}
.wrapper-container-room {
  @apply flex flex-col bg-white w-full rounded-lg p-4 h-80;
}
.price {
  @apply flex gap-1 items-center justify-center text-2xl font-bold;
}
.submit-enter {
  @apply flex justify-center items-center bg-blue-700 border border-blue-700 p-4 text-white rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}
.btn-secondary {
  @apply mt-4 w-full flex font-bold items-center justify-center gap-2 border border-blue-700 text-blue-700 p-2 bg-white rounded-md text-xs h-12 hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}
</style>
