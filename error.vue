<template>
  <main
    class="min-h-full bg-cover bg-center"
    style="
      height: 100vh;
      background-image: url('https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75');
    "
  >
    <div class="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 lg:px-8 flex justify-center items-center flex-col">
      <img src="/assets/brt-logo-white.svg" alt="" class="w-20 mb-2 md:w-40 md:mb-6" />
      <p class="text-2xl font-extrabold text-black text-opacity-50 uppercase tracking-wide">404 error</p>
      <h1 class="mt-2 text-lg md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
        Uh oh! Eu acho que nos perdemos.
      </h1>
      <p class="mt-2 text-sm md:text-lg md:px-20 font-semibold text-black text-opacity-50">
        Você está procurando uma página que não existe ou teve um problema de acesso ao sistema.
      </p>
      <div class="mt-6">
        <button
          @click="navigateTo('/search')"
          class="font-semibold inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md text-black text-opacity-75 bg-white bg-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50"
        >
          Voltar para Busca
        </button>
      </div>
    </div>
  </main>
</template>
