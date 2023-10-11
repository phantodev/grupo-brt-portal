<script setup lang="ts">
import { useMyBudgetsStore } from '../../../stores/MyBudgetsStore';
const myBudgetsStore = useMyBudgetsStore();
</script>
<template>
  <NuxtLayout name="search-layout">
    <header class="container-header">
      <CurrencyHeader />
      <NavBar />
      <section class="wrapper-list-budgets">
        <section class="container-list-budgets">
          <div class="container-title-package-customer-logo">
            <div class="title-list-budget flex-1">Lista de Orçamentos</div>
            <div class="flex gap-2 items-center" v-if="myBudgetsStore.myBudgets?.data.length !== 0">
              <div class="text-md font-bold text-blue-800">Busca</div>
              <input v-maska data-maska="########" type="text" placeholder="ID do orçamento" class="form-input" />
              <button type="button" class="btn-search">
                <Icon name="ph:magnifying-glass-bold" size="1rem" color="#ffffff" />
              </button>
            </div>
          </div>
          <div class="w-full">
            <TableBudgets />
            <Pagination />
          </div>
        </section>
      </section>
    </header>
  </NuxtLayout>
</template>

<style scoped>
.container-header {
  @apply h-96 bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.customer-logo {
  @apply w-32 md:w-40;
}
.title-list-budget {
  @apply text-base md:text-2xl font-bold;
}
.container-title-package-customer-logo {
  @apply flex items-center justify-between w-full;
}
.container-list-budgets {
  @apply bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl relative flex flex-col items-center flex-1;
}
.wrapper-list-budgets {
  @apply flex justify-center;
}
.form-input {
  @apply h-12 p-4 rounded-md border border-gray-200 text-sm placeholder-gray-300;
}
.btn-search {
  @apply bg-blue-800 border-0 p-4 text-white rounded-md text-xs font-bold;
}
</style>
../../../stores/MyBudgetsStore-OLD
