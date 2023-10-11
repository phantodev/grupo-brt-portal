<script setup>
import { useCityStore } from '../stores/CityStore';
import { useSearchStore } from '../stores/SearchStore';
import { ref, computed, watch } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';

const cityStore = useCityStore();
const searchStore = useSearchStore();

await cityStore.fetchCities();

const data = cityStore.cities;

const props = defineProps({
  title: {
    type: String,
    default: 'Destino',
  },
  iconName: {
    type: String,
    default: 'ph:airplane-takeoff-light',
  },
  fieldType: {
    type: String,
    required: true,
  },
});

let selected = ref([]);
let query = ref('');

// WATCH no VUE é a mesma coisa que o useEffect do REACT.
watch(selected, (newValue) => {
  // Atualizando o estado no PINIA;
  if (props.fieldType === 'origin') {
    cityStore.originCity = newValue.city; // Atualizar o originCity no Pinia
  } else if (props.fieldType === 'destination') {
    searchStore.criteria.destination = newValue.city; // Atualizar o destinationCity no Pinia
  }
});

let filteredCity = computed(() =>
  query.value === ''
    ? data
    : data.filter((city) =>
        city.city
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
);
</script>
<!-- ATENÇÃO: COMBOBOX por ser um COMPONENTE de TERCEIRO (HeadlessUI), não criei classes CSS -->
<template>
  <div class="bg-blue-50 p-3 inline-block rounded-lg w-full">
    <div class="flex justify-between">
      <div class="text-xs text-blue-800 font-semibold">
        {{ props.title }}
      </div>
      <div class="flex justify-start items-start">
        <Icon :name="props.iconName" size="1.2rem" color="#1e40af" />
      </div>
    </div>
    <div class="w-full">
      <Combobox v-model="selected" nullable>
        <div class="relative mt-1">
          <div
            class="relative w-full cursor-default overflow-hidden bg-blue-50 text-left focus:outline-none text-sm"
          >
            <ComboboxInput
              class="truncate w-full p-0 border-0 text-xs text-gray-900 focus:ring-0 bg-blue-50"
              :displayValue="(city) => city?.city"
              @change="query = $event.target.value"
              placeholder="Digite o nome da cidade"
            />
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <div
                v-if="filteredCity.length === 0 && query !== ''"
                class="relative cursor-default select-none py-2 px-4 text-gray-700"
              >
                Sem cidade ou Aeroporto.
              </div>

              <ComboboxOption
                v-for="city in filteredCity"
                as="template"
                :key="city.city"
                :value="city"
                v-slot="{ selected, active }"
              >
                <li
                  class="relative cursor-default select-none py-2 pl-4 pr-4"
                  :class="{
                    'bg-blue-800 text-white': active,
                    'text-gray-900': !active,
                  }"
                >
                  <span
                    class="block truncate text-xs"
                    :class="{
                      'font-medium': selected,
                      'font-normal': !selected,
                    }"
                  >
                    {{ city.city }}
                  </span>
                  <!-- Essa parte é caso queira um Check do lado da cidade -->
                  <!-- <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{ 'text-white': active, 'text-teal-600': !active }"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span> -->
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox>
    </div>
  </div>
</template>
