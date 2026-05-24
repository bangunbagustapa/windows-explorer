<script setup lang="ts">
import { computed } from "vue";
import type { FolderTreeNode } from "@windows-explorer/shared";
import { useExplorerStore } from "../stores/explorer";
import { UiIcon } from "../ui";

interface Props {
  node: FolderTreeNode;
  depth: number;
}

const props = defineProps<Props>();

const store = useExplorerStore();

function handleClick() {
  store.select(props.node.id);
}

function handleChevronClick(event: MouseEvent) {
  event.stopPropagation();
  store.toggleOpen(props.node.id);
}

const isSelected = computed(() => store.selectedId === props.node.id);
const isExpanded = computed(() => store.isExpanded(props.node.id));
</script>

<template>
  <div>
    <div
      :class="[
        'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors',
        isSelected ? 'bg-accent-100 text-accent-700' : 'hover:bg-neutral-100 text-neutral-700',
      ]"
      :style="{ paddingLeft: `${props.depth * 16 + 8}px` }"
      @click="handleClick"
    >
      <button
        @click="handleChevronClick"
        class="p-0.5 rounded hover:bg-neutral-200 transition-colors"
        :class="{ 'invisible': node.children.length === 0 }"
      >
        <UiIcon
          :name="isExpanded ? 'chevron-down' : 'chevron-right'"
          class="w-4 h-4 text-neutral-500"
        />
      </button>
      <UiIcon
        :name="isExpanded ? 'folder-open' : 'folder'"
        class="w-4 h-4 text-neutral-500"
      />
      <span class="text-sm truncate">{{ node.name }}</span>
    </div>

    <FolderNode
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :depth="depth + 1"
      v-if="isExpanded"
    />
  </div>
</template>
