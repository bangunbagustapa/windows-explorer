<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import type { SearchResult } from "@windows-explorer/shared";
import { api } from "../api/client";
import { useExplorerStore } from "../stores/explorer";
import { UiIcon, UiSpinner, UiEmptyState } from "../ui";

const store = useExplorerStore();

const query = ref("");
const results = ref<SearchResult[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const isOpen = ref(false);
const selectedIndex = ref(0);

async function search() {
  const trimmedQuery = query.value.trim();
  if (!trimmedQuery) {
    results.value = [];
    isOpen.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    results.value = await api.search(trimmedQuery, 20);
    isOpen.value = true;
    selectedIndex.value = 0;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Search failed";
  } finally {
    loading.value = false;
  }
}

function handleSelect(result: SearchResult) {
  store.select(result.id);
  store.expandAncestors(result.path, buildFolderMap());
  query.value = "";
  isOpen.value = false;
}

function buildFolderMap(): Map<string, number> {
  // Build a map of path -> id for ancestor expansion
  // This is a simplified version - in production, you'd want to fetch this from the tree
  const map = new Map<string, number>();
  // For now, we'll rely on the tree component to handle expansion
  return map;
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isOpen.value || results.value.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length;
      break;
    case "Enter":
      event.preventDefault();
      if (results.value[selectedIndex.value]) {
        handleSelect(results.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      isOpen.value = false;
      break;
  }
}

// Debounce search
let timeoutId: number | null = null;
watch(query, (newQuery) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search();
  }, 300) as unknown as number;
});

// Close dropdown when clicking outside
const searchBoxRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="searchBoxRef" class="relative w-full">
    <div class="relative">
      <UiIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input
        v-model="query"
        type="text"
        placeholder="Search folders..."
        class="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        @focus="isOpen = results.length > 0"
        @keydown="handleKeyDown"
      />
      <button
        v-if="query"
        @click="query = ''; isOpen = false"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-neutral-100"
      >
        <UiIcon name="x" class="w-4 h-4 text-neutral-400" />
      </button>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
    >
      <div v-if="loading" class="flex justify-center py-4">
        <UiSpinner class="w-5 h-5" />
      </div>

      <UiEmptyState
        v-else-if="error"
        :message="error"
        class="text-sm py-4"
      />

      <UiEmptyState
        v-else-if="results.length === 0"
        message="No results found"
        class="text-sm py-4"
      />

      <div v-else>
        <div
          v-for="(result, index) in results"
          :key="result.id"
          @click="handleSelect(result)"
          :class="[
            'px-4 py-2 cursor-pointer hover:bg-neutral-100 transition-colors',
            index === selectedIndex ? 'bg-accent-50' : ''
          ]"
        >
          <div class="flex items-center gap-2">
            <UiIcon name="folder" class="w-4 h-4 text-accent-500" />
            <span class="text-sm text-neutral-700">{{ result.name }}</span>
          </div>
          <div class="text-xs text-neutral-500 mt-1 ml-6">
            {{ result.path.join(" / ") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
