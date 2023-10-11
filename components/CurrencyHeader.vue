<script setup lang="ts">
import { onMounted } from 'vue';
import { useCurrencyStore } from '../stores/CurrencyStore';
import { useAuthStore } from '../stores/AuthStore';
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();

onMounted(() => {
  currencyStore.getAllCurrencies();
});
</script>

<template>
  <section class="wrapper-sup-menu">
    <div class="container-sup-menu">
      <div class="container-infos-spu-menu">
        <div class="infos-sup-menu">
          <Icon name="ph:phone-call" size="1.2rem" color="#ffffff" /><span class="">0800-6455400</span>
        </div>
        <div class="infos-sup-menu">
          <Icon name="ph:phone-call" size="1.2rem" color="#ffffff" /><span>(41)3219-5400</span>
        </div>
        <div class="container-currency">
          <Icon name="material-symbols:attach-money" size="1.2rem" color="#ffffff" /><span
            >USD: R${{ currencyStore.USD }} | EUR: R${{ currencyStore.EUR }} | GBP: R${{ currencyStore.GBP }}
          </span>
        </div>
      </div>
      <div class="user-menu">
        <MenuMobile /><span class="hidden lg:flex">{{ authStore.name }}</span>
      </div>
    </div>
  </section>
</template>
<style scoped>
.container-currency {
  @apply flex gap-1 items-center text-white font-bold;
}
.wrapper-sup-menu {
  @apply text-white flex justify-center gap-4 text-xs border-b border-white px-2 md:px-6 py-2;
}
.container-sup-menu {
  @apply max-w-6xl flex justify-between w-full;
}
.container-infos-spu-menu {
  @apply flex gap-2;
}
.infos-sup-menu {
  @apply hidden md:flex gap-1 items-center;
}
.user-menu {
  @apply flex items-center gap-2;
}
</style>
