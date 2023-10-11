<!-- <template>
  <div class="flex justify-center">
    <div class="mt-10 w-40 text-xs">
      <Slider v-model="value" :min="0" :max="700" :merge="100" :format="{ prefix: 'R$', decimals: 2 }" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Slider from '@vueform/slider';

const props = defineProps({
  max: {
    type: Number,
  },
  min: {
    type: Number,
  },
});

console.log('MIN', props.min);
console.log('MAX', props.max);

const value = ref([props.min, props.max]);
</script>

<style src="@vueform/slider/themes/default.css"></style> -->

<template>
  <div class="flex justify-center">
    <div class="mt-10 w-40 text-xs">
      <Slider
        @change="handleSlider"
        v-model="hotelStore.rangePriceFilter"
        :min="hotelStore.minPrice"
        :max="hotelStore.maxPrice"
        :merge="100"
        :format="{ prefix: 'R$', decimals: 2 }"
      />
    </div>
  </div>
</template>

<script setup>
import { useHotelStore } from '../../stores/HotelStore';
const hotelStore = useHotelStore();
import Slider from '@vueform/slider';

function handleSlider(value) {
  hotelStore.rangePriceFilter = value;
}
</script>

<style src="@vueform/slider/themes/default.css"></style>
