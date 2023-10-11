<template>
  <div class="option-number">Opção #1</div>
  <div class="option-item">
    <div class="option-title-item">Aéreo</div>
    <div class="option-price-item">BRL 8.987,00</div>
  </div>
  <div class="option-item">
    <div class="option-title-item">
      Budget Host Inn - QUADRUPLE DELUXE TWO QUEEN BEDS - ROOM ONLY
    </div>
    <div class="option-price-item">BRL 8.987,00</div>
  </div>
  <div class="option-item">
    <div class="option-title-item">Seguro</div>
    <div class="option-price-item">BRL 8.987,00</div>
  </div>
  <div class="option-item">
    <div class="option-title-item">Transfer</div>
    <div class="option-price-item">BRL 8.987,00</div>
  </div>
  <div class="total-item">
    <div class="total-title-item">Total</div>
    <div class="total-price-item">BRL 8.987,00</div>
  </div>
</template>
<style scoped>
.option-number {
  @apply text-sm font-bold mb-2;
}
.option-item {
  @apply flex flex-row mt-2 gap-4;
}
.option-title-item {
  @apply text-xs flex-1;
}
.option-price-item {
  @apply font-bold text-xs text-blue-800;
}
.total-item {
  @apply flex flex-row gap-4 border-t border-t-gray-200 mt-4 pt-4;
}
.total-title-item {
  @apply flex-1 text-lg font-bold;
}
.total-price-item {
  @apply font-bold text-xs text-blue-800;
}
</style>
