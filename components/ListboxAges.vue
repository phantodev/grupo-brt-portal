<script setup lang="ts">
import { ref } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { useSearchStore } from '../stores/SearchStore';
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  roomIndex: {
    type: Number,
    default: 0,
  },
  ageIndex: {
    type: Number,
    default: 0,
  },
});
const searchStore = useSearchStore();

const items = [
  { description: 'Idade', age: null },
  { description: '0 a 12 meses', age: 1 },
  { description: '13 a 24 meses', age: 2 },
  { description: '3 anos', age: 3 },
  { description: '4 anos', age: 4 },
  { description: '5 anos', age: 5 },
  { description: '6 anos', age: 6 },
  { description: '7 anos', age: 7 },
  { description: '8 anos', age: 8 },
  { description: '9 anos', age: 9 },
  { description: '10 anos', age: 10 },
  { description: '11 anos', age: 11 },
  { description: '12 anos', age: 12 },
  { description: '13 anos', age: 13 },
  { description: '14 anos', age: 14 },
  { description: '15 anos', age: 15 },
  { description: '16 anos', age: 16 },
  { description: '17 anos', age: 17 },
];

const selectedItem = ref(items[0]);

watch(selectedItem, (ageSelected) => {
  if (ageSelected.age !== null) {
    const key = `${props.roomIndex - 1}-${props.ageIndex - 1}`;
    searchStore.criteria.childrenAges[key] = ageSelected.age;
  }
});
</script>

<!-- ATENÇÃO: LISTABOX por ser um COMPONENTE de TERCEIRO (HeadlessUI), não criei classes CSS -->

<template>
  <div class="bg-blue-50 rounded-md flex justify-between flex-col w-full">
    <div class="w-28">
      <Listbox v-model="selectedItem">
        <div class="relative">
          <ListboxButton
            class="relative w-full cursor-default text-left focus:outline-none text-xs"
          >
            <span class="truncate flex justify-end pr-8">{{
              selectedItem.description
            }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 shadow-lg text-xs right-0"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="(item, index) in items"
                :key="index"
                :value="item"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-50 text-blue-800' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-5',
                  ]"
                >
                  <span
                    :class="[selected ? 'font-medium' : 'font-normal', 'block']"
                  >
                    {{ item.description }}
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
  </div>
</template>

<style scoped></style>
