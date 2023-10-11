<script setup lang="ts"></script>
<template>
  <NuxtLayout name="search-layout">
    <section class="flex flex-col pb-20">
      <header class="container-header">
        <CurrencyHeader />
        <NavBar />
        <section class="px-4"><CardFilterFlight /></section>
      </header>
      <main class="container-result">
        <BreadcumsSearchResult />
        <CardFlight />
      </main>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.container-header {
  @apply bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.container-result {
  @apply mt-10 w-full flex flex-col items-center gap-6 px-4;
}
</style>
