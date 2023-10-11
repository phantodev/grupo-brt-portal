<script setup lang="ts">
import { usePromoStore } from './stores/PromoStore';
const promoStore = usePromoStore();

//Este código é necessário para quando a SIDEBAR de Promo estiver aberta e o contéudo
// principal tiver barra de rolagem, esconde a barra de rolagem do conteúdo principal
watch(
  () => promoStore.sideBarOpen,
  (newValue) => {
    if (newValue) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
);

useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
      crossorigin: '',
    },
  ],
});
</script>

<template>
  <div>
    <!-- <NuxtErrorBoundary> -->
    <NuxtPage />
    <!-- <template #error="{ error, clearError }">
        <Error :clearError="clearError" />
      </template> -->
    <!-- </NuxtErrorBoundary> -->
  </div>
</template>
