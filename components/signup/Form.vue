<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { IForm } from '~/types/Signup';
const toast = useToast();

const updateBankId = (newBankId: any) => {
  form.bank.bank_id = newBankId;
};

// AQUI É A FUNÇÃO PARA POPULAR O ESTIMATE SALES

const estimateSales = ref([]);

const getEstimateSales = async () => {
  try {
    const response = await axios.get('https://back.brtoperadora.com.br/api/v1/estimate-sales/pluck');
    estimateSales.value = response.data;
  } catch (error) {
    console.log('Erro ao enviar dados:', error);
    toast.error('API do ESTIMATE SALES fora do ar, entre em contato com a BRT!');
  }
};

// AQUI FINALIZA A FUNÇÃO PARA POPULAR O ESTIMATE SALES

// AQUI É A FUNÇÃO PARA POPULAR O HOW YOU MEET BRT

const howMeet = ref([]);

const getHowMeet = async () => {
  try {
    const response = await axios.get('https://back.brtoperadora.com.br/api/v1/how-agency-meet-brt/pluck');
    howMeet.value = response.data;
  } catch (error) {
    console.log('Erro ao enviar dados:', error);
    toast.error('API do HOW YOU MEET fora do ar, entre em contato com a BRT!');
  }
};

// AQUI FINALIZA A FUNÇÃO PARA POPULAR O HOW YOU MEET
// AQUI É A FUNÇÃO PARA POPULAR O SEGMENTS

const segments = ref([]);

const getSegments = async () => {
  try {
    const response = await axios.get('https://back.brtoperadora.com.br/api/v1/agency-segments/pluck');
    segments.value = response.data;
  } catch (error) {
    console.log('Erro ao enviar dados:', error);
    toast.error('API do SEGMENTS fora do ar, entre em contato com a BRT!');
  }
};

// CHAMANDO AS FUNÇÕES PARA POPULAR OS DROPDOWNS
onMounted(async () => {
  getEstimateSales();
  getHowMeet();
  getSegments();
});

// AQUI FINALIZA A FUNÇÃO PARA POPULAR O HOW YOU MEET

const form = reactive<IForm>({
  address: {
    city_id: 92,
    street: '',
    street_add: '',
    district: '',
    zipcode: '',
    state_id: 27,
    number: '1',
    street_number: '',
  },
  agency: {
    estimate_sales: 1,
    segment: 1,
    cellphone: '',
    corporate_name: '',
    cpf_cnpj: '',
    privacy_policy_accept: false,
    site: '',
    name: '',
    phone: '',
  },
  user: {
    cpf: '',
    password_confirmation: '',
    email_marketing_accept: false,
    email: '',
    password: '',
    how_did_you_meet: 8,
    name: '',
  },
  bank: {
    account_digit: '',
    bank_id: 0,
    client_name: '',
    account_number: '',
    account_type: '',
    agency: '',
    billing_email: '',
  },
});

const docs = {
  contract: [] as File[],
  address: [] as File[],
  rg: [] as File[],
};

const docsRg = ref<File[]>([]);
const docsAddress = ref<File[]>([]);
const docsContract = ref<File[]>([]);

let debounceTimer: NodeJS.Timeout;

const checkCEP = async () => {
  // Limpa o timer existente, se houver
  clearTimeout(debounceTimer);

  // Inicia um novo timer
  debounceTimer = setTimeout(async () => {
    if (form.address.zipcode.length === 9) {
      const cep = form.address.zipcode.replace('-', '');
      try {
        const response = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro === true) {
          toast.error('Nenhum CEP encontrado. Digite novamente!');
          form.address.zipcode = '';
          const element = document.getElementById('agency-zipcode');
          if (element) {
            element.focus();
          }
          return;
        }
        form.address.street = response.data.logradouro;
        form.address.district = response.data.bairro;
      } catch (error) {
        console.log('Erro ao enviar dados:', error);
        toast.error('API do CEP fora do ar, entre em contato com a BRT!');
      }
    }
  }, 300); // 300 milissegundos de espera
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    const name = target.name;

    switch (name) {
      case 'docsRg':
        docsRg.value.push(...files);
        docs.rg = docsRg.value;
        break;
      case 'docsAddress':
        0;
        docsAddress.value.push(...files);
        docs.address = docsRg.value;
        break;
      case 'docsContract':
        docsContract.value.push(...files);
        docs.contract = docsRg.value;
        break;
    }
  }
};
const removeFile = (fileToRemove: any, listName: any) => {
  let list;
  switch (listName) {
    case 'docsRg':
      list = docs.rg;
      break;
    case 'docsAddress':
      list = docs.address;
      break;
    case 'docsContract':
      list = docs.contract;
      break;
  }
  if (list) {
    const index = list.indexOf(fileToRemove);
    if (index > -1) {
      list.splice(index, 1);
    }
  }
};

const submitForm = async () => {
  const formJson = JSON.stringify(form);
  const teste = new FormData();
  teste.append('form', formJson);

  docs.rg.forEach((file, index) => {
    teste.append(`rg`, file);
  });
  docs.address.forEach((file, index) => {
    teste.append(`address`, file);
  });
  docs.contract.forEach((file, index) => {
    teste.append(`contract`, file);
  });

  // const { data, error } = await useFetch('https://back.brtoperadora.com.br/api/v1/client/create', {
  //   method: 'POST',
  //   body: teste,
  // });

  try {
    const { data } = await axios.post('https://back.brtoperadora.com.br/api/v1/client/create', teste);
    if (data.success === true) {
      toast.success('Cadastro efetuado com sucesso!', {
        onClose: () => {
          navigateTo('/login');
        },
      });
    }
  } catch (error) {
    console.log(error);
    toast.error('Você possui campos inválidos!');
  }
};

// ESSA CONTS ABAIXO DIZ QUAIS DOS CAMPOS SÃO OPCIONAIS

const optionalFields = ['street_add', 'phone', 'site'];
const passwordDifferent = ref(false);

// FUNÇÃO PARA VERIFICAR SE TODOS OS CAMPOS FORAM PREENCHIDOS

const isFormEmpty = computed(() => {
  const isFormDataEmpty = Object.entries(form).some(([key, subObj]) =>
    Object.entries(subObj).some(([fieldKey, fieldVal]) => fieldVal === '' && !optionalFields.includes(fieldKey))
  );

  const isDocsEmpty = Object.values(docs).some((docArray) => docArray.length === 0);

  const isPrivacyPolicyNotAccepted = !form.agency.privacy_policy_accept;

  const isNameShort = form.agency.name.length < 3;
  const isCorporateNameShort = form.agency.corporate_name.length < 5;
  const isPasswordShort = form.user.password.length < 6;
  const isPasswordEqualConfirmation = form.user.password === form.user.password_confirmation;

  return (
    isFormDataEmpty ||
    isDocsEmpty ||
    isPrivacyPolicyNotAccepted ||
    isNameShort ||
    isCorporateNameShort ||
    isPasswordShort ||
    !isPasswordEqualConfirmation // note o sinal de negação
  );
});

const showMinLengthWarning = reactive({
  name: false,
  corporate_name: false,
  password: false,
  password_confirmation: false,
});

const checkMinLength = (field: string, minLength: number) => {
  switch (field) {
    case 'name':
      showMinLengthWarning.name = form.agency.name.length < minLength;
      break;
    case 'corporate_name':
      showMinLengthWarning.corporate_name = form.agency.corporate_name.length < minLength;
      break;
    case 'password':
      showMinLengthWarning.password = form.user.password.length < minLength;
      break;
    case 'password_confirmation':
      showMinLengthWarning.password_confirmation = form.user.password_confirmation.length < minLength;
      passwordDifferent.value = form.user.password !== form.user.password_confirmation;
      break;
    default:
      break;
  }
};
</script>
<template>
  <form class="space-y-8 divide-y divide-gray-200">
    <div class="space-y-8 divide-y divide-gray-200">
      <div>
        <div>
          <h3 class="text-2xl font-bold leading-6">Cadastre sua Agência</h3>
          <p class="mt-6 text-sm text-gray-500">
            Que bom ter você aqui ♥ Pedimos a gentileza de preencher todos os campos abaixo. Após receber os seus
            dados, o nosso time entrará em contato via e-mail para te posicionar sobre o andamento da etapa de cadastro!
          </p>
        </div>
      </div>

      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-bold">Dados da empresa</h3>
          <p class="mt-1 text-sm text-gray-500">Preencha os dados da empresa corretamente.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="company-name" class="block text-sm font-medium text-gray-700"> Razão Social </label>
            <div class="mt-1">
              <input
                type="text"
                name="company-name"
                id="company-name"
                v-model="form.agency.corporate_name"
                @blur="checkMinLength('corporate_name', 5)"
                :class="[
                  'shadow-sm block w-full sm:text-sm rounded-md',
                  showMinLengthWarning['corporate_name'] ? 'border-red-600' : 'focus:border-indigo-500 border-gray-300',
                ]"
              />
              <div v-if="showMinLengthWarning['corporate_name']" class="text-[10px] mt-1 ml-1 text-red-600">
                Este campo precisa ter no mínimo 5 caracteres.
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> Nome Fantasia </label>
            <div class="mt-1">
              <input
                type="text"
                name="last-name"
                id="last-name"
                v-model="form.agency.name"
                @blur="checkMinLength('name', 3)"
                :class="[
                  'shadow-sm block w-full sm:text-sm rounded-md',
                  showMinLengthWarning['name'] ? 'border-red-600' : 'focus:border-indigo-500 border-gray-300',
                ]"
              />
              <div v-if="showMinLengthWarning['name']" class="text-[10px] mt-1 ml-1 text-red-600">
                Este campo precisa ter no mínimo 3 caracteres.
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="cnpj" class="block text-sm font-medium text-gray-700"> CNPJ </label>
            <div class="mt-1">
              <input
                type="text"
                name="cnpj"
                v-maska
                data-maska="##.###.###/####-##"
                id="cnpj"
                v-model="form.agency.cpf_cnpj"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> Website </label>
            <div class="mt-1">
              <input
                type="text"
                name="website"
                id="website"
                v-model="form.agency.site"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700"> Telefone Fixo </label>
            <div class="mt-1">
              <input
                type="text"
                name="agency-phone"
                id="agency-phone"
                v-model="form.agency.phone"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> Telefone Celular </label>
            <div class="mt-1">
              <input
                type="text"
                v-maska
                data-maska="(##) #####-####"
                name="agency-cellphone"
                id="agency-cellphone"
                v-model="form.agency.cellphone"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="block text-sm font-medium text-gray-700"> CEP </label>
            <div class="mt-1">
              <input
                type="text"
                v-maska
                data-maska="#####-###"
                name="agency-zipcode"
                id="agency-zipcode"
                v-model="form.address.zipcode"
                @input="checkCEP"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="street-address" class="block text-sm font-medium text-gray-700"> Logradouro </label>
            <div class="mt-1">
              <input
                type="text"
                name="street-address"
                id="street-address"
                readonly
                v-model="form.address.street"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="street-add" class="block text-sm font-medium text-gray-700"> Complemento </label>
            <div class="mt-1">
              <input
                type="text"
                name="street-add"
                id="street-add"
                v-model="form.address.street_add"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="number" class="block text-sm font-medium text-gray-700"> Número </label>
            <div class="mt-1">
              <input
                type="text"
                name="number"
                id="number"
                v-model="form.address.street_number"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="district" class="block text-sm font-medium text-gray-700"> Bairro </label>
            <div class="mt-1">
              <input
                type="text"
                name="district"
                readonly
                id="district"
                v-model="form.address.district"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="region" class="block text-sm font-medium text-gray-700"> Cidade </label>
            <div class="mt-1">
              <input
                type="text"
                name="city"
                id="city"
                readonly
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="postal-code" class="block text-sm font-medium text-gray-700"> Estado </label>
            <div class="mt-1">
              <input
                type="text"
                name="state"
                id="state"
                readonly
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-bold">Dados Bancários</h3>
          <p class="mt-1 text-sm text-gray-500">Preencha os dados da empresa corretamente.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <label for="bank" class="block text-sm font-medium text-gray-700"> Banco </label>
            <div class="mt-1">
              <AutocompletBanks :bankId="form.bank.bank_id" @update:bankId="updateBankId" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> Agência </label>
            <div class="mt-1">
              <input
                type="text"
                name="bank-agency"
                id="bank-agency"
                v-maska
                data-maska="#######"
                v-model="form.bank.agency"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="account-number" class="block text-sm font-medium text-gray-700"> Conta Corrente </label>
            <div class="mt-1">
              <input
                type="text"
                name="account-number"
                id="account-number"
                v-maska
                data-maska="##########"
                v-model="form.bank.account_number"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> Digito </label>
            <div class="mt-1">
              <input
                type="text"
                name="account-digit"
                id="account-digit"
                v-maska
                data-maska="#"
                v-model="form.bank.account_digit"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="client-name" class="block text-sm font-medium text-gray-700"> Favorecido </label>
            <div class="mt-1">
              <input
                type="text"
                name="client-name"
                id="client-name"
                v-model="form.bank.client_name"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="billig-email" class="block text-sm font-medium text-gray-700"> E-mail da fatura </label>
            <div class="mt-1">
              <input
                type="text"
                name="billing-email"
                id="billing-email"
                v-model="form.bank.billing_email"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="block text-sm font-medium text-gray-700"> Tipo de Conta </label>
            <div class="mt-1">
              <select
                id="type-account"
                name="type-account"
                v-model="form.bank.account_type"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="Pessoa Física">Presso Física</option>
                <option value="Pessoa Júridica">Pessoa Júridica</option>
              </select>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="street-address" class="block text-sm font-medium text-gray-700">
              Estimativa de Vendas Mensais
            </label>
            <div class="mt-1" v-if="estimateSales && estimateSales.length > 0">
              <select
                id="agency-estimates"
                name="agency-estimates"
                v-model="form.agency.estimate_sales"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option v-for="sales in estimateSales as any" :key="sales.id" :value="sales.id">
                  {{ sales.estimate }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-bold">Dados do Representante Legal</h3>
          <p class="mt-1 text-sm text-gray-500">Preencha os dados da empresa corretamente.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <label for="first-name" class="block text-sm font-medium text-gray-700"> Nome Completo </label>
            <div class="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                v-model="form.user.name"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-6">
            <label for="email" class="block text-sm font-medium text-gray-700"> E-mail Completo </label>
            <div class="mt-1">
              <input
                type="text"
                name="email"
                id="email"
                v-model="form.user.email"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="last-name" class="block text-sm font-medium text-gray-700"> CPF </label>
            <div class="mt-1">
              <input
                type="text"
                name="cpf"
                id="cpf"
                v-model="form.user.cpf"
                v-maska
                data-maska="###.###.###-##"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700"> Senha </label>
            <div class="mt-1">
              <input
                type="password"
                name="password"
                id="password"
                v-model="form.user.password"
                @blur="checkMinLength('password', 6)"
                :class="[
                  'shadow-sm block w-full sm:text-sm rounded-md',
                  showMinLengthWarning['password'] || passwordDifferent
                    ? 'border-red-600'
                    : 'focus:border-indigo-500 border-gray-300',
                ]"
              />
              <div v-if="showMinLengthWarning['password']" class="text-[10px] mt-1 ml-1 text-red-600">
                Senha com no mínimo 6 caracteres.
              </div>
              <div v-if="passwordDifferent" class="text-[10px] mt-1 ml-1 text-red-600">Senhas diferentes!</div>
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700"> Redigite a Senha </label>
            <div class="mt-1">
              <input
                type="password"
                name="password-re"
                id="password-re"
                @blur="checkMinLength('password_confirmation', 6)"
                v-model="form.user.password_confirmation"
                :class="[
                  'shadow-sm block w-full sm:text-sm rounded-md',
                  showMinLengthWarning['password'] || passwordDifferent
                    ? 'border-red-600'
                    : 'focus:border-indigo-500 border-gray-300',
                ]"
              />
              <div v-if="showMinLengthWarning['password_confirmation']" class="text-[10px] mt-1 ml-1 text-red-600">
                Senha com no mínimo 6 caracteres.
              </div>
              <div v-if="passwordDifferent" class="text-[10px] mt-1 ml-1 text-red-600">Senhas diferentes!</div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="block text-sm font-medium text-gray-700"> Como conheceu a BRT? </label>
            <div class="mt-1" v-if="howMeet && howMeet.length > 0">
              <select
                id="how-meet"
                name="how-meet"
                v-model="form.user.how_did_you_meet"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option v-for="meet in howMeet as any" :key="meet.id" :value="meet.id">
                  {{ meet.how }}
                </option>
              </select>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="street-address" class="block text-sm font-medium text-gray-700">
              Segmento da sua agência
            </label>
            <div class="mt-1" v-if="segments && segments.length > 0">
              <select
                id="segment"
                name="segment"
                v-model="form.agency.segment"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option v-for="segment in segments as any" :key="segment.id" :value="segment.id">
                  {{ segment.segment }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-bold">Envio de Documentos</h3>
          <p class="mt-1 text-sm text-gray-500">Envie documentos legíveis e recentes</p>
        </div>
        <div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-bold mt-4">
            Anexo do Contrato Social ou Certificado de MEI
            <p class="text-xs font-medium">*Enviar o contrato social com a última alteração contratual realizada.</p>
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="social-contract"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-0"
                >
                  <span>Escolha um arquivo</span>
                  <input
                    id="social-contract"
                    name="docsContract"
                    type="file"
                    class="sr-only"
                    @change="handleFileChange"
                  />
                </label>
                <p class="pl-1">ou drag e drop</p>
              </div>
              <p class="text-xs text-gray-500">PDF no máximo de 10MB</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div v-for="file in docsContract" :key="'contract-' + (file as any).name" class="mt-4">
              <span class="badge bg-blue-100 px-4 py-1 rounded-full text-xs flex items-center gap-3">
                {{ (file as any).name }}
                <button @click="removeFile(file, 'docsContract')">
                  <Icon name="ic:round-close" size="1.2rem" color="#IE40AF" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-bold mt-4">
            Comprovante de Endereço da Agência ou dos Sócios
            <p class="text-xs font-medium">*Data de vencimento com no máximo 3 meses antecedentes ao mês atual.</p>
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="proof-address"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-0"
                >
                  <span>Escolha um arquivo</span>
                  <input id="proof-address" name="docsAddress" type="file" class="sr-only" @change="handleFileChange" />
                </label>
                <p class="pl-1">ou drag e drop</p>
              </div>
              <p class="text-xs text-gray-500">PDF no máximo de 10MB</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div v-for="file in docsAddress" :key="'adress-' + (file as any).name" class="mt-4">
              <span class="badge bg-blue-100 px-4 py-1 rounded-full text-xs flex items-center gap-3">
                {{ (file as any).name }}
                <button @click="removeFile(file, 'docsAddress')">
                  <Icon name="ic:round-close" size="1.2rem" color="#IE40AF" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-bold mt-4">
            RG ou CNH dos sócios
            <p class="text-xs font-medium">
              *Foto legível, frente e verso do documento original ou autenticado, que contenha o número do CPF. Outros
              documentos podem ser solicitados para a conclusão do cadastro.
            </p>
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="rg-cnh-owners"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-0"
                >
                  <span>Escolha um arquivo</span>
                  <input
                    id="rg-cnh-owners"
                    name="docsRg"
                    type="file"
                    multiple
                    class="sr-only"
                    @change="handleFileChange"
                  />
                </label>
                <p class="pl-1">ou drag e drop</p>
              </div>
              <p class="text-xs text-gray-500">PDF no máximo de 10MB</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div v-for="file in docsRg" :key="'rg-' + (file as any).name" class="mt-4">
              <span class="badge bg-blue-100 px-4 py-1 rounded-full text-xs flex items-center gap-3">
                {{ (file as any).name }}
                <button @click="removeFile(file, 'docsRg')">
                  <Icon name="ic:round-close" size="1.2rem" color="#IE40AF" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <fieldset>
            <div class="mt-4 space-y-4">
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    v-model="form.agency.privacy_policy_accept"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="comments" class="font-medium text-gray-700"
                    >Ao enviar meus dados concordo com a política de privacidade</label
                  >
                </div>
              </div>
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="marketing-accpet"
                    name="marketing-accpet"
                    type="checkbox"
                    v-model="form.user.email_marketing_accept"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="candidates" class="font-medium text-gray-700">Aceito receber comunidados da BRT</label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="pt-5">
      <div class="text-[10px] mb-4 ml-1 text-red-600 text-right" v-if="isFormEmpty">
        Você possui campos em branco ou inválidos!
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          @click="navigateTo('/login')"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voltar Login
        </button>
        <button
          type="button"
          @click="submitForm"
          :disabled="isFormEmpty"
          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
          :class="{
            'bg-gray-300': isFormEmpty,
            'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500':
              !isFormEmpty,
          }"
        >
          {{ isFormEmpty ? 'Preencha os dados' : 'Enviar Cadastro' }}
        </button>
      </div>
    </div>
  </form>
</template>
