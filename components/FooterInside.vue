<template>
  <footer class="wrapper-footer">
    <section class="container-footer">
      <div class="left-infos">
        <a href="#">
          <img src="~/assets/brt-icone.svg" />
        </a>

        <a href="tel:0800-6455400" target="_blank" class="left-infos-btn">
          <Icon name="ph:phone-call" size="1.2rem" color="#ffffff" />
          <span class="text-infos"> 0800-6455400 </span>
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=554132195400"
          target="_blank"
          class="left-infos-btn"
        >
          <Icon name="ic:baseline-whatsapp" size="1.2rem" color="#ffffff" />
          <span class="text-infos">(41) 3219-5400</span>
        </a>

        <a
          href="mailto:consolidadora@grupobrt.com.br"
          target="_blank"
          class="left-infos-btn"
        >
          <Icon name="ph:envelope-light" size="1.2rem" color="#ffffff" />
          <span class="text-infos"> consolidadora@grupobrt.com.br </span>
        </a>
      </div>
      <div class="flex items-center gap-2">
        <strong><span class="text-infos">Nossas redes sociais:</span></strong>

        <a href="#" target="_blank">
          <Icon name="cib:facebook" size="1.2rem" color="#ffffff" />
        </a>
      </div>
    </section>
  </footer>
</template>
<style scoped>
.text-infos {
  @apply hidden md:block;
}
.left-infos-btn {
  @apply flex gap-2 items-center;
}
.wrapper-footer {
  @apply bg-blue-800 text-white mt-10 flex justify-center px-8 lg:px-0;
}
.container-footer {
  @apply w-full max-w-6xl flex flex-row items-center justify-between py-4;
}
.left-infos {
  @apply flex flex-row items-center gap-4;
}
</style>
