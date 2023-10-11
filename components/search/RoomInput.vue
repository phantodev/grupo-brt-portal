<script setup lang="ts">
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
const props = defineProps({
  title: String,
  roomIndex: {
    type: Number,
    default: 0,
  },
});

function changePersonInRoom(type: string, action: string) {
  if (type === 'adult' && props.roomIndex !== undefined) {
    // LOGIC: Adicionando ou removendo ADULT do Store com limite de até 5 adultos por quarto.
    if (searchStore.criteria.pax[props.roomIndex - 1] < 5 && action === 'add') {
      searchStore.criteria.pax[props.roomIndex - 1] += 1;
    } else if (
      searchStore.criteria.pax[props.roomIndex - 1] > 1 &&
      action === 'remove'
    ) {
      searchStore.criteria.pax[props.roomIndex - 1] -= 1;
    }
  } else if (type === 'child' && props.roomIndex !== undefined) {
    // LOGIC: Adicionando ou removendo CHILD do Store com limite de até 5 crianças por quarto.
    if (
      searchStore.criteria.children[props.roomIndex - 1] < 5 &&
      action === 'add'
    ) {
      searchStore.criteria.children[props.roomIndex - 1] += 1;
    } else if (
      searchStore.criteria.children[props.roomIndex - 1] > 0 &&
      action === 'remove'
    ) {
      searchStore.criteria.children[props.roomIndex - 1] -= 1;
      const keyToRemove = `${props.roomIndex - 1}-${
        searchStore.criteria.children[props.roomIndex - 1]
      }`;
      delete searchStore.criteria.childrenAges[keyToRemove];
    }
  }
}
</script>
<template>
  <div class="card-room">
    <div class="container-title-card">
      <div class="title-card">
        {{ props.title }}
      </div>
      <div>
        <Icon name="ph:users-three-light" color="#114e8c" size="1.5rem" />
      </div>
    </div>
    <div class="w-full">
      <div class="container-person-add">
        <div class="w-1/2">
          <p><strong>Adultos</strong></p>
          <p class="text-xs">acima de 18 anos</p>
        </div>
        <div class="container-add-remove">
          <button
            v-if="props.roomIndex !== undefined"
            :disabled="searchStore.criteria.pax[props.roomIndex - 1] === 1"
            :class="
              searchStore.criteria.pax[props.roomIndex - 1] === 1
                ? 'bg-gray-400'
                : 'bg-blue-800'
            "
            class="btn-action"
            @click="changePersonInRoom('adult', 'remove')"
          >
            -
          </button>
          <div class="number-person" v-if="roomIndex !== undefined">
            {{ searchStore.criteria.pax[props.roomIndex - 1] }}
          </div>
          <button
            v-if="props.roomIndex !== undefined"
            :disabled="searchStore.criteria.pax[props.roomIndex - 1] === 5"
            :class="
              searchStore.criteria.pax[props.roomIndex - 1] === 5
                ? 'bg-gray-400'
                : 'bg-blue-800'
            "
            class="btn-action"
            @click="changePersonInRoom('adult', 'add')"
          >
            +
          </button>
        </div>
      </div>
      <div class="container-person-add">
        <div class="w-1/2">
          <p><strong>Crianças</strong></p>
          <p class="text-xs">de 0 até 17 anos</p>
        </div>
        <div class="container-add-remove">
          <button
            v-if="props.roomIndex !== undefined"
            :disabled="searchStore.criteria.children[props.roomIndex - 1] === 0"
            :class="
              searchStore.criteria.children[props.roomIndex - 1] === 0
                ? 'bg-gray-400'
                : 'bg-blue-800'
            "
            class="btn-action"
            @click="changePersonInRoom('child', 'remove')"
          >
            -
          </button>
          <div class="number-person" v-if="roomIndex !== undefined">
            {{ searchStore.criteria.children[props.roomIndex - 1] }}
          </div>
          <button
            v-if="props.roomIndex !== undefined"
            :disabled="searchStore.criteria.children[props.roomIndex - 1] === 5"
            :class="
              searchStore.criteria.children[props.roomIndex - 1] === 5
                ? 'bg-gray-400'
                : 'bg-blue-800'
            "
            class="btn-action"
            @click="changePersonInRoom('child', 'add')"
          >
            +
          </button>
        </div>
      </div>
      <hr
        class="separator"
        v-if="searchStore.criteria.children[props.roomIndex - 1] > 0"
      />
      <div
        class="container-person-add"
        v-for="index in searchStore.criteria.children[props.roomIndex - 1]"
        :key="index"
      >
        <div class="flex-1">
          <p class="text-xs"><strong>Idade da criança</strong></p>
          <p class="text-[10px]">ao voltar da viagem</p>
        </div>
        <div class="container-listbox-ages" :style="`z-index:${39 - index}`">
          <ListboxAges :roomIndex="roomIndex" :ageIndex="index" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.number-person {
  @apply font-bold text-lg w-10 text-center;
}
.container-listbox-ages {
  @apply flex justify-end items-center gap-4;
}
.separator {
  @apply border-t border-blue-200 mt-4;
}
.btn-action {
  @apply rounded-full h-6 w-6 flex justify-center items-center text-white font-bold;
}
.container-add-remove {
  @apply w-1/2 flex justify-end items-center gap-2;
}
.container-person-add {
  @apply flex mt-2;
}
.title-card {
  @apply text-base font-bold text-blue-800;
}
.container-title-card {
  @apply flex justify-between;
}
.card-room {
  @apply bg-blue-50 p-2 rounded-md w-full;
}
</style>
