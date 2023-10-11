<template>
  <div class="wrapper-breadcrums">
    <div class="container-breadcrums">
      <a href="#" class="container-title-breadcrums">
        <Icon name="ph:airplane-takeoff-light" size="1.5rem" color="#1e40af" />

        <span class="title-breadcrums">PASSAGEM AÉREA</span>
      </a>

      <Icon name="material-symbols:arrow-forward-ios" color="rgb(107 114 128" />

      <a href="#" class="container-title-breadcrums">
        <Icon name="ph:buildings" size="1.5rem" color="#1e40af" />

        <span class="title-breadcrums">HOSPEDAGEM</span>
      </a>

      <Icon name="material-symbols:arrow-forward-ios" color="rgb(107 114 128" />

      <a href="#" class="container-title-breadcrums">
        <Icon name="ph:car-profile" size="1.5rem" color="#1e40af" />

        <span class="title-breadcrums">TRANSFER</span>
      </a>

      <Icon name="material-symbols:arrow-forward-ios" color="rgb(107 114 128" />

      <a href="#" class="container-title-breadcrums">
        <Icon
          name="fluent:shield-checkmark-48-regular"
          size="1.5rem"
          color="#1e40af"
        />

        <span class="title-breadcrums">SEGURO</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.container-title-breadcrums {
  @apply flex items-center px-2 hover:underline;
}
.title-breadcrums {
  @apply mx-2 text-xs font-bold text-blue-800 hidden md:flex;
}
.wrapper-breadcrums {
  @apply bg-blue-50 shadow-2xl;
}
.container-breadcrums {
  @apply container flex items-center px-6 py-4 mx-auto overflow-x-auto whitespace-nowrap gap-4;
}
</style>
