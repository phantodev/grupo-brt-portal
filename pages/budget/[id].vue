<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
const toast = useToast();
import { ListPaxes, Pax } from '../../types/SavePaxes';
import { useBudgetStore } from '../../stores/BudgetStore';
const budgetStore = useBudgetStore();
import { usePaxStore } from '../../stores/PaxStore';
const paxStore = usePaxStore();
const route = useRoute();

// Executar isso toda vez que entrar na tela
budgetStore.getBudget(route.params.id);

const totalOfBudget = ref(0);
const status = ref({});
const budgetCurrency = ref('');
const consultant = ref({});
const createdAt = ref('');
const destination = ref('');
const dates = ref([]);
const sumOfPax = ref(0);
const sumOfChildren = ref(0);
const totalPax = ref(0);

// Função para verificar se todos os pax preencheram seus campos
const areAllFieldsFilled = (pax: Pax) => Object.values(pax).every((value) => value !== '');

// Essa verifica se cada pax é diferente de STRING VAZIA para poder deixar salvar
const isEveryPaxValid = (listPaxes: ListPaxes) =>
  listPaxes.every((hotel) => hotel.rooms.every((room) => room.paxes.every(areAllFieldsFilled)));

const getTotalPaxes = (listPaxes: ListPaxes) =>
  listPaxes.reduce((acc, hotel) => acc + hotel.rooms.reduce((roomAcc, room) => roomAcc + room.paxes.length, 0), 0);

// Função que combina todas as verificações
const areAllPaxesValid = (listPaxes: ListPaxes) =>
  getTotalPaxes(listPaxes) === totalPax.value && isEveryPaxValid(listPaxes);

// Função para atualizar a store paxStore.isPaxesValid quando listPaxes muda
watch(paxStore.listPaxes, (newListPaxes) => {
  if (newListPaxes.length !== 0) {
    paxStore.isPaxesValid = areAllPaxesValid(newListPaxes as ListPaxes);
  }
});

onMounted(() => {
  // A logica abaixo verifica que a pessoa não aperto o botão BACK no navegador, pois ai o BudgetSelectedInfos já existe. Então ele SETA as props do RESUME.
  if (budgetStore && budgetStore.budgetSelectedInfos !== undefined) {
    // Pegar a quantidade de PAX no criteria
    sumOfPax.value = budgetStore.budgetSelectedInfos.criteria.hotels[0].pax.reduce(
      (acc: number, curr: number) => acc + curr,
      0
    );
    // Pegar a quantidade de CHLDREN no criteria
    sumOfChildren.value = budgetStore.budgetSelectedInfos.criteria.hotels[0].children.reduce(
      (acc: number, curr: number) => acc + curr,
      0
    );
    // Somar PAX + CRITERIA para utilizar no footer
    totalPax.value = sumOfPax.value + sumOfChildren.value;
    // Estas atualizações de RERFs manda para o CARD de RESUMO no topo da página.
    dates.value = budgetStore.budgetSelectedInfos.criteria.hotels[0].dates;
    destination.value = budgetStore.budgetSelectedInfos.criteria.hotels[0].destination;
    consultant.value = budgetStore.budgetSelectedInfos.consultant;
    createdAt.value = budgetStore.budgetSelectedInfos.created_at;
    status.value = budgetStore.budgetSelectedInfos.status;
    budgetCurrency.value = budgetStore.budgetSelectedInfos.hotels[0][0].items[0].room[0].price.total.Currency;
    const items = budgetStore.budgetSelectedInfos.hotels[0][0].items;
    totalOfBudget.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { total: { Value: number } } }) => {
          return roomAcc + roomItem.price.total.Value;
        }, 0)
      );
    }, 0);
  }
});

const sectionHeight = ref('h-16'); // altura inicial

// Essa função faz toda a verificação de itens no carrinho para poder abrir ou não o rodapé.
const toggleHeight = () => {
  if (budgetStore.hotelsToReserve.length === 0 && sectionHeight.value === 'h-16') {
    toast.error('Você precisa adicionar um quarto no carrinho antes!');
    return;
  }
  if (sectionHeight.value === 'h-16') {
    sectionHeight.value = 'h-96';
  } else {
    sectionHeight.value = 'h-16';
  }
};
// Função para verificar quando não tem itens no hotelToReserve e acionar o Toogle
watch(budgetStore.hotelsToReserve, (newValue) => {
  if (newValue.length === 0) {
    toggleHeight();
  }
});

// Este WATCH é necessário pois quando eu venho da ROTA SEARCH pela primeira vez, o BudgetSelected ta sendo modificado.
// Quando o Watch percebe que tem dados novos no BudgetSelectedInfos, ai ele manda as props para dentro do CardResumePayments
watch(
  () => budgetStore.budgetSelectedInfos,
  (newValue) => {
    // Pegar a quantidade de PAX no criteria
    sumOfPax.value = newValue.criteria.hotels[0].pax.reduce((acc: number, curr: number) => acc + curr, 0);
    // Pegar a quantidade de CHILDREN no criteria
    sumOfChildren.value = newValue.criteria.hotels[0].children.reduce((acc: number, curr: number) => acc + curr, 0);
    // Somar PAX + CRITERIA para utilizar no footer
    totalPax.value = sumOfPax.value + sumOfChildren.value;
    // Estas atualizações de RERFs manda para o CARD de RESUMO no topo da página.
    dates.value = newValue.criteria.hotels[0].dates;
    destination.value = newValue.criteria.hotels[0].destination;
    consultant.value = newValue.consultant;
    createdAt.value = newValue.created_at;
    status.value = newValue.status;
    budgetCurrency.value = newValue.hotels[0][0].items[0].room[0].price.total.Currency;
    const items = budgetStore.budgetSelectedInfos.hotels[0][0].items;
    totalOfBudget.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { total: { Value: number } } }) => {
          return roomAcc + roomItem.price.total.Value;
        }, 0)
      );
    }, 0);
    // Função para montar os PAXES e os hotelsToReserve caso PAX_FILLED for igual a 1, o que significa que já tem passageiros previamente salvos!
    if (newValue.pax_filled === 1) {
      mountListPaxesAndHotelsToReserveAfterGetBudget();
    }
    // mountListPaxesAndHotelsToReserveAfterGetBudget();
  }
);

const mountListPaxesAndHotelsToReserveAfterGetBudget = (): void => {
  const hotelsToReserve = budgetStore.budgetSelectedInfos.hotels[0][0].items.map((hotelReservado: any) => {
    return {
      id: hotelReservado.hotel.id,
      name: hotelReservado.hotel.name,
      rooms: hotelReservado.room.map((room: any) => {
        return {
          id: room.id,
          description: room.description,
        };
      }),
    };
  });
  budgetStore.hotelsToReserve = hotelsToReserve;

  // Lógica abaixo para montar novamente o ListPaxes na paxStore e aparecer nos componentes inputs.

  let newListPaxes: ListPaxes = [];

  budgetStore.budgetSelectedInfos.pax.forEach((pax: any) => {
    let hotelIndex = newListPaxes.findIndex((hotel) => hotel.hotelId === pax.hoteltId);

    if (hotelIndex === -1) {
      newListPaxes.push({
        hotelId: pax.hoteltId,
        rooms: [],
      });
      hotelIndex = newListPaxes.length - 1;
    }

    let roomIndex = newListPaxes[hotelIndex].rooms.findIndex((room) => room.roomId === pax.roomId);

    if (roomIndex === -1) {
      newListPaxes[hotelIndex].rooms.push({
        roomId: pax.roomId,
        paxes: [],
      });
      roomIndex = newListPaxes[hotelIndex].rooms.length - 1;
    }

    const [year, month, day] = pax.birthDate.split('-');
    const birthDateInverted = `${day}/${month}/${year}`;

    newListPaxes[hotelIndex].rooms[roomIndex].paxes.push({
      name: pax.name,
      lastName: pax.lastName,
      cpf: pax.cpf,
      email: pax.email,
      phone: pax.phone,
      birthDate: birthDateInverted,
      gender: pax.gender,
      room: pax.room,
    });

    paxStore.listPaxes = newListPaxes;
    paxStore.paxesPlayload.hotels = [...newListPaxes];
  });
};
</script>
<template>
  <NuxtLayout name="search-layout">
    <section class="footer-hotel-to-reserve" :class="sectionHeight">
      <section id="cart" class="wrapper-footer-cards-hotel">
        <div class="w-full flex pb-4">
          <div class="container-info-rooms">
            Quartos Selecionados:
            <span class="number-yellow">
              {{ budgetStore.hotelsToReserve.length }}
            </span>
            | Quartos Solicitados:
            <span class="number-yellow">{{ budgetStore?.budgetSelectedInfos?.criteria?.hotels[0].rooms }}</span>

            | Pax Cadastrados: <span class="number-yellow">{{ budgetStore?.budgetSelectedInfos?.pax?.length }}</span> |
            Pax Solicitados:
            <span class="number-yellow">{{ totalPax }}</span>
          </div>
          <div class="container-reserve-cart">
            <button
              v-if="budgetStore?.budgetSelectedInfos?.pax_filled === 1 || paxStore.allPaxesSaved === true"
              class="btn-green"
              @click="navigateTo(`/booking/${budgetStore.budgetSelectedInfos.id}`)"
            >
              <Icon name="bx:mail-send" size="1.2rem" color="#IE40AF" />RESERVAR
            </button>
            <button class="btn-cart" @click="toggleHeight()">
              <!-- Se sectionHeight for 'h-16' -->
              <div class="text-btn-cart" v-if="sectionHeight === 'h-16'">
                <Icon name="ph:shopping-cart" size="1.2rem" color="#IE40AF" />VER CARRINHO
              </div>

              <!-- Se sectionHeight for 'h-96' -->
              <div class="text-btn-cart" v-else-if="sectionHeight === 'h-96'">
                <Icon name="ion:chevron-down-outline" size="1.2rem" color="#IE40AF" />
                FECHAR
              </div>
            </button>
          </div>
        </div>
        <!-- O CardHotelFormCart é o componente de formulário para adicionar o PAX em cada Hotel Selecionado -->
        <CardHotelFormCart
          v-for="(item, index) in budgetStore?.hotelsToReserve"
          :key="index"
          :name="item.name"
          :roomName="item.rooms[0].description"
          :roomId="item.rooms[0].id"
          :hotelIndex="index"
          :hotelId="item.id"
        />
        <div class="text-2xl text-blue-800">BOTTOM SPACE</div>
      </section>
    </section>
    <section class="flex flex-col" v-if="budgetStore.budgetSelectedInfos !== undefined">
      <!-- Menu + Card Header -->
      <header class="container-header">
        <CurrencyHeader />
        <NavBar />
        <section class="px-4">
          <CardResumeBudget
            :totalOfBudget="totalOfBudget"
            :budgetCurrency="budgetCurrency"
            :status="status"
            :consultant="consultant"
            :createdAt="createdAt"
            :destination="destination"
            :dates="dates"
          />
        </section>
      </header>
      <main class="container-budget">
        <div class="budget">
          <!-- Informações dos Orçamento-->
          <div class="infos-budget">
            <!-- Informações da Passagem Aérea-->
            <!-- <div class="container-traveller" v-if="flights">
              <div class="card-header">
                <div class="card-container-title">
                  <div class="card-title">
                    <Icon
                      name="ph:airplane-in-flight"
                      size="1.2rem"
                      color="#114E8C"
                    />Passagem Aérea
                  </div>
                  <div class="container-action-button">
                    <Icon
                      name="material-symbols:add-circle-outline"
                      size="1rem"
                      color="#114E8C"
                    /><span class="text-action-button"> Adicionar Opções</span>
                  </div>
                </div>
              </div>
              <div class="btn-remove">
                <Icon
                  name="material-symbols:add-circle-outline"
                  size="1rem"
                  color="#991B1B"
                /><span class="text-remove-button"> Remover do orçamento</span>
              </div>
              <CardFlight />
              <div class="warning-flight">
                SOMENTE A EMISSÃO GARANTE A TARIFA!
              </div>
            </div> -->
            <!-- Informações de Hospedagem -->
            <div class="container-traveller">
              <div class="card-header">
                <div class="card-container-title">
                  <div class="card-title"><Icon name="ph:buildings" size="1.5rem" color="#1e40af" />Hospedagem</div>
                  <!-- <div class="container-action-button" @click="navigateTo('/search')">
                    <Icon name="material-symbols:add-circle-outline" size="1rem" color="#114E8C" /><span
                      class="text-action-button"
                    >
                      Adicionar Opções</span
                    >
                  </div> -->
                </div>
              </div>
              <!-- <div class="btn-remove">
                <Icon name="material-symbols:add-circle-outline" size="1rem" color="#991B1B" /><span
                  class="text-remove-button"
                >
                  Remover do orçamento</span
                >
              </div> -->
              <CardHotelBudget
                v-if="budgetStore.budgetSelectedInfos"
                v-for="(hotelArray, index) in budgetStore?.budgetSelectedInfos?.hotels?.[0]?.[0]?.items"
                :key="index"
                :room="hotelArray.room"
                :hotel="hotelArray.hotel"
                :cancelData="hotelArray.cancel_until"
                :bookingCode="hotelArray.booking_code"
              />
            </div>
          </div>
          <!-- Informações do Vendedor-->
          <!-- <div class="seller-resume-info">
            <div class="container-seller">
              <div class="seller-header">
                <div class="seller-title">Selecione o vendedor responsável</div>
              </div>
              <InputWithLabel
                placeholder="Fernando Silva"
                title="Vendedor Responsável"
              />
              <button class="btn-send-budget">
                <Icon
                  name="material-symbols:mail"
                  size="1.2rem"
                  color="#114E8C"
                />ENVIAR ORÇAMENTO
              </button>
              <button class="btn-go-payment" @click="navigateTo('/payments')">
                <Icon
                  name="material-symbols:attach-money"
                  size="1.2rem"
                  color="#ffffff"
                />CONTINUAR PARA PAGAMENTO
              </button>
            </div>
            <div class="container-resume">
              <div class="resume-header pt-10">
                <div class="resume-title">Resumo</div>
              </div>
              <div class="option">
                <CardOption />
              </div>
              <div class="logo-livelo">
                <img src="~/assets/livelo-logo.svg" alt="" />
                <span>Seu cliente pode ganhar: <strong>7321 pts</strong></span>
              </div>
            </div>
          </div> -->
        </div>
      </main>
      <!-- Lista de Observações -->
      <section class="wrapper-observations">
        <section class="container-observations">
          <h3 class="text-base"><strong>Observações</strong></h3>
          <p>
            Ao prosseguir com a reserva, o agente de viagens declara estar ciente das seguintes condições/informações:
          </p>
          <ul class="list-observations">
            <li>
              Sobre a política de cancelamento/penalidades, prazos de pagamento e demais condições de cada produto
              conforme especificado na consulta de disponibilidade ou cotização;
            </li>
            <li>
              Sobre as condições gerais pra comercialização dos produtos pela BRT Operadora conforme divulgado em área
              própria no portal de reservas;
            </li>
            <li>
              Todos os valores e informações de produtos aqui expressos, estão sujeitos a disponibilidade de lugares nas
              classes/categorias em que foram cotizados;
            </li>
            <li>
              Reservas confirmadas, somente terão seus valores e condições garantidos com o pagamento total efetivado,
              portanto, sujeito a alterações;
            </li>
            <li>
              Todos os financiamentos estão sujeitos à análise de crédito pelas instituições financeiras participantes
              do processo de pagamento e cedentes dos créditos correspondentes;
            </li>
            <li>
              Todos os valores das viagens internacionais são convertidos em reais ao câmbio do dia da cotização,
              seguindo regras da legislação fiscal brasileira e, portanto, sofrem variações diariamente e até o momento
              do pagamento final, de acordo com a variação cambial da moeda utilizada.
            </li>
            <li>
              Meios de hospedagem podem aplicar taxas que devem ser pagas localmente, portanto não incluídas nos
              orçamentos, como por exemplo: taxas de turismo, taxas de limpeza, taxas de uso de equipamentos de Resort,
              etc;
            </li>
            <li>
              O regime de alimentação (refeições) incluído na reserva está claramente especificado no voucher. Qualquer
              outra alimentação não está incluída;
            </li>
            <li>
              Imposto IRRF: Em acordo à Medida Provisória 713/16, os produtos terrestres internacionais (hotéis,
              traslados e passeios, ingressos, excursões, entre outros), poderão ser tributados em 6.38%, incidindo
              sobre o valor do produto a ser pago e garantido no exterior.
            </li>
          </ul>
        </section>
      </section>
      <!-- Rodapé -->
      <FooterInside />
    </section>
  </NuxtLayout>
</template>

<style scoped>
.wrapper-footer-cards-hotel {
  @apply max-w-6xl w-full flex flex-col;
}
.container-reserve-cart {
  @apply pt-2 flex gap-2;
}
.text-btn-cart {
  @apply flex gap-2 items-center;
}
.number-yellow {
  @apply text-yellow-300 mx-2;
}
.container-info-rooms {
  @apply flex flex-1 flex-wrap items-center font-bold text-white pt-2;
}
.footer-hotel-to-reserve {
  @apply fixed w-full bg-blue-800 bottom-0 overflow-y-auto z-40 flex flex-col items-center shadow-top transition-all duration-300 ease-in-out;
}
.shadow-top {
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.5);
}
.btn-cart {
  @apply h-[46px] flex justify-center items-center rounded-md text-xs font-bold  bg-blue-200 border-blue-200 text-blue-800 px-2 w-44;
}
.btn-green {
  @apply h-[46px] flex justify-center items-center bg-lime-600 border border-lime-600 p-4 text-white rounded-md text-xs font-bold gap-2 px-2 w-44;
}
.list-observations {
  @apply list-disc list-inside;
}
.container-observations {
  @apply text-[10px] w-full max-w-6xl flex flex-col gap-2;
}
.wrapper-observations {
  @apply flex justify-center p-4;
}
.btn-remove {
  @apply mb-4 border border-red-800 py-2 px-4 text-center w-full lg:max-w-max rounded-lg;
}
.container-seller {
  @apply flex flex-col;
}
.container-resume {
  @apply flex flex-col;
}
.resume-title {
  @apply font-bold border-b border-b-gray-200 pb-2;
}
.container-traveller {
  @apply pb-10;
}
.infos-budget {
  @apply flex-1;
}
.text-action-button {
  @apply text-xs text-blue-800 font-bold;
}
.text-remove-button {
  @apply text-xs text-red-800 font-bold;
}
.seller-title {
  @apply font-bold border-b border-b-gray-200 pb-2 mb-4;
}
.container-action-button {
  @apply flex items-center gap-2 cursor-pointer;
}
.budget {
  @apply w-full max-w-6xl flex flex-col lg:flex-row gap-6;
}
.card-title {
  @apply font-bold text-blue-800 text-lg flex gap-2 items-center;
}
.seller-resume-info {
  @apply w-full lg:w-72 flex flex-col pb-20;
}
.logo-livelo {
  @apply flex mt-10 items-center gap-4;
}
.option {
  @apply flex flex-1 flex-col mt-4;
}

.card-container-title {
  @apply flex-1 flex flex-row justify-between;
}
.card-header {
  @apply border-b border-blue-800  mb-4 pb-2 flex flex-row justify-between items-center;
}

.btn-send-budget {
  @apply flex font-bold mt-4 items-center justify-center gap-2 border border-blue-800 text-blue-800 p-2 w-full bg-white rounded-md text-xs h-12 hover:bg-sky-100 hover:text-blue-700 transition-colors duration-300;
}

.btn-go-payment {
  @apply bg-blue-800 w-full mt-4  border border-blue-800 p-4 text-white rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-900 transition-colors duration-300;
}
.container-header {
  @apply bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.container-budget {
  @apply mt-10 w-full flex flex-col md:flex-row items-center px-4 justify-center;
}
.warning-flight {
  @apply mt-4 bg-red-50 text-red-800 rounded-lg shadow-2xl p-4 font-bold text-sm text-center;
}
</style>
