<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { UiIcon } from "./index";

interface Props {
  message?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  message: "Something went wrong",
});
</script>

<template>
  <div :class="['flex flex-col items-center justify-center py-12 text-red-600', props.class]">
    <UiIcon name="x" class="w-12 h-12 mb-4 text-red-300" />
    <p>{{ props.message }}</p>
  </div>
</template>
