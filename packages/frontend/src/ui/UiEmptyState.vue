<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props {
  message?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  message: "No data available",
});
</script>

<template>
  <div :class="['flex flex-col items-center justify-center py-12 text-neutral-500', props.class]">
    <UiIcon name="folder" class="w-12 h-12 mb-4 text-neutral-300" />
    <p>{{ props.message }}</p>
  </div>
</template>
