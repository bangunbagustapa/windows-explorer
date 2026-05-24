<script setup lang="ts">
import type { HTMLAttributes } from "vue";

type Variant = "default" | "ghost";
type Size = "sm" | "md";

interface Props {
  variant?: Variant;
  size?: Size;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
});

const baseClasses = "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  default: "bg-accent-600 text-white hover:bg-accent-700",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
};
</script>

<template>
  <button
    :class="[baseClasses, variantClasses[props.variant], sizeClasses[props.size], props.class]"
  >
    <slot />
  </button>
</template>
