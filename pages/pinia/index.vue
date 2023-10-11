<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useHotelStore } from '../../stores/HotelStore';
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
const hotelStore = useHotelStore();
const router = useRouter();

const { userChoice, token, consultant } = storeToRefs(hotelStore);

console.log(userChoice.value.criteria.hotels.length);
console.log('DESTINATION', searchStore.criteria.destination);

if (searchStore.criteria.destination === '') {
  console.log('AI PAPAI');
}

if (searchStore.isLoading == false && userChoice.value.criteria.hotels.length === 0) {
  console.log('ENTROU PORRA!');

  router.push('/search');
}

onMounted(() => {
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  token.value = authLocalStore.token || '';
  consultant.value = authLocalStore.consultant || '';
});
</script>

<style scoped></style>
