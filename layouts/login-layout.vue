<template>
  <main class="lg:grid lg:grid-cols-2 h-screen">
    <section class="container-couple">
      <div class="container-logo">
        <!-- <img src="/assets/brt-logo-white.svg" alt="" /> -->
      </div>
      <div class="footer-photo-infos">
        <div><img src="../assets/brt-icone.svg" alt="" /></div>
        <div class="flex gap-4">
          <div class="container-infos"><PhoneIcon /><span>0800-6455400</span></div>
          <div class="container-infos"><EmailIcon /><span>consolidadora@grupobrt.com.br</span></div>
        </div>
      </div>
    </section>
    <aside class="overflow-y-auto">
      <slot />
    </aside>
  </main>
</template>

<style scoped>
.container-infos {
  @apply flex items-center gap-2;
}
.footer-photo-infos {
  @apply bg-blue-800 h-14 w-full flex text-white items-center px-4 justify-between;
}
.container-couple {
  @apply hidden lg:flex flex-col items-center justify-center h-full bg-[url('/assets/bg-birthday.jpg')] bg-no-repeat bg-center bg-cover;
}
.container-logo {
  @apply flex-1 flex justify-center items-center;
}
aside {
  @apply h-screen flex flex-col;
}
</style>
