<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="['animate-spin rounded-full border-2 border-neutral-300 border-t-accent-600', props.class]"
    role="status"
    aria-label="Loading"
  />
</template>
