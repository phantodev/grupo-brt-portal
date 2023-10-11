<script setup lang="ts">
import { ref } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { useSearchStore } from '../stores/SearchStore';
const searchStore = useSearchStore();

const baggageType = [
  { description: 'Sem Bagagem', value: false },
  { description: 'Com Bagagem', value: true },
];
const selectedBaggage = ref(baggageType[0]);
// Watch é a mesma coisa que o useEffect do React.
watch(selectedBaggage, (item) => {
  console.log(`O quarto selecionado é ${item.value}`);
  searchStore.onlyBaggage = item.value;
});
defineEmits(['update:modelValue']);
const props = defineProps({
  dynamicComponent: {
    type: Object,
  },
  stateInPinia: {
    type: Number,
  },
  placeholder: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: '',
  },
  updateStore: {
    type: Function,
  },
  modelValue: {
    type: Number,
  },
});
</script>

<!-- ATENÇÃO: LISTABOX por ser um COMPONENTE de TERCEIRO (HeadlessUI), não criei classes CSS -->

<template>
  <div class="container-input">
    <div class="container-label-input">
      <div class="label-input">{{ props.title }}</div>
      <div class="flex justify-start items-start">
        <Icon :name="props.iconName" size="1rem" color="#1e40af" />
      </div>
    </div>
    <div class="w-full">
      <Listbox v-model="selectedBaggage">
        <div class="relative mt-2 h-[20px]">
          <ListboxButton
            class="relative w-full cursor-default pr-10 text-left focus:outline-none text-xs"
          >
            <span class="block truncate">{{
              selectedBaggage.description
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
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg text-xs"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="(item, index) in baggageType"
                :key="index"
                :value="item"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-50 text-blue-800' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-xs' : 'font-xs',
                      'block truncate',
                    ]"
                    >{{ item.description }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-800"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
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

<style scoped>
.container-input {
  @apply bg-blue-50 p-3 rounded-md w-full flex justify-between flex-col relative z-40;
}
.container-label-input {
  @apply flex justify-between;
}
.label-input {
  @apply text-xs text-blue-800 font-semibold;
}
.input {
  @apply text-sm border-0 bg-transparent focus:ring-0 p-0;
}
</style>
