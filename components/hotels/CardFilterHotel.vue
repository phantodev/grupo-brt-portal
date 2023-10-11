<script setup lang="ts">
import { useSearchStore } from '../../stores/SearchStore';
import { useDateFormatter } from '../../composables/useDateFormatter';
const { formatDate } = useDateFormatter();
const searchStore = useSearchStore();
</script>
<template>
  <section class="wrapper-search">
    <section class="container-search">
      <div class="container-title-package-customer-logo">
        <div class="title-package" v-if="searchStore.hotels && searchStore.hotels.length > 0">
          <div>{{ searchStore.hotels.length }} hotéis encontrados no destino!</div>
        </div>
        <div class="title-package" v-else-if="searchStore.hotels && searchStore.hotels.length === 0">
          Nenhum hotel encontrado!
        </div>
        <div class="title-package" v-if="searchStore.isLoading">
          <img src="/assets/spinnerBlue.svg" class="w-6" alt="" /> Procurando hotéis no destino...
        </div>
        <div>
          <img src="/assets/logo-cliente.png" alt="" class="customer-logo" />
        </div>
      </div>
      <!-- Data Result Infos -->
      <div class="wrapper-origin-destiny">
        <div class="container-origin-destiny">
          <Icon name="material-symbols:location-on-outline" size="1.2rem" color="#114E8C" />
          <div>
            <span class="text-blue-800">{{ searchStore.criteria.destination }}</span>
          </div>
        </div>
        <div class="container-calendar">
          <Icon name="material-symbols:date-range-outline" size="1.2rem" color="#114E8C" />
          <div>
            {{ formatDate(searchStore.criteria.dates[0]) }} -
            {{ formatDate(searchStore.criteria.dates[1]) }}
          </div>
        </div>
      </div>
      <div class="list-rooms">
        <div class="wrapper-rooms">
          <div v-for="(rooms, index) in searchStore.criteria.pax" :key="index">
            <div class="container-rooms">
              <span class="badge-room">Quarto {{ index + 1 }}</span>

              <!-- Loop para os adultos -->
              <div v-for="n in rooms" :key="n + 'a'">
                <Icon name="fa6-solid:child-reaching" size="1rem" color="#114E8C" />
              </div>

              <!-- Loop para as crianças -->
              <div v-for="n in searchStore.criteria.children[index]" :key="n + 'c'">
                <Icon name="fa6-solid:child" size="0.9rem" color="#114E8C" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.badge-room {
  @apply bg-blue-800 text-white text-[10px] rounded-full px-2 flex flex-row justify-center items-center gap-2 mr-2;
}
.container-filters {
  @apply flex flex-col md:grid md:grid-cols-5 mt-4 gap-2;
}
.wrapper-rooms {
  @apply flex gap-2 flex-col md:flex-row;
}
.container-rooms {
  @apply flex items-end;
}
.container-calendar {
  @apply flex items-center gap-3;
}
.container-origin-destiny {
  @apply flex items-center gap-1 text-xs md:text-base;
}
.wrapper-origin-destiny {
  @apply flex flex-col md:flex-row font-bold gap-2;
}
.list-rooms {
  @apply mt-2 text-sm;
}
.title-package {
  @apply text-base md:text-2xl font-bold text-blue-800 flex gap-4 items-center;
}
.container-title-package-customer-logo {
  @apply flex items-center justify-between;
}
.container-search {
  @apply bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl;
}
.wrapper-search {
  @apply flex justify-center mt-6 flex-col items-center;
}
</style>
