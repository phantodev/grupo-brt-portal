<template>
  <section class="wrapper-search">
    <section class="container-search">
      <div class="container-title-package-customer-logo">
        <div class="title-package">33 combinações de vôos encontrados</div>
        <div>
          <NuxtLink to="/search">
            <img src="/assets/logo-cliente.png" alt="" class="customer-logo" />
          </NuxtLink>
        </div>
      </div>
      <!-- Data Result Infos -->
      <div class="wrapper-origin-destiny">
        <div class="container-origin-destiny">
          <div><span class="text-blue-800">SDU</span> - Rio de Janeiro</div>
          <Icon name="ph:airplane-in-flight" size="1.2rem" color="#114E8C" />
          <div><span class="text-blue-800">GRU</span> - São Paulo</div>
        </div>
        <div class="container-calendar">
          <Icon
            name="material-symbols:date-range-outline"
            size="1.2rem"
            color="#114E8C"
          />
          <div>22/07/2022 - 26/07/2022</div>
        </div>
      </div>
      <div class="list-rooms">
        <div class="wrapper-rooms">
          <div class="container-rooms">
            <span
              class="bg-blue-800 text-white text-[10px] rounded-full px-2 flex flex-row justify-center items-center gap-2 mr-2"
              >Quarto 1</span
            >
            <span>2</span>
            <Icon name="fa6-solid:child-reaching" size="1rem" color="#114E8C" />
            <span class="ml-2">2</span
            ><Icon name="fa6-solid:child" size="0.9rem" color="#114E8C" />
          </div>
          <div class="container-rooms">
            <span
              class="bg-blue-800 text-white text-[10px] rounded-full px-2 flex flex-row justify-center items-center gap-2 mr-2"
              >Quarto 2</span
            >
            <span>2</span>
            <Icon name="fa6-solid:child-reaching" size="1rem" color="#114E8C" />
            <span class="ml-2">2</span
            ><Icon name="fa6-solid:child" size="0.9rem" color="#114E8C" />
          </div>
          <div class="container-rooms">
            <span
              class="bg-blue-800 text-white text-[10px] rounded-full px-2 flex flex-row justify-center items-center gap-2 mr-2"
              >Quarto 3</span
            >
            <span>2</span>
            <Icon name="fa6-solid:child-reaching" size="1rem" color="#114E8C" />
            <span class="ml-2">2</span
            ><Icon name="fa6-solid:child" size="0.9rem" color="#114E8C" />
          </div>
        </div>
      </div>
      <div class="container-filters">
        <InputWithLabel placeholder="Ex: AE9878" title="Número vôo de ida" />
        <InputWithLabel placeholder="Ex: AE9878" title="Número vôo de volta" />
        <InputWithLabel placeholder="Disponível" title="Bagagem" />
        <InputWithLabel placeholder="Escolha" title="Paradas" />
        <InputWithLabel placeholder="Escolha" title="Horário de Ida" />
        <InputWithLabel placeholder="Escolha" title="Companhias" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.container-filters {
  @apply flex flex-col md:grid md:grid-cols-3 mt-4 gap-2;
}
.wrapper-rooms {
  @apply flex gap-2 flex-col md:flex-row;
}
.container-rooms {
  @apply flex items-center font-semibold;
}
.container-calendar {
  @apply flex items-center gap-3;
}
.container-origin-destiny {
  @apply flex items-center gap-3 text-xs md:text-base;
}
.wrapper-origin-destiny {
  @apply flex flex-col md:flex-row font-bold gap-2;
}
.list-rooms {
  @apply mt-2 text-sm;
}
.title-package {
  @apply text-base md:text-2xl font-bold text-blue-800;
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
