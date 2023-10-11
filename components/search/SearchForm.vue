<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSearchStore } from '../../stores/SearchStore';
import { useAuthStore } from '../../stores/AuthStore';
const searchStore = useSearchStore();
const authStore = useAuthStore();
const packegeDoubleHosting = ref(false);
const containerRoomsVisible = ref(false);
// Assim que o componente é montado, inicia o watch no estado rooms
watch(
  () => searchStore.criteria.rooms,
  (rooms) => {
    // Define a visibilidade do container-rooms com base no valor do estado rooms, precisamos converter o valor em Numero
    containerRoomsVisible.value = rooms !== 0 ? rooms > 0 : false;
  }
);
</script>
<template>
  <!-- Flights + Hosting -->
  <div
    class="container-hosting-buttons"
    v-if="
      authStore.productsReleased.flight && authStore.productsReleased.hostel
    "
  >
    <button
      class="hosting-buttons"
      :class="{ 'opacity-50': packegeDoubleHosting }"
      @click="packegeDoubleHosting = false"
    >
      <Icon name="ph:airplane-in-flight" size="1.2rem" color="#ffffff" /><span
        >Vôo +</span
      >
      <Icon name="ph:buildings" size="1.5rem" color="#ffffff" /><span
        >Hospedagem</span
      >
    </button>
    <button
      class="hosting-buttons"
      :class="{ 'opacity-50': !packegeDoubleHosting }"
      @click="packegeDoubleHosting = true"
    >
      <Icon name="ph:airplane-in-flight" size="1.2rem" color="#ffffff" /><span
        >Vôo +</span
      >
      <Icon name="ph:buildings" size="1.5rem" color="#ffffff" /><span
        >2 Hospedagens</span
      >
    </button>
  </div>

  <!-- Origin and Destiny Line -->
  <div class="container-origin-destiny">
    <div
      class="container-autocomplete z-[97]"
      v-if="
        authStore.productsReleased.flight && authStore.productsReleased.hostel
      "
    >
      <Autocomplete
        fieldType="origin"
        title="Origem"
        iconName="ph:airplane-takeoff-light"
      />
    </div>
    <div
      class="wrapper-change-icon z-[96]"
      v-if="
        authStore.productsReleased.flight && authStore.productsReleased.hostel
      "
    >
      <div class="container-change-icon lg:rotate-90">
        <div class="container-double-arrow">
          <DoubleArrowIcon color="#FFFFFF" />
        </div>
      </div>
      <span class="invert-destiny-mobile-text">Inverter Destinos</span>
    </div>
    <div class="container-autocomplete z-[95]">
      <Autocomplete
        fieldType="destination"
        title="Destino"
        iconName="ph:airplane-landing-light"
      />
    </div>
  </div>
  <!-- Where Hosting -->
  <div class="container-title-where-hosting" v-show="packegeDoubleHosting">
    <span class="title-where-hosting">Escolha onde se hospedar</span>
    <div class="emoji-bedroom">🛌</div>
  </div>
  <div class="container-where-hosting" v-show="packegeDoubleHosting">
    <div class="wrapper-container-input">
      <Autocomplete
        fieldType="origin"
        title="Primeiro Destino"
        iconName="ph:airplane-takeoff-light"
      />
      <div class="wrapper-checkinout">
        <div class="container-checkinout">
          <div class="container-label-input">
            <div class="label-input">Check-In</div>
            <div>
              <Icon
                name="material-symbols:date-range-outline"
                size="1.2rem"
                color="#114E8C"
              />
            </div>
          </div>
          <div class="container-input-with-emoji">
            <input class="input" type="text" placeholder="12/05/2010" />
          </div>
        </div>
        <div class="container-checkinout">
          <div class="container-label-input">
            <div class="label-input">Check-Out</div>
            <div>
              <Icon
                name="material-symbols:date-range-outline"
                size="1.2rem"
                color="#114E8C"
              />
            </div>
          </div>
          <div class="container-input-with-emoji">
            <input class="input" type="text" placeholder="12/05/2010" />
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper-container-input">
      <Autocomplete
        fieldType="origin"
        title="Segundo Destino"
        iconName="ph:airplane-takeoff-light"
      />
      <div class="wrapper-checkinout">
        <div class="container-checkinout">
          <div class="container-label-input">
            <div class="label-input">Check-In</div>
            <div>
              <Icon
                name="material-symbols:date-range-outline"
                size="1.2rem"
                color="#114E8C"
              />
            </div>
          </div>
          <div class="container-input-with-emoji">
            <input class="input" type="text" placeholder="12/05/2010" />
          </div>
        </div>
        <div class="container-checkinout">
          <div class="container-label-input">
            <div class="label-input">Check-Out</div>
            <div>
              <Icon
                name="material-symbols:date-range-outline"
                size="1.2rem"
                color="#114E8C"
              />
            </div>
          </div>
          <div class="container-input-with-emoji">
            <input class="input" type="text" placeholder="12/05/2010" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Date Range / Rooms / Lugage -->
  <div class="wrapper-data-baggage-rooms">
    <div class="container-data-baggage-rooms z-[94]">
      <DataPicker
        iconName="material-symbols:date-range-outline"
        placeholder="Escolha a data..."
        title="Data da Viagem"
      />
    </div>
    <div class="container-data-baggage-rooms z-[92]">
      <RoomQtdWithLabel
        iconName="ph:bed"
        placeholder="0"
        title="Total de Quartos"
      />
    </div>
  </div>
  <!-- Rooms -->
  <!-- Usando v-if para mostrar/ocultar o container-rooms -->
  <div v-if="containerRoomsVisible" class="container-rooms w-full">
    <RoomInput
      v-for="(roomIndex, index) in searchStore.criteria.rooms"
      :key="roomIndex"
      :title="`Quarto ${roomIndex}`"
      :roomIndex="roomIndex"
      :style="`z-index:${69 - index}`"
    />
  </div>
  <button
    type="submit"
    :disabled="!searchStore.isFormComplete"
    class="button-search"
    :class="
      searchStore.isFormComplete
        ? 'bg-blue-800 border-blue-800'
        : 'bg-gray-300 border-gray-300'
    "
    @click="navigateTo('/hotels')"
  >
    <Icon name="mdi:magnify" size="1.2rem" color="#ffffff" />
    {{
      searchStore.isFormComplete
        ? 'BUSCAR HOTÉIS NO DESTINO'
        : 'PREENCHA TODOS OS CAMPOS'
    }}
  </button>
</template>

<style scoped>
.button-search {
  @apply border w-full mt-10 text-center p-4 text-white rounded-md text-xs font-bold;
}

.container-autocomplete {
  @apply w-full relative;
}

.container-checkinout {
  @apply w-full md:w-1/2 flex flex-col bg-blue-50 p-3 rounded-md;
}
.wrapper-checkinout {
  @apply w-full flex flex-col md:flex-row gap-2;
}
.container-input-with-emoji {
  @apply flex items-center;
}
.container-hosting-buttons {
  @apply flex md:gap-4 flex-col md:flex-row w-full;
}
.hosting-buttons {
  @apply bg-blue-800 text-white gap-2 flex justify-center items-center p-3  font-bold rounded-md text-xs mt-4;
}
.container-origin-destiny {
  @apply relative flex flex-col md:flex-row mt-6 items-center w-full;
}
.container-input {
  @apply bg-blue-50 p-3 rounded-md w-full;
}
.container-label-input {
  @apply flex justify-between;
}
.label-input {
  @apply text-xs text-blue-800;
}
.input {
  @apply text-sm border-0 bg-transparent focus:ring-0 p-0 font-bold w-full;
}

.invert-destiny-mobile-text {
  @apply text-xs font-bold md:hidden;
}
.container-title-where-hosting {
  @apply my-6 flex w-full;
}
.title-where-hosting {
  @apply text-xl font-bold mt-2;
}
.emoji-bedroom {
  @apply ml-2 text-3xl;
}
.container-where-hosting {
  @apply w-full flex flex-col md:flex-row gap-2;
}
.wrapper-data-baggage-rooms {
  @apply flex mt-2 md:mt-6 gap-2 flex-col md:flex-row w-full;
}
.wrapper-container-input {
  @apply w-full md:w-1/2 flex gap-2 flex-col;
}
.container-data-baggage-rooms {
  @apply bg-blue-50 rounded-md w-full md:w-1/2;
}
.container-rooms {
  @apply flex mt-2 gap-2 flex-col md:flex-row;
}
.container-double-arrow {
  @apply rotate-90 md:p-2 bg-blue-800 rounded-md;
}
.wrapper-change-icon {
  @apply gap-2 flex items-center py-2 relative;
}
</style>
