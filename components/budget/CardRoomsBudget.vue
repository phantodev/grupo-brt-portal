<script setup lang="ts">
import { IHotelToReserve } from '~/types/Bookings';
import { useFormatCurrency } from '../../composables/useFormatCurrency';
import { useBudgetStore } from '../../stores/BudgetStore';
const budgetStore = useBudgetStore();
const showPriceRoom = ref(true);

const props = defineProps({
  hotel: {
    type: Object,
    required: true,
  },
  room: {
    type: Object,
    required: true,
  },
});
const dataHotel: IHotelToReserve = {
  id: props.hotel.id,
  name: props.hotel.name,
  rooms: [
    {
      id: props.room.id,
      description: props.room.description,
    },
  ],
};
onMounted(() => {
  if (budgetStore.budgetSelectedInfos.pax_filled === 1) {
    showPriceRoom.value = false;
  }
});
</script>
<template>
  <div class="flex-grow flex bg-white px-4 py-2 items-center rounded-md mb-2">
    <div class="flex flex-col rounded-lg flex-grow">
      <div class="text-xs font-bold flex items-center gap-1 mb-1">
        <Icon v-if="props.room.recommended" name="material-symbols:verified-rounded" color="#00b9ff" size="1.2rem" />{{
          props.room.description
        }}

        <div class="flex items-end -mt-1">
          <Icon name="fa6-solid:child-reaching" size="0.9rem" color="#4B5563" v-for="person in props.room.adtQtd" />
          <Icon name="fa6-solid:child" size="0.8rem" color="#4B5563" v-for="child in props.room.chdQtd" />
        </div>
        <div
          class="text-red-600 font-bold"
          v-if="props.room.avaibleRoomsQtd < 5 && budgetStore.budgetSelectedInfos.status.name === 'created'"
        >
          ÚLTIMAS UNIDADES
        </div>
        <div
          class="flex items-center text-xs font-normal"
          v-if="props.room.avaibleRoomsQtd > 5 && budgetStore.budgetSelectedInfos.status.name === 'created'"
        >
          Qtd Disponível:
          <strong>
            <span class="text-lime-700 ml-1">
              {{ props.room.avaibleRoomsQtd }}
            </span>
          </strong>
        </div>
      </div>
      <div class="text-xs flex items-center gap-2">
        <div class="flex items-center gap-2 text-[10px]">
          <Icon
            name="streamline:food-drinks-tea-cup-herbal-cook-tea-tisane-cup-drink-cooking-nutrition-mug-food"
            size="0.8rem"
            color="#4B5563"
          /><span v-if="!props.room.breakfastIncluded">Sem Café da Manhã</span>
          <span v-else>Com Café da Manhã</span>
        </div>
        <div
          v-if="props.room.prePayment"
          class="flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-[10px]"
        >
          Pagamento Imediato
        </div>
        <div class="bg-red-100 text-red-600 px-4 py-[2px] rounded-full text-[10px]" v-if="props.room.isNonRefundable">
          Não Reembolsável
        </div>
        <div class="bg-lime-100 text-lime-600 px-4 py-[2px] rounded-full text-[10px]" v-else>Reembolsável</div>
      </div>
    </div>
    <div class="outline-none focus:outline-none flex items-center" v-if="showPriceRoom">
      <div class="price-container">
        {{ props.room.price.total.Currency }}
        {{ useFormatCurrency(props.room.price.total.Value) }}
      </div>
      <div class="container-add-remove">
        <button class="bg-blue-800 btn-action" @click="budgetStore.addHotelToReserve(dataHotel)">+</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.price-container {
  @apply flex gap-1 items-center justify-end text-base font-bold w-fit mr-2;
}
.number-person {
  @aply font-bold text-lg w-10 text-center;
}
.btn-action {
  @apply rounded-full h-6 w-6 flex justify-center items-center text-white font-bold;
}
.container-add-remove {
  @apply flex justify-end items-center gap-2;
}
.container-person-add {
  @apply flex mt-2;
}
</style>
