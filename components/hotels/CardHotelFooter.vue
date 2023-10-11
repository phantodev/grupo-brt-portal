<script setup lang="ts">
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
const props = defineProps({
  idHotel: {
    type: Number,
    required: true,
  },
  nameHotel: {
    type: String,
    required: true,
  },
  roomsSelectedFromHotel: {
    type: Number,
    required: true,
  },
});
function removeHotelFromHotelSelectedWithRooms() {
  // Encontra o índice do hotel pelo id
  const index = searchStore.hotelSelectedWithRooms.findIndex(
    (hotel) => hotel.id === props.idHotel
  );

  // Remove o hotel do array se encontrado
  if (index > -1) {
    searchStore.hotelSelectedWithRooms.splice(index, 1);
  }
}
</script>
<template>
  <div class="flex justify-between bg-white items-center px-2 rounded-t-md">
    <div class="truncate w-full text-xs font-bold">
      <NuxtLink :to="`#hotel-${props.idHotel}`">
        {{ $props.nameHotel }}</NuxtLink
      >
    </div>
    <div class="cursor-pointer" @click="removeHotelFromHotelSelectedWithRooms">
      <Icon name="iconamoon:close-bold" size="1rem" color="#4B5563" />
    </div>
  </div>
  <div class="px-2 text-[10px] bg-white rounded-b-md pb-2">
    <strong> Quartos escolhidos: </strong> {{ props.roomsSelectedFromHotel }}
  </div>
</template>
