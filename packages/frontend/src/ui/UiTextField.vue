<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props {
  modelValue: string;
  placeholder?: string;
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="relative">
    <slot name="leading" />
    <input
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
        props.class,
      ]"
    />
    <slot name="trailing" />
  </div>
</template>
