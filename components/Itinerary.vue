<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  flight: {
    type: Object,
  },
});
const showMoreDetails = ref(false);
function toggleMoreDetails() {
  showMoreDetails.value = !showMoreDetails.value;
}
</script>

<template>
  <div class="info-flight">
    <div class="container-flight-company">
      <img src="~/assets/latam-logo.png" alt="" class="mb-4 w-24" />
      <div>
        <div class="text-right md:text-left">
          <strong>Operado por:</strong> LA
        </div>
        <div class="text-right md:text-left">
          <strong>Equipamento:</strong> 319
        </div>
        <div class="text-right md:text-left">
          <strong>Tarifa:</strong> SJ0X0G9
        </div>
      </div>
    </div>
    <div class="wrapper-infos-flight">
      <div class="container-infos-flight">
        <div class="container-checkbox-details">
          <div class="container-checkbox">
            <Icon
              name="ph:airplane-takeoff"
              size="1.8rem"
              color="#114E8C"
            /><span class="text-base font-bold"> Ida: Sex., 22 Jul. 2022 </span>
          </div>

          <div class="container-more-details" @click="toggleMoreDetails">
            <Icon
              name="material-symbols:add-circle-outline"
              size="1rem"
              color="#114E8C"
            /><span class="text-more-details"> Mais detalhes</span>
          </div>
        </div>
        <div class="stop-line">
          <span class="stop-line-point-left"></span>
          <span class="stop-line-point-center"></span>
          <span class="stop-line-point-right"></span>
        </div>
        <div class="wrapper-stop-flight">
          <div class="container-stop-flight items-start">
            <div class="time-stop-flight">22:32</div>
            <div class="text-stop-flight">SDU - RIO DE JANEIRO (SDU)</div>
            <div class="text-stop-flight">22 de Julho de 2022</div>
          </div>
          <div class="flights-stops">2 Paradas</div>
          <div class="container-stop-flight items-end">
            <div class="time-stop-flight">22:32</div>
            <div class="text-stop-flight text-right">GRU - SÃO PAULO (GRU)</div>
            <div class="text-stop-flight text-right">22 de Julho de 2022</div>
          </div>
        </div>
        <div class="footer-details-flight">
          <div class="container-details-flight">
            <Icon
              name="ic:baseline-access-time"
              size="1rem"
              color="#4B5563"
            /><span class="details-flight"> Duração total de 14h15</span>
          </div>
          <div class="container-details-flight">
            <Icon
              name="streamline:travel-airport-baggage-check-baggage-travel-adventure-luggage-bag-checked"
              size="1rem"
              color="#4B5563"
            /><span class="details-flight"> Não inclui bagagem</span>
          </div>
          <div class="container-details-flight">
            <Icon
              name="ic:baseline-access-time"
              size="1rem"
              color="#4B5563"
            /><span class="details-flight"> Vôo nº 121 / Classe S</span>
          </div>
        </div>
        <div v-if="showMoreDetails">
          <ItineraryMoreDetailsCard />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-stop-flight {
  @apply text-[8px] md:text-[10px];
}
.time-stop-flight {
  @apply text-sm md:text-xl font-bold;
}
.container-stop-flight {
  @apply w-1/3 flex flex-col;
}
.flights-stops {
  @apply w-1/3 text-center text-xs md:text-base font-bold;
}
.wrapper-stop-flight {
  @apply w-full flex mt-8 h-20;
}
.stop-line-point-center {
  @apply w-4 h-4 bg-gray-200 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
.text-more-details {
  @apply text-xs text-blue-800 font-bold hidden md:flex;
}
.stop-line {
  @apply w-full h-[2px] bg-gray-200 relative mt-5;
}
.stop-line-point-left {
  @apply w-4 h-4 bg-gray-200 rounded-full absolute top-1/2 transform -translate-y-1/2;
}
.stop-line-point-right {
  @apply w-4 h-4 bg-gray-200 rounded-full absolute top-1/2 right-0 transform -translate-y-1/2;
}
.details-flight {
  @apply text-xs lg:text-[10px] font-semibold;
}
.container-more-details {
  @apply flex items-center gap-2 cursor-pointer;
}
.container-checkbox {
  @apply flex gap-2 items-center;
}
.footer-details-flight {
  @apply flex flex-col md:flex-row gap-2 justify-between items-center mt-4;
}
.container-details-flight {
  @apply flex items-center gap-1;
}
.container-infos-flight {
  @apply flex-1;
}
.wrapper-infos-flight {
  @apply p-6 flex-1;
}
.container-checkbox-details {
  @apply flex items-center gap-4 justify-between;
}
.info-flight {
  @apply flex flex-col md:flex-row flex-1;
}
.container-flight-company {
  @apply flex w-full flex-row md:flex-col md:w-40 p-6 justify-between;
}
</style>
