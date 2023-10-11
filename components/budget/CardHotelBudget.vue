<script setup lang="ts">
import { ref } from 'vue';
import { watch, onMounted } from 'vue';
import { useBudgetStore } from '../../stores/BudgetStore';
const budgetStore = useBudgetStore();

const showRooms = ref(false);

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
  hotel: {
    type: Object,
    required: true,
  },
  bookingCode: {
    type: String,
    default: '',
    required: true,
  },
  cancelData: {
    type: String,
    default: '',
    required: true,
  },
});
const isLoading = ref(true);

const imageLoaded = () => {
  isLoading.value = false;
};

const imageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '../../assets/no-photo-hotel.png';
  isLoading.value = false; // A imagem não foi carregada, mas o erro é tratado, então paramos de exibir o ícone de carregamento
};

onMounted(() => {
  // console.log('TESTE', props.cancelData);

  if (props.cancelData !== '') {
    navigateTo(`/booking/${budgetStore.budgetSelectedInfos.id}`);
  }
  if (budgetStore.budgetSelectedInfos.pax_filled === 1) {
    console.log('ENTROU');
    showRooms.value = true;
  }
});
</script>
<template>
  <section class="hotel-card">
    <div class="hotel-card__container">
      <div class="hotel-card__photo">
        <div v-if="isLoading" class="loader-icon">
          <LoaderIcon />
        </div>
        <nuxt-img
          v-if="props.hotel.mainImage"
          class="photo"
          fit="cover"
          :src="props.hotel.mainImage"
          loading="lazy"
          @load="imageLoaded"
          @error="imageError"
        />
        <nuxt-img
          v-else
          class="photo"
          fit="cover"
          src="../../assets/no-photo-hotel.png"
          loading="lazy"
          @load="imageLoaded"
          @error="imageError"
        />
      </div>
      <div class="hotel-card__info">
        <div class="info-title">
          {{ props.hotel.name }}
          <div class="stars" v-for="start in props.hotel.category">
            <StarIcon />
          </div>
        </div>
        <div class="info-address">
          {{ props.hotel.address + ' - ' + budgetStore.budgetSelectedInfos.criteria.hotels[0].destination }}
        </div>
        <div class="info-features">
          <div class="feature">
            <CoffeeIcon />
            <div>
              <span v-if="props.room[0].breakfastIncluded">Com</span>
              <span v-else>Sem</span>
              café da manhã
            </div>
          </div>
          <div class="feature">
            <BedIcon />
            <span> {{ props.room[0].description }}</span>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <div
            v-if="props.room[0].isNonRefundable"
            class="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs w-fit"
          >
            Não Reembolsável
          </div>
          <div v-else class="bg-lime-100 text-lime-600 px-4 py-1 rounded-full text-xs w-fit">Reembolsável</div>
          <div
            v-if="props.room[0].prePayment"
            class="bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-xs w-fit"
          >
            Pagamento Imediato
          </div>
        </div>
      </div>
      <div class="hotel-card__price">
        <div class="price-value">
          {{ props.room[0].price.total.Currency }}
          {{ useFormatCurrency(props.room[0].price.total.Value) }}
        </div>
        <button type="submit" class="btn-primary" @click="showRooms = !showRooms">
          {{ budgetStore.budgetSelectedInfos.pax_filled !== 0 ? '😀 QUARTO(s) ESCOLHIDO(s)' : 'ESCOLHER QUARTO' }}
        </button>
      </div>
    </div>
    <div class="hotel-card__room-cards" v-if="showRooms">
      <div class="w-full" v-if="props.room" v-for="(item, index) in room" :key="index">
        <CardRoomsBudget :hotel="props.hotel" :room="item" :key="index" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hotel-card {
  @apply flex flex-col w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl bg-white mb-6;
}

.hotel-card__container {
  @apply flex flex-col md:flex-row w-full h-40 overflow-hidden;
}

.hotel-card__photo {
  @apply w-full md:w-1/4 h-52 object-cover relative;
}

.loader-icon {
  @apply mt-11 ml-32;
}

.photo {
  @apply absolute inset-0 object-cover object-left w-full h-full;
}

.hotel-card__info {
  @apply w-full md:w-2/4 bg-slate-100 p-6 flex flex-col;
}

.info-title {
  @apply font-semibold flex items-center gap-2 mb-2;
}

.stars {
  @apply flex flex-row mt-[-3px];
}

.info-address {
  @apply text-xs;
}

.info-features {
  @apply w-full flex flex-wrap gap-2 font-semibold;
}

.feature {
  @apply text-[10px] flex items-center gap-1 mt-2;
}

.hotel-card__price {
  @apply w-full md:w-[300px] lg:w-1/4 bg-blue-100 p-6 flex flex-col gap-4 font-semibold justify-between;
}

.price-value {
  @apply flex w-full justify-center text-xl font-bold;
}

.btn-primary {
  @apply w-full flex justify-center items-center bg-blue-700 border border-blue-700 p-4 text-white rounded-md text-xs font-bold transition-colors duration-300;
}

.btn-primary:hover {
  @apply bg-sky-100 text-blue-700;
}

.btn-primary:focus {
  @apply bg-blue-700 text-white;
}

.hotel-card__room-cards {
  @apply w-full p-4 bg-slate-200 rounded-b-lg flex flex-col md:flex-row flex-wrap items-center;
}
</style>
