<script setup lang="ts">
import { useSearchStore } from '../../stores/SearchStore';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './../../assets/scss/main.scss'; // Variável do SASS para mudar o theme do Calendário
const searchStore = useSearchStore();
// Esta linha muda a posição do calendário abaixo do INPUT.
const customPosition = () => ({ top: 50, left: 30 });
// Esta váriavel controla o número de noites escolhido no intervalo das datas
const nightsTravel = ref<number>(0);

watch(
  () => searchStore.criteria.dates,
  (newValueDates) => {
    if (searchStore.criteria.dates.length !== 0) {
      const date1 = new Date(newValueDates[0]);
      const date2 = new Date(newValueDates[1]);

      const timeDifference = Math.abs(date2.getTime() - date1.getTime());
      const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

      nightsTravel.value = numberOfNights;
    }
  },
  { deep: true }
);

const props = defineProps({
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
});
</script>

<template>
  <div class="container-input">
    <div class="container-label-input">
      <div class="label-input">
        {{ props.title }} - Noites no Destino: {{ nightsTravel }}
      </div>
      <div class="flex justify-start items-start">
        <Icon :name="props.iconName" size="1rem" color="#1e40af" />
      </div>
    </div>
    <div class="w-full mt-2">
      <VueDatePicker
        v-model="searchStore.criteria.dates"
        range
        locale="pt-BR"
        select-text="OK"
        cancel-text="Fechar"
        placeholder="Selecione a data"
        :enable-time-picker="false"
        :alt-position="customPosition"
        :transitions="false"
        hide-input-icon
        :show-last-in-range="false"
        format="dd/MM/yyyy"
        model-type="yyyy-MM-dd"
      />
    </div>
  </div>
</template>

<style scoped>
.container-input {
  @apply bg-blue-50 p-3 rounded-md w-full flex justify-between flex-col relative z-50;
}
.container-label-input {
  @apply flex justify-between;
}
.label-input {
  @apply text-xs text-blue-800 font-semibold;
}
</style>
