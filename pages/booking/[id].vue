<script lang="ts" setup>
import { watch, onMounted, ref, computed } from 'vue';
import { useFormatCurrency } from '../../composables/useFormatCurrency';
import { useRoute } from 'vue-router';
import { IRooms } from '../../types/Hotels';
import { useBookingStore } from '../../stores/BookingStore';
const bookingStore = useBookingStore();
import useApiUrl from '@/composables/useApiUrl';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
import { useToast } from 'vue-toastification';
import axios from 'axios';
const toast = useToast();
const route = useRoute();
// Pegar o orçamento atualizado toda vez que entra nesta rota!
bookingStore.getBudget(route.params.id);
// Essa REF ajuda a controlar as divs de formas de pagamento.
const currentDiv = ref(1);
// Essas REFs passam informações para dentro do CARD do RESUME.
const totalOfBudget = ref(0);
const totalOfTaxes = ref(0);
const status = ref({ name: '', description: '' });
const budgetCurrency = ref('');
const consultant = ref({});
const createdAt = ref('');
const destination = ref('');
const dates = ref([]);
const makePayment = ref(true);
// Essa have abaixo vai me dizer que esse usuário tem LIMITE para comprar FATURADO
const hasInvoiced = ref(false);
// Essa have abaixo vai me dizer que esse usuário tem LIMITE para comprar COM CARTÃO DE CRÉDITO
const hasCredit = ref(false);

const namePayer = ref('');
const emailPayer = ref('');

// Essa REF controla se pelo menos um dos quartos é do tipo PREPAYMENT = true
const hasPrePayment = ref(false);
// Essa REF controla se pessoa clicou no "Li e aceito os termos..."
const readConditions = ref(false);
const installments = ref(1);
const maxInstallments = computed(() => {
  const calculatedInstallments = Math.floor(totalOfBudget.value / 50);
  return Math.min(calculatedInstallments, 10);
});

const showDiv = (divNumber: number) => {
  currentDiv.value = divNumber;
};

onMounted(() => {
  checkLimitsPayments();
  // A logica abaixo verifica que a pessoa não aperto o botão BACK no navegador, pois ai o BudgetSelectedInfos já existe. Então ele SETA as props do RESUME.
  if (bookingStore && bookingStore.budgetSelectedInfos !== undefined) {
    dates.value = bookingStore.budgetSelectedInfos.criteria.hotels[0].dates;
    destination.value = bookingStore.budgetSelectedInfos.criteria.hotels[0].destination;
    consultant.value = bookingStore.budgetSelectedInfos.consultant;
    createdAt.value = bookingStore.budgetSelectedInfos.created_at;
    status.value = bookingStore.budgetSelectedInfos.status;
    budgetCurrency.value = bookingStore.budgetSelectedInfos.hotels[0][0].items[0].room[0].price.total.Currency;
    const items = bookingStore.budgetSelectedInfos.hotels[0][0].items;
    totalOfBudget.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { total: { Value: number } } }) => {
          return roomAcc + roomItem.price.total.Value;
        }, 0)
      );
    }, 0);
    totalOfTaxes.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { taxes: { Value: number } } }) => {
          console.log('TAXES: ', roomItem.price.taxes.Value);
          return roomAcc + roomItem.price.taxes.Value;
        }, 0)
      );
    }, 0);
  }
});

// Este WATCH é necessário pois quando eu venho da ROTA SEARCH pela primeira vez, o BudgetSelected ta sendo modificado.
// Quando o Watch percebe que tem dados novos no BudgetSelectedInfos, ai ele manda as props para dentro do CardResumePayments
watch(
  () => bookingStore.budgetSelectedInfos,
  (newValue) => {
    // Aqui eu verifico se pelo menos um dos items tem um quarto com a opção prePayment = true para esconder o botão RESERVAR SEM PAGAR
    hasPrePayment.value = newValue.hotels[0][0].items.some((item: any) => {
      return item.room.some((room: IRooms) => room.prePayment === true);
    });

    // Quando o getBudget() é chamado pela primeira vez nesta rota, eu preciso verificar se o total de hospedes salvos é o mesmo de total de hospedes escolhidos no CRITERIA do SEARCH.
    const sumOfPax = newValue.criteria.hotels[0].pax.reduce((acc: number, curr: number) => acc + curr, 0);
    const sumOfChildren = newValue.criteria.hotels[0].children.reduce((acc: number, curr: number) => acc + curr, 0);
    const totalPax = sumOfPax + sumOfChildren;
    const totalPaxSavedWithInfos = newValue.pax.length; // Verifica quantos passageiros estão com os dados completos no Orçamento.
    // Se a quantidade de passageiros solicitados no orçamento (Pegamos estes dados dentro do CRITERIA) for maior que a quantidade dos PAX com dados completos salvos no orçamento
    // Vou redirecionar para a tela de ORÇAMENTO novamente até ele completar dados dos PAX.
    if (totalPaxSavedWithInfos < totalPax) {
      toast.error('Você precisa gravar todos os nomes dos hóspedes antes!', {
        onClose: () => {
          navigateTo(`/budget/${route.params.id}`);
        },
      });
    }
    // Se os hóspedes já estão todos preenchidos, basta eu pegar os dados do BudgetSelectedInfos e passar como props para o CardResumoPayments
    dates.value = newValue.criteria.hotels[0].dates;
    destination.value = newValue.criteria.hotels[0].destination;
    consultant.value = newValue.consultant;
    createdAt.value = newValue.created_at;
    status.value = newValue.status;
    budgetCurrency.value = newValue.hotels[0][0].items[0].room[0].price.total.Currency;
    const items = bookingStore.budgetSelectedInfos.hotels[0][0].items;
    totalOfBudget.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { total: { Value: number } } }) => {
          return roomAcc + roomItem.price.total.Value;
        }, 0)
      );
    }, 0);
    totalOfTaxes.value = items.reduce((acc: any, item: { room: any[] }) => {
      return (
        acc +
        item.room.reduce((roomAcc: any, roomItem: { price: { taxes: { Value: number } } }) => {
          console.log('TAXES: ', roomItem.price.taxes.Value);
          return roomAcc + roomItem.price.taxes.Value;
        }, 0)
      );
    }, 0);
  }
);

// Essa função faz uma checagem para verificar se o usuário do sistema possui crédito para pagar faturado ou com cartão de crédito
const checkLimitsPayments = async () => {
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  makePayment.value = true;
  try {
    const axiosPayload = {
      agency_cnpj: authLocalStore.cnpjTenant,
      value: 50000.0,
    };
    const { data } = await axios.post(`${apiUrl}/api/v1/calculate-limit`, axiosPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authLocalStore.token}`,
      },
    });
    if (data) {
      console.log('LIMITE DESTE TENANT: ', data);
    }
  } catch (error) {
    console.error('Erro na chamada da API:', error);
  }
};

// Essa função faz uma checagem para verificar se o usuário do sistema possui crédito para pagar faturado ou com cartão de crédito
const handlePayment = async (type: string): Promise<void> => {
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  const token = authLocalStore.token;
  try {
    const axiosPayload = {
      budgetId: route.params.id,
      totalPrice: Math.round(totalOfBudget.value * 100) / 100,
      rav: 0,
      installments: installments.value,
      installmentPrice: Math.ceil((totalOfBudget.value / installments.value) * 100) / 100,
      paymentType: type,
      client: {
        name: namePayer.value,
        email: emailPayer.value,
      },
    };
    const { data } = await axios.post(`${apiUrl}/api/v1/payment/new`, axiosPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.paymentType === 'pay_pix') {
      console.log('Entrou NO PIX!');
      navigateTo(data.paymentReference.request.url, {
        external: true,
        open: {
          target: '_blank',
        },
      });
    } else if (data.paymentType === 'pay_credit') {
      navigateTo(data.urlPayment, {
        external: true,
        open: {
          target: '_blank',
        },
      });
    }
  } catch (error) {
    console.error('Erro na chamada da API:', error);
  }
};
</script>

<template>
  <NuxtLayout name="search-layout">
    <section class="flex flex-col" v-if="bookingStore.budgetSelectedInfos !== undefined">
      <!-- Menu + Card Header -->
      <header class="container-header">
        <CurrencyHeader />
        <NavBar />
        <section class="px-4" v-if="bookingStore.budgetSelectedInfos">
          <CardResumeBooking
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
          <!-- Informações do Pagamento-->
          <div class="infos-payment">
            <!-- Informações dos Hotéis de Quartos-->
            <div class="card-header">
              <div class="card-container-title">
                <div class="card-title">
                  <Icon name="material-symbols:hotel-outline" size="1.5rem" color="#114E8C" />Resumo dos Hotéis Orçados
                </div>
              </div>
            </div>
            <CardHotelBooking
              v-for="(items, index) in bookingStore?.budgetSelectedInfos?.hotels[0][0]?.items"
              :key="index"
              :items="items"
              :cancelData="items.cancel_until"
              :bookingCode="items.booking_code"
              :status="status"
              :hotelIndex="index"
            />
            <div class="container-payment">
              <div class="card-header">
                <div class="card-container-title">
                  <div class="card-title-booking">
                    <Icon name="material-symbols:attach-money" size="1.2rem" color="#114E8C" />
                    <span> Regras de Reserva</span>
                  </div>
                  <div class="text-sm pl-1" v-if="status.name !== 'cancelled'">
                    <strong>1 - Reserva em prazo de Cancelamento ou Não Reembolsável:</strong> Esta reserva já está
                    *dentro do prazo de pagamento* ou *não é reembolsável*. Caso seja *cancelada* ou *alterada* será
                    cobrada uma multa de 100% do valor da reserva conforme política de cancelamento.
                  </div>
                  <div class="items-center text-sm gap-1 pl-1" v-if="status.name !== 'cancelled'">
                    <strong>2 -</strong>
                    <span class="text-blue-800 underline font-bold" @click="bookingStore.sideBarOpen = true">
                      Condições Gerais de Reserva
                    </span>
                    e pagamento constantes neste portal bem como as Condições Específicas de cancelamento.
                  </div>
                  <div class="flex items-center text-sm gap-2" v-if="status.name !== 'cancelled'">
                    <input id="default-checkbox" type="checkbox" v-model="readConditions" />
                    Li e Concordo com todas as Regras de Reserva
                  </div>
                  <div>
                    <div class="card-title-taxes">
                      <Icon name="material-symbols:attach-money" size="1.5rem" color="#114E8C" />
                      <span> Total de taxas:</span>
                      <span class="text-lime-600">{{ budgetCurrency + ' ' + useFormatCurrency(totalOfTaxes) }}</span>
                    </div>
                    <div class="card-title">
                      <Icon name="material-symbols:attach-money" size="1.5rem" color="#114E8C" />
                      <span> Total à pagar:</span>
                      <span class="text-lime-600">{{ budgetCurrency + ' ' + useFormatCurrency(totalOfBudget) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="text-lg font-bold text-blue-800 flex items-center gap-10 mb-6">
                Aplicar RAV?
                <SliderRAV />
              </div> -->
              <div v-if="status.name !== 'cancelled'">
                <div class="container-button-payments" v-if="makePayment">
                  <button
                    :class="currentDiv === 1 ? 'btn-primary' : 'btn-secondary'"
                    class="flex-1"
                    @click="showDiv(1)"
                  >
                    À VISTA (PIX)
                  </button>
                  <button
                    :class="currentDiv === 2 ? 'btn-primary' : 'btn-secondary'"
                    class="flex-1"
                    @click="showDiv(2)"
                  >
                    FATURADO
                  </button>
                  <!-- <button :class="currentDiv === 2 ? 'btn-primary' : 'btn-secondary'" class="flex-1" @click="showDiv(2)">
                  ENTRADA DE 12% + CARTÃO ATÉ 10X
                </button> -->
                  <button
                    :class="currentDiv === 3 ? 'btn-primary' : 'btn-secondary'"
                    class="flex-1"
                    @click="showDiv(3)"
                  >
                    CARTÃO DE CRÉDITO
                  </button>
                </div>

                <div class="my-6" v-if="currentDiv === 1">
                  <p class="font-bold">
                    Valor para PIX:
                    <span class="text-lime-600">{{ budgetCurrency + ' ' + useFormatCurrency(totalOfBudget) }}</span>
                  </p>
                  <p class="text-[10px] md:text-xs mt-2">
                    *Valor líquido, com desconto do comissionamento já aplicado O Pagamento deve ser realizado até as
                    23h de hoje, ou a reserva será cancelada.
                  </p>
                  <div class="flex flex-col gap-2">
                    <div>Preencha o nome e o e-mail de quem vai receber o LINK do PIX e o recibo de pagamento!</div>
                    <div class="flex gap-4 w-full">
                      <div class="w-full pt-4">
                        <label for="namePayer" class="block text-sm font-medium text-gray-700"> Nome do Pagador </label>
                        <div class="mt-1">
                          <input
                            type="text"
                            name="namePayer"
                            v-model="namePayer"
                            class="shadow-sm block w-full sm:text-sm rounded-md"
                          />
                        </div>
                      </div>
                      <div class="w-full pt-4">
                        <label for="emailPayer" class="block text-sm font-medium text-gray-700">
                          E-mail do Pagador
                        </label>
                        <div class="mt-1">
                          <input
                            type="text"
                            name="emailPayer"
                            v-model="emailPayer"
                            class="shadow-sm block w-full sm:text-sm rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-4 mb-6 mt-6">
                    <button
                      :disabled="hasPrePayment || bookingStore.isBooking"
                      v-if="!hasPrePayment"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold flex justify-center"
                      @click="bookingStore.createBook"
                    >
                      <span v-if="!bookingStore.isBooking">RESERVAR SEM PAGAR</span>
                      <img v-else src="~/assets/spinner.svg" alt="" class="w-6 h-6" />
                    </button>
                    <button
                      @click="handlePayment('pay_pix')"
                      :disabled="!readConditions"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold"
                    >
                      ABRIR LINK DO PIX
                    </button>
                  </div>
                </div>
                <div class="my-6" v-if="currentDiv === 2">
                  <p class="font-bold">Valor pago através de FATURAMENTO</p>
                  <p class="text-sm mt-4"><strong> Seu total de crédito é:</strong> R$ 15.000,00</p>
                  <p class="text-sm mt-2"><strong>Seu total de crédito após pagamento:</strong> R$ 14.560,00</p>
                  <div class="flex gap-4 mt-6">
                    <button
                      :disabled="hasPrePayment || bookingStore.isBooking"
                      v-if="!hasPrePayment"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold"
                      @click="bookingStore.createBook"
                    >
                      <span v-if="!bookingStore.isBooking">RESERVAR SEM PAGAR</span>
                      <img v-else src="~/assets/spinner.svg" alt="" class="w-6 h-6" />
                    </button>
                    <button
                      @click="handlePayment('pay_credit')"
                      :disabled="!readConditions"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold"
                    >
                      PAGAR COM CRÉDITO FATURADO
                    </button>
                  </div>
                </div>
                <!-- <div class="my-6" v-else-if="currentDiv === 2">
                <p class="font-bold">Entrada mínima 12% + Saldo no Cartão em Até 10x</p>
                <p class="text-[10px] md:text-xs mt-2">
                  O valor da comissão da agência será descontado do valor da entrada.
                </p>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <InputWithLabel
                    iconName="material-symbols:attach-money"
                    placeholder="2.233,00"
                    title="Valor de Entrada"
                  />
                  <InputWithLabel
                    iconName="octicon:credit-card"
                    placeholder="16.726,13"
                    title="Valor a pagar no cartão"
                  />
                  <InputWithLabel iconName="uil:multiply" placeholder="1x16.762,13" title="Parcela" />
                  <InputWithLabel
                    iconName="ph:envelope-light"
                    placeholder="lorem@lorem.com"
                    title="E-mail para envio do link de pagamento"
                  />
                </div>
              </div> -->
                <!-- Segment Credit Card -->
                <div class="sgment-credit-card" v-else-if="currentDiv === 3">
                  <div class="flags-credit-card">
                    <p><strong> Aceitamos as bandeiras: </strong></p>
                    <img src="~/assets/cartoes.png" class="w-60" alt="" />
                  </div>
                  <div class="text-about-comission">
                    O valor da comissão da agência será descontado do valor da entrada.
                  </div>

                  <div class="wrapper-credit-card">
                    <div class="container-credit-card" v-for="(n, index) in maxInstallments">
                      <input
                        :id="'radio' + index"
                        :value="index + 1"
                        v-model="installments"
                        type="radio"
                        class="focus:ring-0"
                      />
                      <span v-if="index === 0">À vista (1x de R$ {{ useFormatCurrency(totalOfBudget) }})</span>
                      <span v-else>{{ index + 1 }} x de R$ {{ useFormatCurrency(totalOfBudget / (index + 1)) }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div>Preencha o nome e o e-mail de quem vai receber o LINK para o pagamento!</div>
                    <div class="flex gap-4 w-full">
                      <div class="w-full pt-4">
                        <label for="namePayer" class="block text-sm font-medium text-gray-700"> Nome do Pagador </label>
                        <div class="mt-1">
                          <input
                            type="text"
                            name="namePayer"
                            v-model="namePayer"
                            class="shadow-sm block w-full sm:text-sm rounded-md"
                          />
                        </div>
                      </div>
                      <div class="w-full pt-4">
                        <label for="emailPayer" class="block text-sm font-medium text-gray-700">
                          E-mail do Pagador
                        </label>
                        <div class="mt-1">
                          <input
                            type="text"
                            name="emailPayer"
                            v-model="emailPayer"
                            class="shadow-sm block w-full sm:text-sm rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-4 mt-6">
                    <button
                      :disabled="hasPrePayment || bookingStore.isBooking"
                      v-if="!hasPrePayment"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold"
                      @click="bookingStore.createBook"
                    >
                      <span v-if="!bookingStore.isBooking">RESERVAR SEM PAGAR</span>
                      <img v-else src="~/assets/spinner.svg" alt="" class="w-6 h-6" />
                    </button>
                    <button
                      @click="handlePayment('pay_credit')"
                      :disabled="!readConditions"
                      :class="readConditions ? 'bg-lime-600' : 'bg-gray-300'"
                      class="p-4 text-white w-full rounded-lg font-bold"
                    >
                      PAGAR COM CARTÃO DE CRÉDITO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
.container-general-terms {
  @apply flex flex-col gap-2 mr-4;
}
.wrapper-general-terms {
  @apply w-full h-60 overflow-auto bg-gray-200 p-4 text-[10px];
}
h4 {
  @apply font-bold;
}
.flags-credit-card {
  @apply flex flex-col md:flex-row items-center mt-6 md:mt-0;
}
.text-about-comission {
  @apply text-xs flex text-center md:text-left px-6 md:px-0 pb-4;
}
.wrapper-credit-card {
  @apply w-full flex flex-wrap p-4 gap-2;
}
.container-credit-card {
  @apply text-xs w-60 flex gap-2 pb-2 font-bold;
}
.container-button-payments {
  @apply w-full flex flex-col md:flex-row gap-4;
}
.btn-primary {
  @apply bg-blue-800 justify-center flex-grow border border-blue-800 p-4 text-white rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-900 transition-colors duration-300 flex items-center;
}
.btn-secondary {
  @apply bg-white flex-grow justify-center border border-blue-800 p-4 text-blue-800 rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-900 transition-colors duration-300 flex items-center;
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
  @apply w-full bg-blue-100 p-6 flex flex-col gap-4 font-semibold;
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

.wrapper-price {
  @apply flex flex-col;
}
.container-resume {
  @apply flex flex-col;
}
.resume-title {
  @apply font-bold border-b border-b-gray-200 pb-2;
}
.container-payment {
  @apply pb-10 mt-10;
}
.infos-payment {
  @apply flex-1;
}
.budget {
  @apply w-full max-w-6xl flex flex-col lg:flex-row gap-6;
}
.card-title-taxes {
  @apply font-bold text-blue-800 text-xl flex gap-2 items-center;
}
.card-title {
  @apply font-bold text-blue-800 text-2xl flex gap-2 items-center;
}
.card-title-booking {
  @apply font-bold text-blue-800 text-base flex gap-2 items-center border-b border-blue-800;
}
.container-price-resume {
  @apply w-full lg:w-72 flex flex-col pb-20;
}
.logo-livelo {
  @apply flex mt-10 items-center gap-4;
}
.option {
  @apply flex flex-1 flex-col mt-4;
}

.card-container-title {
  @apply flex-1 flex flex-col gap-4 justify-between;
}
.card-header {
  @apply border-b border-blue-800  mb-4 pb-2 flex flex-row justify-between items-center;
}

.container-featured-text-over-search {
  @apply flex gap-4 flex-col items-center p-4 lg:p-10 text-white;
}
.featured-text-over-search {
  @apply max-w-xl text-center text-xs md:text-base;
}

.container-header {
  @apply bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.container-budget {
  @apply mt-10 w-full flex flex-col md:flex-row items-center px-4 justify-center;
}
</style>
