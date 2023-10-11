<script setup lang="ts">
useHead({
  title: 'Cadastro BRT',
  script: [
    {
      src: 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/c0712c6e-b0c0-41aa-af78-c8d87ca4de57-loader.js',
      type: 'text/javascript',
      async: true,
    },
  ],
});
</script>

<template>
  <NuxtLayout name="login-layout">
    <SupHeaderLogin />
    <main class="p-10">
      <Form />
    </main>
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
