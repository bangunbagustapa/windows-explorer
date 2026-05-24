<script setup lang="ts">
import { watch, ref } from "vue";
import type { FolderChild } from "@windows-explorer/shared";
import { api } from "../api/client";
import { useExplorerStore } from "../stores/explorer";
import { UiIcon, UiSpinner, UiEmptyState, UiErrorState } from "../ui";

const store = useExplorerStore();

const subfolders = ref<FolderChild[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadSubfolders() {
  try {
    loading.value = true;
    error.value = null;
    
    if (store.selectedId === null) {
      subfolders.value = [];
    } else {
      subfolders.value = await api.getChildren(store.selectedId);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load subfolders";
  } finally {
    loading.value = false;
  }
}

function handleDoubleClick(folder: FolderChild) {
  store.select(folder.id);
  // Note: ancestor expansion will be handled by the tree component
}

// Watch for selection changes
watch(() => store.selectedId, () => {
  loadSubfolders();
});
</script>

<template>
  <div v-if="loading" class="flex justify-center py-8">
    <UiSpinner class="w-6 h-6" />
  </div>

  <UiErrorState v-else-if="error" :message="error" class="text-sm" />

  <UiEmptyState 
    v-else-if="subfolders.length === 0 && store.selectedId" 
    message="This folder is empty" 
    class="text-sm" 
  />

  <div v-else-if="subfolders.length > 0" class="grid grid-cols-4 gap-4">
    <div
      v-for="folder in subfolders"
      :key="folder.id"
      @dblclick="handleDoubleClick(folder)"
      class="flex flex-col items-center p-4 bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-accent-400 hover:shadow-md transition-all"
    >
      <UiIcon name="folder" class="w-12 h-12 text-accent-500 mb-2" />
      <span class="text-sm text-neutral-700 text-center truncate w-full">{{ folder.name }}</span>
    </div>
  </div>
</template>
