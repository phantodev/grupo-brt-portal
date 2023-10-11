<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../../stores/SearchStore';
import { useHotelStore } from '../../stores/HotelStore';
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading';
import { HotelCriteria, IHotels } from '../../types/Hotels';
const searchStore = useSearchStore();
const hotelStore = useHotelStore();
const router = useRouter();

// Ele reseta o HotelsToReserve toda vez que entra na tela!
hotelStore.$reset();

//
if (searchStore.criteria.destination === '') {
  router.push('/search');
}

if (searchStore.criteria.destination !== '') {
  searchStore.searchHotels();
}

const PAGE_SIZE = 5;

const hotels = ref<IHotels[]>([]);
let page = 1;

function load({ loaded }: LoadAction): Promise<void> {
  if (!searchStore.hotels) {
    return Promise.resolve();
  }
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const loadedHotels = searchStore.hotels.slice(start, end);
  hotels.value.push(...loadedHotels);
  page += 1;
  loaded(loadedHotels.length, PAGE_SIZE);
  return Promise.resolve();
}

// Função para que cada letra digitada no input do nome do hotel tenha um atraso de 300ms, evitando aumento de processamento.
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Função debounced para atualizar searchQuery
const debouncedUpdate = debounce((event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  hotelStore.searchQuery = inputElement.value;
}, 300);

const filteredHotels = computed(() => {
  return hotels.value.filter((hotel) => {
    const nameMatch = hotel.name.toLowerCase().includes(hotelStore.searchQuery.toLowerCase());

    const firstRoom = hotel.rooms[0];
    let breakfastMatch = false;

    if (firstRoom) {
      if (hotelStore.breakfastFilter.withBreakfast && hotelStore.breakfastFilter.withoutBreakfast) {
        breakfastMatch = true; // Se ambos os filtros estão marcados, qualquer hotel é válido
      } else if (hotelStore.breakfastFilter.withBreakfast) {
        breakfastMatch = firstRoom.breakfastIncluded; // Se apenas o filtro 'Com Café' está marcado
      } else if (hotelStore.breakfastFilter.withoutBreakfast) {
        breakfastMatch = !firstRoom.breakfastIncluded; // Se apenas o filtro 'Sem Café' está marcado
      }
    }

    const priceMatch =
      firstRoom?.price.total.Value >= hotelStore.rangePriceFilter[0] &&
      firstRoom?.price.total.Value <= hotelStore.rangePriceFilter[1];

    const categoryMatch = hotelStore.categoryFilter[hotel.category]; // Novo filtro

    return nameMatch && breakfastMatch && priceMatch && categoryMatch; // Adicionado categoryMatch
  });
});

const phrases = [
  'Procurando as melhores passagens e hotéis. Aguarde!',
  'Promoções especiais todos os dias para seus clientes!',
  'Grupo BRT inovando com tecnologia a cada dia!',
];
const currentIndex = ref(0);
const showText = ref(true);

const switchPhrase = () => {
  showText.value = false;
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % phrases.length;
    showText.value = true;
  }, 500);
};

setInterval(switchPhrase, 2000);

const sectionHeight = ref('h-16'); // altura inicial

const toggleHeight = () => {
  if (sectionHeight.value === 'h-16') {
    sectionHeight.value = 'h-32';
  } else {
    sectionHeight.value = 'h-16';
  }
};

watch(
  () => searchStore.hotelSelectedWithRooms,
  (newVal) => {
    if (newVal.length > 4 && sectionHeight.value === 'h-16') {
      toggleHeight();
    }
    if (newVal.length <= 4 && sectionHeight.value === 'h-32') {
      toggleHeight();
    }
  },
  { deep: true }
);

// Função para criar o ARRAY de Hotéis com Array de Rooms.
const hotelsPayloadBudget = ref({
  items: {
    hotel: [
      {
        city: searchStore.criteria.destination,
        initialDate: searchStore.criteria.dates[0],
        endDate: searchStore.criteria.dates[1],
        totalQty: 1,
        items: [] as any,
      },
    ],
  },
});

// Função para atualizar o payload
const updatePayload = () => {
  // Itera sobre os hotéis selecionados
  searchStore.hotelSelectedWithRooms.forEach((selectedHotel, index) => {
    // Encontra o hotel correspondente em searchStore.hotels
    const hotelInfo = searchStore.hotels?.find((hotel) => hotel.id === selectedHotel.id);
    if (hotelInfo) {
      const hotelCopy: any = { ...hotelInfo };
      delete hotelCopy.rooms;
      delete hotelCopy.rooms_g;
      // Adiciona o hotel encontrado sem o ROOMS e ROOMS_G dentro da ref PAYLOAD
      hotelsPayloadBudget.value.items.hotel[0].items.push({
        city: searchStore.criteria.destination,
        qty: 1,
        hotel: hotelCopy as typeof hotelInfo,
        room: [],
      });
      // Agora, vamos encontrar os quartos correspondentes
      selectedHotel.rooms.forEach((selectedRoom) => {
        const roomInfo = hotelInfo.rooms.find((room) => room.id === selectedRoom.id);
        if (roomInfo) {
          // Adiciona o quarto encontrado ao payload
          hotelsPayloadBudget.value.items.hotel[0].items[index].room.push(roomInfo);
        }
      });
    }
  });
  // Inserindo o hotel dentro de useChoice que é uma REF que será enviada para o BACKEND
  hotelStore.userChoice.items.hotel.push(hotelsPayloadBudget.value.items.hotel[0]);
  hotelStore.createBudget(searchStore.criteria as HotelCriteria);
};
</script>

<template>
  <NuxtLayout name="search-layout">
    <section
      v-if="searchStore.hotelSelectedWithRooms.length !== 0"
      :class="[
        'fixed w-full bg-blue-800 bottom-0 z-40 flex flex-col items-center shadow-top transition-all duration-300 ease-in-out',
        sectionHeight,
      ]"
    >
      <section id="hotels" class="max-w-6xl w-full h-28 flex">
        <div id="loop-hotels" class="w-4/5 flex flex-wrap items-start p-1">
          <div class="w-1/4 p-1" v-for="(item, index) in searchStore.hotelSelectedWithRooms">
            <CardHotelFooter
              :idHotel="item.id"
              :nameHotel="item.name"
              :roomsSelectedFromHotel="item.rooms.length"
              :key="index"
            />
          </div>
        </div>
        <div class="w-1/5 pt-2">
          <button :disabled="hotelStore.isLoading" class="btn-green" @click="updatePayload()">
            <span v-if="!hotelStore.isLoading">AVANÇAR</span>
            <img v-else src="~/assets/spinner.svg" alt="" class="w-6 h-6" />
          </button>
        </div>
      </section>
    </section>
    <section class="wrapper-main" v-if="searchStore.criteria.destination !== ''">
      <header class="container-header" id="top">
        <CurrencyHeader />
        <NavBar />
        <section class="px-4"><CardFilterHotel /></section>
      </header>
      <main class="container-result">
        <!-- <BreadcumsSearchResult v-if="hotels.length > 0" /> -->
        <transition name="fade">
          <div v-if="searchStore.searchError === true" class="flex flex-col justify-center font-bold">
            <div class="my-no-results container-loading">😫 Sem hotéis no destino escolhido...</div>
            <button type="submit" class="submit-enter" @click="navigateTo('/search')">
              <Icon name="mdi:magnify" size="1.2rem" color="#ffffff" /> BUSCAR OUTRO DESTINO
            </button>
          </div>
        </transition>
        <transition name="fade">
          <div class="mt-6" v-if="searchStore.hotels === null && searchStore.searchError === false">
            <div class="container-video">
              <video autoplay loop muted style="width: 250px; height: 250px; place-self: center">
                <source src="/assets/online-travel-booking.mp4" type="video/mp4" />
              </video>
              <div class="phrases">
                <transition name="fade-text">
                  <div v-if="showText" key="text" class="fade-text">
                    {{ phrases[currentIndex] }}
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
        <div class="flex flex-row gap-6 w-full max-w-6xl" v-if="searchStore.hotels && searchStore.hotels.length > 0">
          <div class="w-72 bg-blue-50 rounded-md shadow-2xl">
            <div class="flex justify-between items-center p-4">
              <span class="text-lg font-bold text-blue-800 flex flex-row gap-2">
                <img src="/assets/filter.svg" alt="Filter" class="w-5" /> Filtros</span
              ><span class="text-xs font-bold text-emerald-500">Limpar filtros</span>
            </div>
            <div class="bg-blue-100 text-blue-800 px-4 py-2 text-xs font-bold">Valor da diária</div>
            <div>
              <div class="text-blue-800 text-xs font-bold p-4">
                de R$ {{ hotelStore.minPrice }},00 até R$ {{ hotelStore.maxPrice }},00
              </div>
              <div><SliderPrice /></div>
              <div class="flex gap-2 px-4 pb-6 mt-4">
                <div class="flex flex-col w-1/2">
                  <label for="minimun" class="text-xs font-bold text-blue-800">Mínimo</label>
                  <input
                    type="text"
                    v-model="hotelStore.rangePriceFilter[0]"
                    id="minimum"
                    class="border border-blue-800 rounded-md text-xs"
                  />
                </div>
                <div class="flex flex-col w-1/2">
                  <label for="maximun" class="text-xs font-bold text-blue-800">Máximo</label>
                  <input
                    type="text"
                    id="maximun"
                    v-model="hotelStore.rangePriceFilter[1]"
                    class="border border-blue-800 rounded-md text-xs"
                  />
                </div>
              </div>
            </div>
            <div class="bg-blue-100 text-blue-800 px-4 py-2 text-xs font-bold">Categoria</div>
            <div class="p-4 flex gap-4 flex-col">
              <div class="container-checkbox" v-for="star in [1, 2, 3, 4, 5]" :key="star">
                <input :id="`${star}-star`" type="checkbox" v-model="hotelStore.categoryFilter[star]" />
                <label :for="`${star}-star`" class="flex">
                  <StarIcon v-for="s in star" :key="s" />
                </label>
              </div>
            </div>
            <div class="bg-blue-100 text-blue-800 px-4 py-2 text-xs font-bold">Refeições</div>
            <div class="p-4 flex gap-4 flex-col">
              <div class="container-checkbox">
                <input id="with-breakfast" type="checkbox" v-model="hotelStore.breakfastFilter.withBreakfast" />
                <label for="with-breakfast" class="flex text-xs"> Com Café da Manhã</label>
              </div>
              <div class="container-checkbox">
                <input id="without-breakfast" type="checkbox" v-model="hotelStore.breakfastFilter.withoutBreakfast" />
                <label for="without-breakfast" class="flex text-xs"> Sem Café da Manhã</label>
              </div>
            </div>
            <!-- <div class="bg-blue-100 text-blue-800 px-4 py-2 text-xs font-bold">Comodidades</div>
            <div class="p-4 flex gap-4 flex-col">
              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Bar</label>
              </div>
              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Spa</label>
              </div>
              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Wi-Fi</label>
              </div>
              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Piscina</label>
              </div>
              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Kids Club</label>
              </div>

              <div class="container-checkbox">
                <input id="default-checkbox" type="checkbox" value="" />
                <label for="default-checkbox" class="flex text-xs"> Estacionamento</label>
              </div>
            </div> -->
            <div class="bg-blue-100 text-blue-800 px-4 py-2 text-xs font-bold">Nome do Hotel</div>
            <div class="p-4 w-full">
              <input
                @input="debouncedUpdate"
                placeholder="Digite o nome do hotel"
                type="text"
                id="maximun"
                class="border border-blue-800 rounded-md text-xs w-full"
              />
            </div>
          </div>
          <div class="flex-grow flex flex-col items-center" id="list-hotels">
            <CardHotel
              v-for="hotel in filteredHotels"
              :key="hotel.id"
              :id="hotel.id"
              :mainImage="hotel.mainImage"
              :name="hotel.name"
              :address="hotel.address"
              :recommended="hotel.recommended"
              :category="hotel.category"
              :breakfastIncluded="hotel.rooms[0].breakfastIncluded"
              :description="hotel.rooms[0].description"
              :currency="hotel.rooms[0].price.total.Currency"
              :price="hotel.rooms[0].price.total.Value"
              :rooms="hotel.rooms"
              v-if="hotels.length > 0"
            />
            <VueEternalLoading :load="load" v-if="searchStore.hotels && searchStore.hotels.length > 0">
              <template #loading>
                <div class="my-loading container-loading">🧐 Carregando mais hotéis...</div>
              </template>

              <template #no-more>
                <div class="my-no-more container-loading">😉 Acabou a lista de hotéis nesta cidade!</div>
              </template>

              <template #no-results>
                <div class="my-no-results container-loading">😡 Sem resultados na pesquisa...</div>
              </template>

              <template #error>
                <div class="my-error container-loading">😲 Oops. Temos um erro no scroll...</div>
              </template>
            </VueEternalLoading>
          </div>
        </div>
      </main>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.container-checkbox {
  @apply flex items-center gap-2 font-bold;
}
.shadow-top {
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.5);
}
.btn-green {
  @apply w-full h-[46px] flex justify-center items-center bg-lime-600 p-4 text-white rounded-md text-xs font-bold;
}
.container-loading {
  @apply text-2xl font-bold w-full mt-6;
}
.phrases {
  @apply text-xl font-bold flex justify-center items-center text-center px-10 h-8;
}
.container-video {
  @apply flex items-center justify-center flex-col h-full;
}
.wrapper-main {
  @apply flex flex-col pb-44;
}
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.5s ease;
}

.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}

.fade-text-enter-to,
.fade-text-leave-from {
  opacity: 1;
}
.container-header {
  @apply bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.container-result {
  @apply mt-10 w-full flex flex-col items-center gap-6 px-4;
}
</style>
