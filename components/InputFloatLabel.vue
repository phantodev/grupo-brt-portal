<script setup lang="ts">
import { useBudgetStore } from '../stores/BudgetStore';
const budgetStore = useBudgetStore();
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  useMask: {
    type: Boolean,
  },
});
</script>
<template>
  <div class="relative border-0 flex-1">
    <input
      v-if="props.useMask"
      v-maska
      data-maska="##/##/####"
      type="text"
      name=""
      placeholder=" "
      :id="props.label"
      class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
    />
    <input
      v-else
      type="text"
      name=""
      placeholder=" "
      :id="props.label"
      class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
    />
    <div
      class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
    ></div>
    <div></div>
    <label
      :for="props.label"
      class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
    >
      {{ props.label }}
    </label>
  </div>
</template>
