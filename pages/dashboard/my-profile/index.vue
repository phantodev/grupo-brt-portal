<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import useApiUrl from '../../../composables/useApiUrl';
import useImageResizer from '../../../composables/useImageResizer';
const { resizeImage } = useImageResizer();
import { useToast } from 'vue-toastification';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
const toast = useToast();

const dataUser = ref({
  image: '',
  name: '',
  email: '',
  rg: '',
  cpf: '',
  phone: '',
  cellphone: '',
});

const avatar = ref<string | ArrayBuffer | null>(null);
const showText = ref(true);

const triggerFileInput = () => {
  const fileInput = document.getElementById('fileInput');
  fileInput?.click();
};

const handleFileUpload = (event: any) => {
  event.stopPropagation();
  const file = event.target?.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => resizeImage(e, avatar, showText, 300, 300);
    reader.readAsDataURL(file);
  }
};

const updateUserProfile = async () => {
  // Pegar o token do localStorage
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  const token = authLocalStore.token;
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/v1/user/update-profile`,
      {
        image: dataUser.value.image,
        name: dataUser.value.name,
        email: dataUser.value.email,
        rg: dataUser.value.rg,
        cpf: dataUser.value.cpf,
        phone: dataUser.value.phone,
        cellphone: dataUser.value.cellphone,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data) {
      toast.success('Usuário atualizado com sucesso!');
    }
  } catch (error: any) {
    toast.error('Problemas com a API da BRT. Entre em contato!');
  }
};

const getUserLoggedIn = async () => {
  // Pegar o token do localStorage
  const authLocalStore = JSON.parse(localStorage.getItem('authStore') || '{}');
  const token = authLocalStore.token;
  try {
    const { data } = await axios.get(`${apiUrl}/api/v1/user-logged-in`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    dataUser.value.name = data.data.name;
    dataUser.value.email = data.data.email;
    dataUser.value.rg = data.data.rg;
    dataUser.value.cpf = data.data.cpf;
    dataUser.value.phone = data.data.phone;
    dataUser.value.cellphone = data.data.cellphone;
  } catch (error: any) {
    toast.error('Problemas com a API da BRT. Entre em contato!');
  }
};

getUserLoggedIn();
</script>
<template>
  <NuxtLayout name="search-layout">
    <header class="container-header">
      <CurrencyHeader />
      <NavBar />
      <section class="wrapper-list-budgets">
        <section class="container-list-budgets">
          <div class="container-title-package-customer-logo">
            <div class="title-list-budget w-full text-left">Meu Perfil</div>
            <div class="sm:col-span-12">
              <div class="mt-1">
                <div style="position: relative">
                  <div
                    class="h-40 w-40 bg-gray-200 rounded-full flex justify-center items-center text-gray-400 font-bold text-xs flex-col gap-2"
                  >
                    <img v-if="avatar" :src="avatar as string" alt="" class="object-cover h-full w-full rounded-full" />
                    <span v-if="!avatar">
                      <img src="~/assets/avatar.svg" alt="" class="w-10 h-10" />
                    </span>
                    <span v-if="showText">Alterar Avatar</span>
                  </div>
                  <input type="file" id="fileInput" @change="handleFileUpload" style="display: none" />
                  <div
                    @click="triggerFileInput"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                  ></div>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                  <label for="cnpj" class="block text-sm font-medium text-gray-700"> Nome </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      v-model="dataUser.name"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="last-name" class="block text-sm font-medium text-gray-700"> E-mail </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      v-model="dataUser.email"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="phone" class="block text-sm font-medium text-gray-700"> RG </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="rg"
                      id="rg"
                      v-model="dataUser.rg"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="last-name" class="block text-sm font-medium text-gray-700"> CPF </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="cpf"
                      id="cpf"
                      v-maska
                      data-maska="###.###.###-##"
                      v-model="dataUser.cpf"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="country" class="block text-sm font-medium text-gray-700"> Telefone </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      v-maska
                      data-maska="(##) #####-####"
                      v-model="dataUser.phone"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="street-address" class="block text-sm font-medium text-gray-700"> Celular </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      v-maska
                      data-maska="(##) #####-####"
                      v-model="dataUser.cellphone"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              @click="updateUserProfile"
              class="bg-blue-800 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white mt-6 w-full"
            >
              Atualizar Perfil
            </button>
          </div>
        </section>
      </section>
    </header>
  </NuxtLayout>
</template>

<style scoped>
.container-header {
  @apply h-96 bg-[url('/assets/couple-happy.webp')] bg-cover bg-center;
}
.customer-logo {
  @apply w-32 md:w-40;
}
.title-list-budget {
  @apply text-base md:text-2xl font-bold;
}
.container-title-package-customer-logo {
  @apply flex flex-col items-center justify-between w-full;
}
.container-list-budgets {
  @apply bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl relative flex flex-col items-center flex-1;
}
.wrapper-list-budgets {
  @apply flex justify-center;
}
.form-input {
  @apply h-12 p-4 rounded-md border border-gray-200 text-sm placeholder-gray-300;
}
.btn-search {
  @apply bg-blue-800 border-0 p-4 text-white rounded-md text-xs font-bold;
}
</style>
