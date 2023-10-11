<script setup lang="ts">
import mockedData from '../../mockData/SampleItinerary.json';
const flight = mockedData.data[0][0].container[0].departure;
</script>
<template>
  <section class="wrapper-flight">
    <div class="container-flight">
      <div class="flight-info">
        <Itinerary :flight="flight" />
        <Itinerary :flight="flight" />
      </div>

      <div class="container-price">
        <div class="price">BRL 4.276,03</div>
        <div class="price-adult">
          <div>Por adulto:</div>
          <div>BRL: 1.198,67</div>
        </div>
        <div class="price-kids">
          <div>Por criança:</div>
          <div>BRL: 1.198,67</div>
        </div>
        <div class="divider"></div>
        <div class="total-fees">
          <div>Total Taxas:</div>
          <div>BRL: 1.198,67</div>
        </div>
        <div class="total-travel">
          <div>Total:</div>
          <div>BRL: 1.198,67</div>
        </div>
        <button type="submit" class="submit-enter">SELECIONAR VÔO</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flight-info {
  @apply flex flex-col flex-1;
}

.submit-enter {
  @apply flex justify-center items-center bg-blue-700 border border-blue-700 p-4 text-white rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}
.total-travel {
  @apply flex justify-between text-xs;
}
.total-fees {
  @apply flex justify-between text-xs;
}
.divider {
  @apply border-t border-gray-400;
}
.price-kids {
  @apply flex justify-between text-xs;
}
.price-adult {
  @apply flex justify-between text-xs;
}
.price {
  @apply flex w-full justify-center text-2xl font-bold;
}
.container-price {
  @apply w-full lg:w-1/4 bg-blue-100 p-6 flex flex-col gap-4 font-semibold;
}
.wrapper-flight {
  @apply flex flex-col w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl;
}
.container-flight {
  @apply flex flex-col lg:flex-row w-full bg-white text-xs;
}
</style>
