<script setup lang="ts">
import { onMounted } from 'vue';
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
import { useBudgetStore } from '../../stores/BudgetStore';
const budgetStore = useBudgetStore();
searchStore.$reset();
budgetStore.$reset();
</script>
<template>
  <NuxtLayout name="search-layout">
    <header class="container-header">
      <CurrencyHeader />
      <NavBar />
      <CardSearch />
    </header>
  </NuxtLayout>
</template>

<style scoped>
.container-header {
  @apply h-96 bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
</style>
