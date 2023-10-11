<template>
  <div class="flex justify-center">
    <div class="mt-10 w-40">
      <!-- <Slider v-model="value" :min="0" :max="25" :merge="100" :format="{ prefix: '%', decimals: 2 }" /> -->
      <Slider v-model="value" :min="0" :max="25" :format="{ prefix: '% ' }" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Slider from '@vueform/slider';

const value = ref(0);
</script>

<style src="@vueform/slider/themes/default.css"></style>
