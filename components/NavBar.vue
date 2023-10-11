<script setup lang="ts">
import { usePromoStore } from '../stores/PromoStore';
const promoStore = usePromoStore();
const openSidebar = () => {
  promoStore.sideBarOpen = !promoStore.sideBarOpen;
};
</script>
<template>
  <nav class="wrapper-menu">
    <div class="container-menu">
      <!-- Logo Container -->
      <div class="container-logo">
        <img src="/assets/brt-logo-white-horizontal.svg" alt="" class="h-12" />
      </div>
      <div class="container-menu-buttons">
        <!-- Button Pacotes Aéreos -->
        <!-- <button class="menu-button">
          <Icon name="ph:airplane-in-flight" size="1.2rem" color="#ffffff" />
          <span class="label-menu-button">PACOTES AÉREOS</span>
        </button> -->
        <!-- Button Pacotes Terrestres -->
        <button class="menu-button" @click="navigateTo('/search')">
          <Icon name="ph:person" size="1.2rem" color="#ffffff" />
          <span class="label-menu-button">HOTÉIS</span>
        </button>
        <!-- Button Serviços -->
        <!-- <button class="menu-button">
          <Icon name="material-symbols:room-service-outline" size="1.2rem" color="#ffffff" />
          <span class="label-menu-button">SERVIÇOS</span>
        </button> -->
        <!-- Button Seguros -->
        <!-- <button class="menu-button">
          <Icon name="fluent:shield-checkmark-48-regular" size="1.2rem" color="#ffffff" />
          <span class="label-menu-button">SEGUROS</span>
        </button> -->
        <!-- Button Promoções -->
        <button class="menu-button" @click="openSidebar">
          <Icon name="teenyicons:discount-outline" size="1.2rem" color="#ffffff" />
          <div class="label-menu-button">PROMOS</div>
        </button>
      </div>
      <!-- Hamburger Menu -->
      <div class="flex md:hidden"><BurgerMenuIcon /></div>
    </div>
  </nav>
</template>

<style scoped>
.wrapper-menu {
  @apply flex items-center justify-center p-4;
}
.container-menu {
  @apply flex items-center w-full max-w-6xl justify-between md:justify-start;
}
.container-logo {
  @apply flex items-center mr-6;
}
.container-menu-buttons {
  @apply hidden md:flex;
}
.menu-button {
  @apply flex items-center mr-4;
}
.label-menu-button {
  @apply text-white ml-2 text-xs font-bold;
}
</style>
