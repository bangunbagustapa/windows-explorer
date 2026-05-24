<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="['bg-white border border-neutral-200 rounded-lg shadow-sm', props.class]">
    <slot name="header" />
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
