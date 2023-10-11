<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
const config = useRuntimeConfig();
const email = ref('');
const toast = useToast();
const isLoading = ref(false);

async function handleForgotPassword() {
  isLoading.value = true;
  try {
    const { data } = await axios.post(
      `${config.public.HOMOLOG_API}/api/v1/send-reset-password`,
      {
        email: email.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accpet: 'application/json',
        },
      }
    );
    if (data) {
      toast.success('Se este e-mail existir, clique no LINK enviado!', {
        onClose: () => {
          isLoading.value = false;
          navigateTo('/login');
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <NuxtLayout name="login-layout">
    <SupHeaderLogin />
    <section class="container-login">
      <div class="box-form">
        <h1>Esqueci minha senha!</h1>
        <p class="text-xs mb-10">
          Caso você tenha esquecido a sua senha, digite-o no campo abaixo e
          solicite um novo link para o reset de sua senha.
        </p>
        <form action="">
          <input
            type="text"
            placeholder="Digite seu e-mail aqui"
            class="form-input"
            v-model="email"
          />

          <button
            type="button"
            :disabled="isLoading"
            class="submit-enter"
            @click="handleForgotPassword"
          >
            <div v-if="!isLoading">ENTRAR</div>
            <div v-else><Spinner /></div>
          </button>
        </form>
        <section class="text-center mt-10">
          <span class="font-bold">Lembrou de sua senha?</span>
          <button
            class="font-bold text-blue-700 underline mt-4"
            @click="navigateTo('/login')"
          >
            VOLTAR PARA A PÁGINA DE LOGIN
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
  @apply bg-blue-800 border border-blue-800 p-4 text-white rounded-md text-xs font-bold;
}
form {
  @apply flex flex-col gap-4;
}
h1 {
  @apply text-2xl lg:text-3xl font-bold mb-8;
}
</style>
