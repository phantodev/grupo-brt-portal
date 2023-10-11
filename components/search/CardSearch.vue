<script setup lang="ts"></script>
<template>
  <section class="wrapper-search">
    <section class="container-search">
      <div class="container-title-package-customer-logo">
        <div class="title-package">Busca de Hotéis</div>
        <div>
          <img src="/assets/logo-cliente.png" alt="" class="customer-logo" />
        </div>
      </div>
      <SearchForm />
    </section>
  </section>
</template>
<style scoped>
.customer-logo {
  @apply w-32 md:w-40;
}
.title-package {
  @apply text-base md:text-2xl font-bold;
}
.container-title-package-customer-logo {
  @apply flex items-center justify-between w-full;
}
.container-search {
  @apply bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl relative flex flex-col items-center flex-1;
}
.wrapper-search {
  @apply flex justify-center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
