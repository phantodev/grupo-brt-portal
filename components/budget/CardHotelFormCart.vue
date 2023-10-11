<script setup lang="ts">
import { onMounted } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
import { useBudgetStore } from '../../stores/BudgetStore';
const budgetStore = useBudgetStore();
import { usePaxStore } from '../../stores/PaxStore';
const paxStore = usePaxStore();
const totalPax = ref('');

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: Number,
    required: true,
  },
  hotelIndex: {
    type: Number,
    required: true,
  },
});

const hotels = budgetStore?.budgetSelectedInfos?.criteria?.hotels[0];
const adults = hotels?.pax[props.hotelIndex];
const children = hotels?.children[props.hotelIndex];
totalPax.value = (adults || 0) + (children || 0);
</script>
<template>
  <div id="card-hotel" class="bg-white rounded-md w-full flex p-4 flex-col mb-2">
    <div class="text-md font-bold flex justify-between items-center mb-2">
      <div>{{ props.name }} - {{ props.roomName }}</div>
      <div class="flex items-center gap-4 font-semibold">
        <button
          :disabled="paxStore.isLoading"
          @click="paxStore.savePaxes(budgetStore.budgetSelectedInfos.id)"
          :class="paxStore.isLoading ? 'text-lime-600' : 'text-blue-800'"
          class="text-xs flex justify-center items-center gap-2"
        >
          <Icon name="fluent:save-20-regular" size="1.2rem" color="#1E40AF" v-if="!paxStore.isLoading" />
          <img src="/assets/spinnerLime.svg" class="w-4" alt="" v-if="paxStore.isLoading" />
          {{ paxStore.isLoading ? 'Salvando...' : 'Salvar Hóspedes' }}
        </button>
        <div
          v-if="budgetStore.budgetSelectedInfos.pax_filled === 0"
          @click="budgetStore.removeHotelToReserve(hotelIndex)"
          class="text-xs flex justify-center items-center text-red-500 gap-2"
        >
          <Icon name="solar:trash-bin-minimalistic-outline" size="1.2rem" color="#ff0000" />
          Excluir Hotel
        </div>
      </div>
    </div>
    <div
      id="input-list"
      class="flex gap-2 mb-2 items-center pt-4"
      v-if="budgetStore?.budgetSelectedInfos?.criteria?.hotels[0].pax[hotelIndex] > 0"
      v-for="(adult, paxIndex) in totalPax"
    >
      <div class="text-xs font-bold"><Icon name="fa6-solid:child-reaching" size="1rem" color="#114E8C" /></div>
      <InputsPaxes :hotelIndex="hotelIndex" :paxIndex="paxIndex" :roomId="roomId" :hotelId="hotelId" />
    </div>
  </div>
</template>
