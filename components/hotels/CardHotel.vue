<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { IRooms } from '~/types/Hotels';
import { useFormatCurrency } from '../../composables/useFormatCurrency';
import { useSearchStore } from '../../stores/SearchStore';
const searchStore = useSearchStore();
const showRooms = ref(false);
const toast = useToast();

const props = defineProps({
  showBtnReserveAndChangeHosting: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  recommended: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  breakfastIncluded: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  rooms: {
    type: Array<IRooms>,
    required: true,
  },
});

const isLoading = ref(false);

const imageLoading = () => {
  isLoading.value = true;
};

const imageLoaded = () => {
  isLoading.value = false;
};

const imageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '../../assets/no-photo-hotel.png';
  isLoading.value = false; // A imagem não foi carregada, mas o erro é tratado, então paramos de exibir o ícone de carregamento
};

const selectedAllRooms = ref(false);

function toogleAllRooms() {
  const hotelIndex = searchStore.hotelSelectedWithRooms.findIndex((hotel) => hotel.id === props.id);

  if (hotelIndex === -1 && searchStore.hotelSelectedWithRooms.length === 8) {
    toast.error('Você chegou ao limite de 8 hotéis por cotação!');
    return;
  }

  selectedAllRooms.value = !selectedAllRooms.value;

  if (selectedAllRooms.value) {
    // Faça uma cópia profunda dos quartos
    const roomsCopy = JSON.parse(JSON.stringify(props.rooms));

    if (hotelIndex >= 0) {
      // Se o hotel já existe, atualiza os quartos com a cópia
      searchStore.hotelSelectedWithRooms[hotelIndex].rooms = roomsCopy;
    } else {
      // Se o hotel não existe, adiciona na lista
      searchStore.hotelSelectedWithRooms.push({
        id: props.id,
        name: props.name,
        rooms: roomsCopy,
      });
    }
  } else {
    // Se for falso e o hotel existe na lista, remover o hotel pelo ID
    if (hotelIndex > -1) {
      searchStore.hotelSelectedWithRooms.splice(hotelIndex, 1);
    }
  }
  // Loop pelos quartos e altera o estado do checkbox
  props.rooms.forEach((room) => {
    const checkboxElement = document.getElementById(`checkbox-${room.id}`) as HTMLInputElement;

    if (checkboxElement) {
      checkboxElement.checked = selectedAllRooms.value;
    }
  });
}
watch(
  () => searchStore.hotelSelectedWithRooms,
  (newVal) => {
    // Verifique se o hotel com o ID específico ainda existe na lista
    const hotelExists = newVal.some((hotel) => hotel.id === props.id);

    // Se o hotel não existir mais na lista, ajuste selectedAllRooms para false
    if (!hotelExists) {
      selectedAllRooms.value = false;
      // Loop é executado quando eu removo um hotel do Footer
      props.rooms.forEach((room) => {
        const checkboxElement = document.getElementById(`checkbox-${room.id}`) as HTMLInputElement;

        if (checkboxElement) {
          checkboxElement.checked = selectedAllRooms.value;
        }
      });
    } else {
      selectedAllRooms.value = true;
    }
  },
  { deep: true }
);
</script>
<template>
  <section class="wrapper-hotel mb-4">
    <div :id="'hotel-' + props.id" class="container-hotel">
      <div class="container-photo-hotel relative" @click="navigateTo('/budget')">
        <div v-if="isLoading" class="loader-icon-hotel-img">
          <img src="/assets/spinnerBlue.svg" alt="w-10" />
        </div>
        <div
          v-if="recommended"
          class="bg-lime-600 px-4 py-2 font-semibold text-xs absolute z-30 text-white flex flex-row gap-2 items-center"
        >
          😍 Recomendado
        </div>
        <nuxt-img
          v-if="props.mainImage"
          class="image-hotel"
          fit="cover"
          :src="props.mainImage"
          loading="lazy"
          @load="imageLoaded"
          @error="imageError"
          @loadstart="imageLoading"
        />
        <nuxt-img
          v-else
          class="image-hotel"
          fit="cover"
          src="../../assets/no-photo-hotel.png"
          loading="lazy"
          @load="imageLoaded"
          @error="imageError"
          @loadstart="imageLoading"
        />
      </div>
      <div class="wrapper-info-hotel">
        <!-- Segunda coluna -->
        <div class="container-info-hotel">
          <div class="hotel-name">
            {{ props.name }}
            <div class="review-stars" v-for="start in props.category">
              <StarIcon />
            </div>
          </div>
          <div class="hotel-address">
            {{ props.address }}
          </div>
          <div class="container-optional-hotel">
            <div class="hotel-items">
              <Icon
                name="streamline:food-drinks-tea-cup-herbal-cook-tea-tisane-cup-drink-cooking-nutrition-mug-food"
                size="0.9rem"
                color="#114E8C"
              />
              <div>
                <span v-if="props.breakfastIncluded">Com</span>
                <span v-else>Sem</span>
                café da manhã
              </div>
            </div>
            <div class="hotel-items">
              <BedIcon />
              <span> {{ props.description }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <div
              v-if="props.rooms[0].isNonRefundable"
              class="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs w-fit"
            >
              Não Reembolsável
            </div>
            <div v-else class="bg-lime-100 text-lime-600 px-4 py-1 rounded-full text-xs w-fit">Reembolsável</div>
            <div
              v-if="props.rooms[0].prePayment"
              class="bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-xs w-fit"
            >
              Pagamento Imediato
            </div>
          </div>
        </div>
      </div>
      <div class="container-price">
        <!-- Terceira coluna -->
        <div class="price">
          {{ props.currency }}
          {{ useFormatCurrency(props.price) }}
        </div>
        <button
          v-if="!props.showBtnReserveAndChangeHosting"
          type="submit"
          class="btn-primary"
          @click="showRooms = !showRooms"
        >
          ESCOLHER QUARTO
        </button>
        <div v-if="props.showBtnReserveAndChangeHosting" class="show-btn-reserve-and-change-hosting">
          <button type="button" class="btn-primary">RESERVAR</button>
          <button type="button" class="btn-change-hotel">ALTERAR HOSPEDAGEM</button>
        </div>
      </div>
    </div>
    <div class="wrapper-container-card-rooms" v-if="showRooms">
      <div class="font-bold text-xs w-full flex items-center gap-4 justify-end text-right pr-4 pb-4">
        <div @click="toogleAllRooms" class="cursor-pointer">
          {{ !selectedAllRooms ? 'Marcar' : 'Desmarcar' }} todos quartos
          <Icon name="ic:sharp-checklist" color="#65A30D" size="1.5rem" />
        </div>
      </div>
      <div class="w-full" v-if="props.rooms" v-for="(item, index) in props.rooms" :key="index">
        <CardRoomsHorizontal
          :idHotel="props.id"
          :nameHotel="props.name"
          :id="item.id"
          :adtQtd="item.adtQtd"
          :chdQtd="item.chdQtd"
          :recommended="item.recommended"
          :description="item.description"
          :breakfastIncluded="item.breakfastIncluded"
          :prePayment="item.prePayment"
          :avaibleRoomsQtd="item.avaibleRoomsQtd"
          :isNonRefundable="item.isNonRefundable"
          :price="item.price.total.Value"
          :currency="item.price.total.Currency"
          :selectedAllRooms="selectedAllRooms"
          :toogleAllRooms="toogleAllRooms"
          :rooms="rooms"
          :key="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.show-btn-reserve-and-change-hosting {
  @apply flex-1 flex flex-col gap-2;
}
.loader-icon-hotel-img {
  @apply flex items-center justify-center h-full;
}
.image-hotel {
  @apply absolute inset-0 object-cover object-left w-full h-full;
}
.photo-hotel {
  @apply object-cover h-full w-full;
}
.wrapper-container-card-rooms {
  @apply w-full p-4  bg-slate-200 rounded-b-lg flex flex-col md:flex-row flex-wrap items-center;
}
.container-card-rooms {
  @apply w-full md:w-1/2 lg:w-1/4 px-2 pb-4;
}

.price {
  @apply flex w-full justify-center text-xl font-bold;
}
.container-price {
  @apply w-full md:w-[300px] lg:w-1/4 bg-blue-100 p-6 flex flex-col gap-4 font-semibold justify-between;
}
.container-optional-hotel {
  @apply w-full flex flex-wrap gap-2 font-semibold;
}
.wrapper-info-hotel {
  @apply w-full md:w-2/4 bg-slate-100 p-6 flex flex-col justify-between;
}
.container-info-hotel {
  @apply flex flex-col gap-2;
}
.container-photo-hotel {
  @apply w-full md:w-1/4 h-52 object-cover;
}
.wrapper-hotel {
  @apply flex flex-col w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl bg-white;
}
.container-hotel {
  @apply flex flex-col md:flex-row w-full h-44 overflow-hidden;
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
.review-stars {
  @apply flex flex-row mt-[-3px];
}
.hotel-name {
  @apply font-semibold flex items-center gap-2;
}
.hotel-address {
  @apply text-xs;
}
.hotel-items {
  @apply text-[10px] flex items-center gap-1;
}
.btn-secondary {
  @apply flex font-bold items-center justify-center gap-2 border border-blue-700 text-blue-700 p-2 w-2/3 bg-white rounded-md text-xs h-12 hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}
.btn-change-hotel {
  @apply flex font-bold items-center justify-center gap-2 border border-blue-700 text-blue-700 p-2 w-full bg-white rounded-md text-xs h-12 hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}
</style>
