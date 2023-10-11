<script setup lang="ts">
import axios from 'axios';
import useApiUrl from '@/composables/useApiUrl';
import { useAuthStore } from '../../stores/AuthStore';
const authStore = useAuthStore();
import { ref } from 'vue';
const { getApiUrl } = useApiUrl();
const apiUrl = getApiUrl();
import { useToast } from 'vue-toastification';
const toast = useToast();
const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    const { data } = await axios.post(`${apiUrl}/api/v1/login`, {
      email: email.value,
      password: password.value,
    });
    authStore.token = data.token;
    authStore.name = data.data.name;
    authStore.email = data.data.email;
    authStore.consultant = data.data.id;
    authStore.cnpjTenant = data.data.tenant.cpf_cnpj;
    authStore.permissions = data.data.permissions;
    navigateTo('/search');
  } catch (error) {
    toast.error('Credenciais inválidas!');
  }
}
</script>

<template>
  <NuxtLayout name="login-layout">
    <SupHeaderLogin />
    <section class="container-login">
      <div class="box-form">
        <h1>Login / Consolidadora</h1>
        <form action="">
          <input type="text" placeholder="Email/Usuário" class="form-input" v-model="email" />
          <input type="password" placeholder="Senha" class="form-input" v-model="password" />
          <div class="container-forgot">
            <div class="container-checkbox">
              <input id="default-checkbox" type="checkbox" value="" />
              <label for="default-checkbox" class="checkbox-label">Matenha-me conectado</label>
            </div>

            <div class="forgot" @click="navigateTo('/forgot')">Esqueci minha senha</div>
          </div>
          <button type="button" class="submit-enter" @click="handleLogin">ENTRAR</button>
        </form>
        <div class="container-btn-secondary">
          <button
            class="btn-secondary"
            @click="
              navigateTo('https://grupobrt.com.br/contatos/', {
                open: {
                  target: '_blank',
                },
              })
            "
          >
            <Icon name="ph:chats" size="1.2rem" color="#114E8C" />CONTATOS
          </button>
          <button
            class="btn-secondary"
            @click="
              navigateTo('https://brtconsolidadora.com.br/oldbrt/lamina/financiamentos.php', {
                open: {
                  target: '_blank',
                },
              })
            "
          >
            <Icon name="material-symbols:attach-money" size="1.2rem" color="#114E8C" />FINANCIAMENTOS
          </button>
        </div>
        <section class="text-center mt-10">
          <span class="font-bold">Ainda não é cadastrado?</span>
          <p class="text-xs">
            A BRT tem a certeza que este portal será um diferencial em suas vendas futuras! Clique abaixo, acesse nosso
            portal e começe a fazer parte do seleto grupo de usuários.
          </p>
          <button class="font-bold text-blue-700 underline mt-10" @click="navigateTo('/signup')">
            CADASTRAR MINHA AGÊNCIA
          </button>
        </section>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.container-checkbox {
  @apply flex items-center;
}
.container-forgot {
  @apply flex justify-between;
}
.container-btn-secondary {
  @apply flex gap-4 mt-4;
}

.box-form {
  @apply w-full max-w-sm;
}

.checkbox-label {
  @apply ml-2 font-medium text-xs;
}
.container-login {
  @apply flex flex-1 justify-center items-center p-4;
}
.forgot {
  @apply text-xs text-blue-800;
}
.form-input {
  @apply h-12 p-4 rounded-md border border-gray-200 text-sm placeholder-gray-300;
}

.submit-enter {
  @apply bg-blue-800 border border-blue-800 p-4 text-white rounded-md text-xs font-bold hover:bg-sky-100 hover:text-blue-900 transition-colors duration-300;
}
form {
  @apply flex flex-col gap-4;
}
h1 {
  @apply text-2xl lg:text-3xl font-bold mb-12;
}
</style>
