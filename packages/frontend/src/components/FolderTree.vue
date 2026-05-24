<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { FolderTreeNode } from "@windows-explorer/shared";
import { api } from "../api/client";
import { UiSpinner, UiErrorState, UiEmptyState } from "../ui";
import FolderNode from "./FolderNode.vue";

const tree = ref<FolderTreeNode[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadTree() {
  try {
    loading.value = true;
    error.value = null;
    tree.value = await api.getTree();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load folder tree";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTree();
});
</script>

<template>
  <div v-if="loading" class="flex justify-center py-8">
    <UiSpinner class="w-6 h-6" />
  </div>

  <UiErrorState v-else-if="error" :message="error" class="text-sm" />

  <div v-else-if="tree.length === 0">
    <UiEmptyState message="No folders found" class="text-sm" />
  </div>

  <div v-else>
    <FolderNode
      v-for="node in tree"
      :key="node.id"
      :node="node"
      :depth="0"
    />
  </div>
</template>
