import { defineStore } from "pinia";
import { ref } from "vue";

export const useExplorerStore = defineStore("explorer", () => {
  const selectedId = ref<number | null>(null);
  const expanded = ref<Set<number>>(new Set());

  function select(id: number | null) {
    selectedId.value = id;
  }

  function toggleOpen(id: number) {
    if (expanded.value.has(id)) {
      expanded.value.delete(id);
    } else {
      expanded.value.add(id);
    }
  }

  function expandAncestors(path: string[], folderMap: Map<string, number>) {
    let currentPath = "";
    for (const name of path) {
      currentPath = currentPath ? `${currentPath}/${name}` : name;
      const id = folderMap.get(currentPath);
      if (id) {
        expanded.value.add(id);
      }
    }
  }

  function isExpanded(id: number): boolean {
    return expanded.value.has(id);
  }

  function clearExpanded() {
    expanded.value.clear();
  }

  return {
    selectedId,
    expanded,
    select,
    toggleOpen,
    expandAncestors,
    isExpanded,
    clearExpanded,
  };
});
