<template>
  <div class="container-input">
    <div class="container-label-input">
      <div class="label-input">{{ props.title }}</div>
      <div class="flex justify-start items-start">
        <Icon :name="props.iconName" size="1.2rem" color="#1e40af" />
      </div>
    </div>
    <div>
      <input
        class="input"
        :value="modelValue"
        :placeholder="props.placeholder"
        @input="
          $emit(
            'update:modelValue',
            Number(($event.target as HTMLInputElement)?.value)
          )
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue']);
const props = defineProps({
  dynamicComponent: {
    type: Object,
  },
  stateInPinia: {
    type: Number,
  },
  placeholder: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: '',
  },
  updateStore: {
    type: Function,
  },
  modelValue: {
    type: Number,
  },
});
</script>

<style scoped>
.container-input {
  @apply bg-blue-50 p-3 rounded-md w-full;
}
.container-label-input {
  @apply flex justify-between;
}
.label-input {
  @apply text-xs text-blue-800 font-semibold;
}
.input {
  @apply text-sm border-0 bg-transparent focus:ring-0 p-0;
}
</style>
