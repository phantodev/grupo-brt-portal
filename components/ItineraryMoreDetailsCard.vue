<template>
  <div class="more-details-flight">
    <div class="header-more-details">
      <div class="logo-company">
        <img src="~/assets/latam-logo.png" alt="" class="w-20" />
      </div>
      <div class="infos-header-more-details">
        <p>Voo Nº: AD2789</p>
        <p>Embraer EMB 195</p>
        <p>Classe: Econômica</p>
      </div>
    </div>
    <div class="segment-info h-30">
      <span class="segment-info-wrapper"
        ><div class="flight-info items-start">
          <p class="date">Qua 09 Ago</p>
          <p class="time-info">21:00</p>
          <p class="airport-code">CWB</p>
          <p class="city-name">Curitiba</p>
          <p class="airport-name text-left">
            Aeroporto Internacional Afonso Pena
          </p>
        </div>
        <span class="center-column-container"
          ><span class="duration-info-container">
            <div class="mx-2 text-center">
              <p class="duration-text">Duração</p>
              <p class="duration-info">1h 10m</p>
            </div></span
          ></span
        >
        <div class="flight-info items-end">
          <p class="date">Qua 09 Ago</p>
          <p class="time-info">22:10</p>
          <p class="airport-code">GRU</p>
          <p class="city-name">São Paulo</p>
          <p class="airport-name text-right">
            Aeroporto Internacional Guarulhos
          </p>
        </div></span
      >
    </div>
    <div class="container-connection">
      <span class="connection"
        ><span class="wait-duration"
          ><Icon
            name="ic:baseline-access-time"
            size="1rem"
            color="#4B5563"
          /><span class="text">
            Espera de<span class="connection-text-duration"
              ><strong>&nbsp;1h 15m&nbsp;</strong></span
            >
            em Belo Horizonte
          </span></span
        ><span class="connection-type"> (Troca de avião) </span></span
      >
    </div>
  </div>
</template>
<style scoped>
.date {
  @apply text-[10px] md:text-xs;
}
.infos-header-more-details {
  @apply text-xs flex-1 text-right text-[10px];
}
.container-connection {
  @apply bg-blue-100 flex-1 p-2 rounded-md flex justify-center mt-10;
}
.connection {
  @apply text-[10px];
}
.airport-code {
  @apply font-bold text-[10px];
}
.city-name {
  @apply text-[10px];
}
.duration-text {
  @apply text-[10px];
}
.duration-info-container:before {
  content: '';
  position: relative;
  width: 10px;
  height: 2px;
  background-color: #114e8c;
  left: 0;
  top: 50%;
}
.duration-info-container:after {
  content: '';
  position: relative;
  width: 10px;
  height: 2px;
  background-color: #114e8c;
  left: 0;
  top: 50%;
}
.duration-info {
  @apply font-bold text-[10px] md:text-base;
}
.segment-info-wrapper {
  @apply flex justify-between items-center mt-6;
}
.duration-info-container {
  @apply flex flex-row items-center;
}
.time-info {
  @apply text-sm md:text-2xl font-bold;
}
.airport-name {
  @apply text-[8px] md:text-xs leading-normal;
}
.flight-info {
  @apply flex flex-col flex-1;
}
.header-more-details {
  @apply flex;
}
.more-details-flight {
  @apply bg-gray-100 flex-1 rounded-lg mt-6 p-4;
}
</style>
